/*
 * @Description: 这是压缩文件工具（组件）
 * @Date: 2022-01-01 17:17:04
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-12-28 15:58:27
 */
const fs = require("fs")
const path = require("path")
const { compressToEncodedURIComponent } = require("lz-string")
const hash = require("object-hash")
const { removeDir } = require("./common")

// 每个文件内容的hash值
const code = {}

const staticPath = path.join(__dirname, '../static')

// 清空static文件夹
if (fs.existsSync(staticPath)) {
    removeDir(staticPath)
    fs.mkdirSync(staticPath)
}

// 将store目录内的文件压缩存放到static目录下
const files = fs.readdirSync(path.join(__dirname, '../store'))
for (let i = 0; i < files.length; i++) {
    const content = fs.readdirSync(path.join(__dirname, '../store', files[i]))
    for (let j = 0; j < content.length; j++) {
        const data = fs.readFileSync(path.join(__dirname, '../store', files[i], content[j]), 'utf-8')
        const str = compressToEncodedURIComponent(data)
        const jsonStr = { s: str }
        code[`${files[i]}${content[j]}`] = hash(jsonStr)
        const fileDir = path.join(__dirname, '../static', files[i])
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir)
        }
        fs.writeFileSync(path.join(__dirname, '../static', files[i], content[j]), JSON.stringify(jsonStr), 'utf-8')
    }
}

// 校验静态文件是否有更新，若有更新，则更新package.json下的文件时间
const hashStr = hash(code)
const package = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
const packageJson = JSON.parse(package)
if (packageJson.fileCode !== hashStr) {
    const date = new Date()
    packageJson.fileCode = hashStr
    packageJson.fileDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}`
    fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(packageJson), 'utf-8')
}