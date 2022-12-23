/*
 * @Description: 这是***页面（组件）
 * @Date: 2022-12-21 11:37:29
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-12-21 15:10:35
 */
const areaList = require("../store/areaList/index.json")

/**
 * @description: 获取行政单位code编码
 * @param {*} name/地理位置名称
 * @param {*} list/行政单位列表
 * @return {*}
 */
const getAddressCode = ({ name, list }) => {
    let areaName = name
    const area = list.find(item => areaName.indexOf(item.shortName) !== -1)
    if (area) {
        let areaStrIndex = area.shortName.length
        if (areaName.indexOf(area.name) !== -1) {
            areaStrIndex = areaName.indexOf(area.name) + area.name.length
        }
        areaName = areaName.slice(areaStrIndex, name.length)
        return { id: area.id, name: areaName, children: area.children }
    }
    return null
}

/**
 * @description: 解析地址字符串
 * @param {*} str
 * @return {*}
 */
const searchAddress = (str) => {
    let name = str
    const code = { province: "", city: "", district: "" }
    // 省级
    const province = getAddressCode({ name, list: areaList })
    if (province) {
        name = province.name
        code.province = province.id
        // 市级
        const city = getAddressCode({ name, list: province.children })
        if (city) {
            name = city.name
            code.city = city.id
            // 区县
            const district = getAddressCode({ name, list: city.children })
            if (district) {
                name = district.name
                code.district = district.id
            }
        }
    }
    return code
}

module.exports = { searchAddress }