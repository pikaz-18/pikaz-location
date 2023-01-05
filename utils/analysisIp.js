/*
 * @Description: 这是解析ip地址文件工具（组件）
 * @Date: 2022-12-21 11:07:13
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-01-05 11:20:00
 */
const fs = require("fs");
const path = require("path")
const originAreaList = require("../store/areaList/index.json")
const { addZero } = require("../src/ip")
const { analysisAddress } = require("../src/code")
const { removeDir } = require("./common")

const projectPath = process.cwd()

const areaList = originAreaList.map(item => {
    const { id, shortName, children } = item
    return {
        id, shortName, children: children.map(child => {
            return { id: child.id }
        })
    }
})

/**
 * @description: 获取至少市级code
 * @param {*} codeObj
 * @return {*}
 */
const getIpCode = (codeObj) => {
    const { province, city, district } = codeObj
    if (district) {
        return district
    }
    if (city) {
        return city
    }
    // 没有市则取省会
    const item = areaList.find(item => item.id === province)
    if (item && item.children.length) {
        return item.children[0].id
    }
    return null
}

/**
 * @description: 解析ip文件(ip.txt文件放至根目录处)
 * @return {*}
 */
const analysis = async () => {
    const str = fs.readFileSync(path.join(projectPath, "ip.txt"), "utf8")
    if (!str) {
        console.log("ip文件不存在");
        return
    }
    // 清空ip文件夹
    const content = path.join(projectPath, "store", "ip")
    if (fs.existsSync(content)) {
        removeDir(content)
    }
    fs.mkdirSync(content)
    const ipArr = str.split("\r\n")
    const arr = []
    // 跨第一段ip，拆开
    for (let i = 0; i < ipArr.length; i++) {
        const [start, end] = ipArr[i].split(/\s+/)
        const [a1] = start.split(".")
        const [a2] = end.split(".")
        if (a1 !== a2) {
            let b = a1
            while (b <= a2) {
                if (b !== a2) {
                    if (b === a1) {
                        arr.push(ipArr[i].replace(end, `${b}.255.255.255`))
                    } else {
                        arr.push(ipArr[i].replace(start, `${b}.0.0.0`).replace(end, `${b}.255.255.255`))
                    }
                } else {
                    arr.push(ipArr[i].replace(start, `${b}.0.0.0`))
                }
                b++
            }
        } else {
            arr.push(ipArr[i])
        }
    }
    // 跨第二段ip，拆开
    for (let i = 0; i < ipArr.length; i++) {
        const [start, end] = ipArr[i].split(/\s+/)
        const [f1, a1] = start.split(".")
        const [f2, a2] = end.split(".")
        if (a1 !== a2) {
            let b = a1
            while (b <= a2) {
                if (b !== a2) {
                    if (b === a1) {
                        arr.push(ipArr[i].replace(end, `${f1}.${b}.255.255`))
                    } else {
                        arr.push(ipArr[i].replace(start, `${f1}.${b}.0.0`).replace(end, `${f1}.${b}.255.255`))
                    }
                } else {
                    arr.push(ipArr[i].replace(start, `${f1}.${b}.0.0`))
                }
                b++
            }
        } else {
            arr.push(ipArr[i])
        }
    }
    const result = {}
    // 筛选国内ip段
    for (let i = 0; i < arr.length; i++) {
        const [start, end, address] = arr[i].split(/\s+/)
        const [a, b] = start.split(".")
        const isChina = areaList.some(item => {
            return address.indexOf(item.shortName) !== -1
        })
        if (isChina) {
            const item = { district: [addZero(start), addZero(end)], start, end, address }
            const key = `${a}.${b}`
            if (result[key]) {
                result[key].push(item)
            } else {
                result[key] = [item]
            }
        }
    }
    const keys = Object.keys(result)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const info = []
        for (let j = 0; j < result[key].length; j++) {
            const item = result[key][j]
            const addressCode = await analysisAddress(item.address, originAreaList)
            const id = getIpCode(addressCode)
            if (id) {
                info.push({ district: item.district, start: item.start, end: item.end, id })
            }
        }
        fs.writeFileSync(path.join(projectPath, "store", "ip", `${key}.json`), JSON.stringify(info))
    }
}

analysis()