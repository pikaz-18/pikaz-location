/*
 * @Description: 这是html5定位与经纬度查询页面（组件）
 * @Date: 2022-12-28 17:57:55
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-01-04 17:05:30
 */
const getFile = require("./getFile");
const pointInPolygon = require("point-in-polygon/flat")
const config = require("./config")

/**
 * @description: 获取经纬度
 * @param {*}enableHighAccuracy/是否需要高精度定位
 * @param {*}timeout/超时时间
 * @return {*}
 */
const getGeo = (obj = {}) => {
    const { enableHighAccuracy, timeout } = { ...config.config, ...obj }
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            const id = navigator.geolocation.watchPosition((e) => {
                // 纬度，经度
                const { latitude, longitude } = e.coords;
                navigator.geolocation.clearWatch(id);
                resolve({ latitude, longitude })
            }, (error) => {
                navigator.geolocation.clearWatch(id);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(new Error("html5已拒绝定位"))
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(new Error("html5位置信息不可用"))
                        break;
                    case error.TIMEOUT:
                        reject(new Error("定位超时"))
                        break;
                    case error.UNKNOWN_ERROR:
                        reject(new Error("html5定位未知错误"))
                        break;
                }
            }, { enableHighAccuracy, timeout, maximumAge: 0 });
            return
        }
        reject(new Error("浏览器不支持HTML5定位"))
    })
}

/**
 * @description: 经纬度查询地址
 * @param {*} latitude/纬度
 * @param {*} longitude/经度
 * @param {*}address/地区数组
 * @return {*}
 */
const searchAddressList = ({ latitude, longitude, address }) => {
    return address.find(item => {
        return item.polygon.find(poly => {
            const check = pointInPolygon([longitude, latitude], poly)
            if (check) {
                return poly
            }
        })
    })
}

/**
 * @description: 获取经纬度行政编码
 * @param {*} latitude/纬度
 * @param {*} longitude/经度
 * @return {*}
 */
const getGeoCode = async ({ latitude, longitude }) => {
    try {
        let code = ""
        // 省级
        const provinceArr = await getFile.get({ dir: "province", file: "0" })
        const province = searchAddressList({ latitude, longitude, address: provinceArr })
        if (province) {
            // 市级
            code = province.id
            const cityArr = await getFile.get({ dir: "city", file: province.id })
            const city = searchAddressList({ latitude, longitude, address: cityArr })
            if (city) {
                // 区县级
                code = city.id
                const districtArr = await getFile.get({ dir: "district", file: city.id })
                const district = searchAddressList({ latitude, longitude, address: districtArr })
                if (district) {
                    code = district.id
                }
            }
        }
        if (!code) {
            throw new Error("非中国境内")
        }
        return code
    } catch (error) {
        throw error
    }
}

module.exports = { getGeo, getGeoCode }