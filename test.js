/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-12-31 22:50:21
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-01-01 16:57:29
 */
const fs = require("fs")
const path = require("path")
// const LZString = require("lz-string")

// const obj = require("./src/store/province/index.json")

// const str = JSON.stringify(obj)

// const compressed = LZString.compressToUint8Array(str);

// fs.writeFile("a.txt", compressed, err => { console.log(err); })

// const string = LZString.decompressFromUint8Array(compressed);

// fs.writeFile("b.json", string, err => { console.log(err); })

fs.readFile("./src/store/province/index.json", "utf-8", (err, data) => {
    const obj = JSON.parse(data)
    const content = obj.map(item => {
        return { ...item, location: { latitude: item.location.lat, longitude: item.location.lng } }
    })
    fs.writeFile(path.resolve(__dirname, 'src', 'province', 'index.json'), JSON.stringify(content), err => { console.log(err); })
    console.log(content);
})