/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-12-26 22:58:52
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-03-08 23:12:05
 */
const config = require('./config')
const { getGeo, getGeoCode } = require('./geo')
const {
    getList,
    searchCodeInfo,
    searchStrAddress,
    searchCodeDetailInfo,
} = require('./code')
const { getIpCode } = require('./ip')

/**
 * @description: 超时处理
 * @param {*} fuc
 * @param {*} timeout/超时时间（单位毫秒）
 * @return {*}
 */
const timeoutFuc = async (fuc, params = {}) => {
    let { timeout } = { ...config.config, ...params }
    const timeRace = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('定位超时'))
            }, timeout)
        })
    }
    const result = await Promise.race([fuc(params), timeRace()])
    return result
}

/**
 * @description: 设置全局默认参数
 * @param {*} timeout/超时时间（单位毫秒）
 * @param {*} url/cdn地址
 * @return {*}
 */
const setConfig = ({ timeout, url }) => {
    config.set({ timeout, url })
}

/**
 * @description: h5定位
 * @param {*} timeout/超时时间（单位毫秒）
 * @param {*} enableHighAccuracy/是否开启高精度定位
 * @param {*} detail/是否需要详细信息
 * @param {*} latitude/纬度
 * @param {*} longitude/经度
 * @return {*}
 */
const getH5Location = async (obj = {}) => {
    let { timeout, enableHighAccuracy, detail, latitude, longitude } = {
        ...config.config,
        ...obj,
    }
    // 不传经纬度，则使用浏览器定位
    if (!(latitude && longitude)) {
        const { latitude: lat, longitude: lon } = await getGeo({
            timeout,
            enableHighAccuracy,
        })
        latitude = lat
        longitude = lon
    }
    const result = await timeoutFuc(
        async () => {
            const code = await getGeoCode({ latitude, longitude })
            if (!code) {
                throw new Error('非中国境内')
            }
            const info = await searchCodeInfo({ code, detail })
            return { ...info, latitude, longitude }
        },
        {
            timeout,
        }
    )
    return result
}

/**
 * @description: ip定位
 * @param {*} detail/是否需要详细信息
 * @param {*} ip/ip地址
 * @return {*}
 */
const getIpLocation = async (obj = {}) => {
    let { detail, ip } = { ...config.config, ...obj }
    // 不传ip则获取本机ip
    const { code, ip: localIp } = await getIpCode({ ip })
    if (!ip) {
        ip = localIp
    }
    const result = await searchCodeInfo({ code, detail })
    return { ...result, ip }
}

/**
 * @description: 获取定位（优先使用浏览器定位，若失败，则使用ip定位）
 * @param {*} obj
 * @return {*}
 */
const getLocation = async (obj = {}) => {
    try {
        const result = await getH5Location(obj)
        return { ...result, type: 'h5' }
    } catch (error) {
        const result = await timeoutFuc(getIpLocation, obj)
        return { ...result, type: 'ip' }
    }
}

/**
 * @description: 省市区三级联动
 * @param {*} code/地区编码
 * @return {*}该地区下的子级地区列表
 */
const searchList = async (obj = {}) => {
    const { code } = { ...obj }
    const list = await getList(code || '')
    return list || []
}

/**
 * @description: 解析字符串地址
 * @param {*} address/地址字符串
 * @param {*} detail/是否需要详细信息
 * @return {*}
 */
const searchAddress = async (obj = {}) => {
    const { address, detail } = { ...config.config, ...obj }
    const code = await searchStrAddress(address)
    if (!code) {
        throw new Error('解析地址失败，请确认地址包含省级或市级名称')
    }
    const result = await searchCodeInfo({ code, detail })
    return result
}

/**
 * @description: 解析地区编码地址
 * @param {*} code/地区编码
 * @param {*} detail/是否需要详细信息
 * @return {*}
 */
const searchCodeAddress = async (obj = {}) => {
    const { code, detail } = { ...config.config, ...obj }
    const result = await searchCodeInfo({ code, detail })
    return result
}

module.exports = {
    setConfig,
    getLocation,
    getH5Location,
    getIpLocation: (obj) => timeoutFuc(getIpLocation, obj),
    searchList,
    searchCodeAddress: (obj) => timeoutFuc(searchCodeAddress, obj),
    searchAddress: (obj) => timeoutFuc(searchAddress, obj),
    searchCodeDetail: (obj) => timeoutFuc(searchCodeDetailInfo, obj),
}
