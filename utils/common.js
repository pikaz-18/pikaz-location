/*
 * @Description: 这是公共方法页面（组件）
 * @Date: 2022-12-28 15:49:21
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-01-05 11:16:12
 */
const fs = require('fs')

/**
 * @description: 删除文件夹
 * @param {*} dir/文件夹地址
 * @return {*}
 */
const removeDir = (dir) => {
    const arr = fs.readdirSync(dir)
    for (let i = 0; i < arr.length; i++) {
        const v = dir + '/' + arr[i]
        const info = fs.statSync(v)
        if (info.isFile()) {
            fs.unlinkSync(v)
        } else {
            removeDir(v)
        }
    }
    fs.rmdirSync(dir)
}

// 直辖市
const munCity = ['110000', '120000', '310000', '500000']

module.exports = { removeDir, munCity }
