/*
 * @Description: 这是***页面（组件）
 * @Date: 2022-01-01 17:17:04
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-01-01 17:17:05
 */
fs.readdir(path.join(__dirname, './src/store'), function (err, files) {
    if (err) {
        console.log('目录不存在')
        return
    }
    files.forEach(file => {
        // console.log(file);
        fs.readdir(path.join(__dirname, './src/store', file), function (err, content) {
            if (err) {
                console.log('目录不存在')
                return
            }
            content.forEach(c => {
                fs.readFile(path.join(__dirname, './src/store', file, c), "utf-8", (err, data) => {
                    const obj = JSON.parse(data)
                    const acontent = obj.map(item => {
                        return { ...item, location: { latitude: item.location.lat, longitude: item.location.lng } }
                    })
                    fs.writeFile(path.join(__dirname, './src/store', file, c), JSON.stringify(acontent), err => { console.log(err); })
                })
            })
        })
    })
})