/*
 * @Description: 这是解析ip地址文件工具（组件）
 * @Date: 2022-12-21 11:07:13
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-12-28 15:51:14
 */
const fs = require("fs");
const path = require("path")
const areaList = require("../store/areaList/index.json")
const { addZero } = require("../src/ip")
const { searchAddress } = require("../src/code")
const { removeDir } = require("./common")

const projectPath = process.cwd()

/**
 * @description: 获取至少市级code
 * @param {*} code
 * @return {*}
 */
const getIpCode = (code) => {
    // 区县
    if (code.district) {
        return code.district
    }
    // 市级
    if (code.city) {
        return code.city
    }
    // 没有市则取省会
    const { children } = areaList.find(item => item.id === code.province)
    return children[0].id
}

/**
 * @description: 解析ip文件(ip.txt文件放至根目录处)
 * @return {*}
 */
const analysis = () => {
    const str = fs.readFileSync(path.join(projectPath, "ip.txt"), "utf8")
    if (!str) {
        console.log("ip文件不存在");
        return
    }
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
    const content = path.join(projectPath, "store", "ip")
    if (fs.existsSync(content)) {
        removeDir(content)
        fs.mkdirSync(content)
    } else {
        fs.mkdirSync(content)
    }
    Object.keys(result).forEach(key => {
        const info = result[key].map(item => {
            return { district: item.district, start: item.start, end: item.end, id: getIpCode(searchAddress(item.address)) }
        })
        fs.writeFileSync(path.join(projectPath, "store", "ip", `${key}.json`), JSON.stringify(info))
    })
}

analysis()