/*
 * @Description: 这是***页面（组件）
 * @Date: 2022-12-21 15:05:38
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-12-21 17:53:02
 */
const { decompressFromEncodedURIComponent } = require("lz-string")
const localforage = require("localforage")
const config = require("./config")
// 文件版本
const { fileVersion } = require("../package.json")

/**
 * @description: 获取在线文件
 * @param {*} url/文件url
 * @param {*} file/文件地址
 * @param {*} list/地址链接列表
 * @return {*}
 */
const fetchFile = async ({ url, file, list }) => {
    let webUrl = url
    if (!webUrl) {
        webUrl = list[0]
    }
    const index = list.findIndex(item => item === webUrl)
    try {
        const fileJson = await fetch(`${webUrl}/static/${file}.json`).then(res => res.json())
        const jsonStr = decompressFromEncodedURIComponent(fileJson.s)
        const result = JSON.parse(jsonStr)
        return result
    } catch (error) {
        // 最后一个路径失败则终止
        if (index === list.length - 1) {
            throw new Error("定位失败")
        }
        return fetchFile({ url: list[index + 1], file, list })
    }
}

class GetFile {
    constructor() {
        this.local = null
    }
    /**
     * @description: 获取文件
     * @param {*} dir/文件夹
     * @param {*} file/文件名
     * @return {*}
     */
    async get({ dir, file }) {
        if (!this.local) {
            const local = localforage.createInstance({
                name: "pikazLocation", storeName: "v" + fileVersion
            });
            await local.ready()
            this.local = local
        }
        // 先从本地拿
        const name = `${dir}@${file}`
        const localResult = await this.local.getItem(name)
        if (localResult) {
            return localResult
        }
        // 没有则从远程获取
        const result = await fetchFile({ file: `${dir}/${file}`, list: config.cdn })
        await this.local.setItem(name, result)
        return result
    }
}

module.exports = new GetFile()