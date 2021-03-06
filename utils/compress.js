/*
 * @Description: 这是压缩地理信息文件页面（组件）
 * @Date: 2022-01-01 17:17:04
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-01-09 21:54:50
 */
const fs = require("fs")
const path = require("path")
const { compressToEncodedURIComponent } = require("lz-string")

fs.readdir(path.join(__dirname, '../store'), function (err, files) {
    if (err) {
        console.log('目录不存在')
        return
    }
    files.forEach(file => {
        fs.readdir(path.join(__dirname, '../store', file), function (err, content) {
            if (err) {
                console.log('目录不存在')
                return
            }
            content.forEach(name => {
                fs.readFile(path.join(__dirname, '../store', file, name), "utf-8", (err, data) => {
                    const str = compressToEncodedURIComponent(data)
                    const jsonStr = { s: str }
                    fs.writeFile(path.join(__dirname, '../static', file, name), JSON.stringify(jsonStr), "utf-8", err => { err && console.log(err); })
                })
            })
        })
    })
})