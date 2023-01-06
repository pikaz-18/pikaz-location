/*
 * @Description: 这是地址与行政编码查询页面（组件）
 * @Date: 2022-12-21 11:37:29
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-01-07 00:59:38
 */
const getFile = require("./getFile");

/**
 * @description: 获取行政单位列表
 * @return {*}
 */
const getAreaList = async () => {
    const list = await getFile.get({ dir: "areaList", file: "index" })
    return list
}

/**
 * @description: 获取地址的code编码
 * @param {*} name/地理位置名称
 * @param {*} list/行政单位列表
 * @return {*}
 */
const getAddressCode = ({ name, list }) => {
    let areaName = name
    // 查全称
    const area = list.find(item => areaName.indexOf(item.name) !== -1)
    if (area) {
        const areaStrIndex = area.name.length
        areaName = areaName.slice(areaStrIndex, name.length)
        return { id: area.id, name: areaName, children: area.children }
    }
    // 查简称
    const short = list.find(item => areaName.indexOf(item.shortName) !== -1)
    if (short) {
        const areaStrIndex = short.shortName.length
        areaName = areaName.slice(areaStrIndex, name.length)
        return { id: short.id, name: areaName, children: short.children }
    }
    return null
}

/**
 * @description: 解析地址字符串（最低必须有省/市级）
 * @param {*} str/地区名称
 * @param {*} list/地区列表(若不传则从远程获取)
 * @return {*}
 */
const analysisAddress = async (str = "", list) => {
    let name = str
    const code = { province: "", city: "", district: "" }
    let areaList = list
    if (!list) {
        areaList = await getAreaList()
    }
    // 有省级
    const province = getAddressCode({ name, list: areaList })
    if (province) {
        name = province.name
        code.province = province.id
        // 有市级
        const cityList = province.children
        const city = getAddressCode({ name, list: cityList })
        if (city) {
            name = city.name
            code.city = city.id
            // 区县
            const district = getAddressCode({ name, list: city.children })
            if (district) {
                name = district.name
                code.district = district.id
            }
            return code
        }
        // 有区县
        // 区县列表
        const districtList = cityList.reduce((total, item) => {
            if (item.children) {
                return total.concat(item.children)
            }
            return total
        }, [])
        const district = getAddressCode({ name, list: districtList })
        if (district) {
            name = district.name
            code.district = district.id
        }
        return code
    }
    // 市级
    // 市级列表
    const cityList = areaList.reduce((total, item) => {
        if (item.children) {
            return total.concat(item.children)
        }
        return total
    }, [])
    const city = getAddressCode({ name, list: cityList })
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
    return code
}

/**
 * @description: 获取地址字符串的行政编码（最低必须有省/市级）
 * @param {*} str
 * @return {*}
 */
const searchStrAddress = async (str) => {
    const { province, city, district } = await analysisAddress(str)
    if (district) {
        return district
    }
    if (city) {
        return city
    }
    if (province) {
        return province
    }
    return null
}

/**
 * @description: 获取行政编码的地址信息
 * @param {*} code/行政编码
 * @return {*}
 */
const searchCode = async (obj = {}) => {
    let { code } = { ...obj }
    code = typeof code === "string" ? code : code.toString()
    const result = {
        //省级单位名称
        province: "",
        //省级地区编码
        provinceCode: "",
        // 市级单位名称
        city: "",
        //市级地区编码
        cityCode: "",
        // 区、县级单位名称
        district: "",
        //区、县级地区编码
        districtCode: "",
        //当前的行政编码
        code,
        // 完整地址
        address: ""
    }
    const areaList = await getAreaList()
    const check = areaList.every(province => {
        // 省级
        if (province.id === code) {
            result.province = province.name
            result.provinceCode = province.id
            return false
        }
        if (province.children) {
            return province.children.every(city => {
                if (city.id === code) {
                    result.province = province.name
                    result.provinceCode = province.id
                    result.city = city.name
                    result.cityCode = city.id
                    return false
                }
                if (city.children) {
                    return city.children.every(district => {
                        if (district.id === code) {
                            result.province = province.name
                            result.provinceCode = province.id
                            result.city = city.name
                            result.cityCode = city.id
                            result.district = district.name
                            result.districtCode = district.id
                            return false
                        }
                        return true
                    })
                }
                return true
            })
        }
        return true
    })
    if (check) {
        throw new Error("未找到该地区")
    }
    result.address = result.province + result.city + result.district
    return result
}

/**
 * @description: 获取行政编码的地址详细信息
 * @return {*}
 */
const searchCodeDetail = async ({ provinceCode, cityCode, districtCode }) => {
    const result = { province: {}, city: {}, district: {} }
    if (provinceCode) {
        const item = await getFile.get({ dir: "province", file: provinceCode })
        result.province = { code: item.id, location: item.location, name: item.name, pinyin: item.pinyin }
    }
    if (cityCode) {
        const arr = await getFile.get({ dir: "city", file: provinceCode })
        const item = arr.find(item => item.id === cityCode)
        result.city = { code: item.id, location: item.location, name: item.name, pinyin: item.pinyin }
    }
    if (districtCode) {
        const arr = await getFile.get({ dir: "district", file: cityCode })
        const item = arr.find(item => item.id === districtCode)
        result.district = { code: item.id, location: item.location, name: item.name, pinyin: item.pinyin }
    }
    return result
}

/**
 * @description: 获取地区编码地区信息
 * @param {*} code/地区编码
 * @param {*} detail/是否需要详情
 * @return {*}
 */
const searchCodeInfo = async ({ code, detail }) => {
    const { province, city, district, address, provinceCode, cityCode, districtCode } = await searchCode({ code })
    const result = { province, city, district, address, code }
    // 需要详细信息
    if (detail) {
        const detailInfo = await searchCodeDetail({ provinceCode, cityCode, districtCode })
        result.detail = detailInfo
    }
    return result
}

const searchCodeDetailInfo = async ({ code }) => {
    const { provinceCode, cityCode, districtCode } = await searchCode({ code })
    // 获取单个地区编码详细信息
    const info = await searchCodeDetail({ provinceCode, cityCode, districtCode })
    if (Object.keys(info.district).length) {
        return info.district
    }
    if (Object.keys(info.city).length) {
        return info.city
    }
    if (Object.keys(info.province).length) {
        return info.province
    }
}

/**
 * @description: 获取某地区编码下的地区列表
 * @param {*} code/地区编码
 * @param {*} areaList/地区列表
 * @return {*}
 */
const getList = async (code, areaList) => {
    let list = areaList
    if (!list) {
        list = await getAreaList()
    }
    if (!code) {
        return list.map(item => {
            return { code: item.id, name: item.name }
        })
    }
    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.id === code && item.children) {
            return item.children.map(item => {
                return { code: item.id, name: item.name }
            })
        }
        if (item.children) {
            const result = await getList(code, item.children)
            if (result) {
                return result
            }
        }
    }
}

module.exports = { getList, searchCodeInfo, searchStrAddress, analysisAddress, searchCodeDetailInfo }