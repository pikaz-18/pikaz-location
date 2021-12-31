/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-12-26 22:58:52
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2021-12-31 22:15:04
 */
const pointInPolygon = require("point-in-polygon")
// const province = require("./store/province/index.json")
/**
 * @description: html5定位
 * @param {*}
 * @return {*}
 */
const getH5Location = ({ timeout }) => {
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
                        reject("已拒绝定位")
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject("位置信息不可用")
                        break;
                    case error.TIMEOUT:
                        reject("定位超时")
                        break;
                    case error.UNKNOWN_ERROR:
                        reject("未知错误")
                        break;
                }
            }, { enableHighAccuracy: false, timeout, maximumAge: 0 });
            return
        }
        reject("浏览器不支持HTML5定位")
    })
}

/**
 * @description: ip定位
 * @param {*}
 * @return {*}
 */
const getIpLocation = ({ timeout }) => {
    return new Promise((resolve, reject) => {
        fetch("http://www.geoplugin.net/json.gp")
            .then((res) => res.json())
            .then((res) => {
                resolve({ latitude: Number(res.geoplugin_latitude), longitude: Number(res.geoplugin_longitude) })
            }).catch(() => {
                reject("定位失败")
            });
        setTimeout(() => {
            reject("定位失败")
        }, timeout);
    })
}

/**
 * @description: 经纬度查询地址
 * @param {*}
 * @return {*}
 */
const search = ({ latitude, longitude, address }) => {
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
 * @description: 获取地址
 * @param {*} latitude
 * @param {*} longitude
 * @return {*}
 */
const getAddress = async ({ latitude, longitude }) => {
    const result = { latitude, longitude, province: "", city: "", district: "", code: "", details: { province: { code: "", location: "", name: "", pinyin: "" }, city: { code: "", location: "", name: "", pinyin: "" }, district: { code: "", location: "", name: "", pinyin: "" } } }
    const provinceFile = await import("./store/province/index")
    const province = search({ latitude, longitude, address: Object.values(provinceFile) })
    if (province) {
        result.province = province.name
        result.code = province.id
        result.details.province = { code: province.id, location: { latitude: province.location.lat, longitude: province.location.lng }, name: province.name, pinyin: province.pinyin }
        const cityFile = await import(`./store/city/${province.id}`)
        const city = search({ latitude, longitude, address: Object.values(cityFile) })
        if (city) {
            result.city = city.name
            result.code = city.id
            result.details.city = { code: city.id, location: { latitude: city.location.lat, longitude: city.location.lng }, name: city.name, pinyin: city.pinyin }
            const districtFile = await import(`./store/district/${city.id}`)
            const district = search({ latitude, longitude, address: Object.values(districtFile) })
            if (district) {
                result.district = district.name
                result.code = district.id
                result.details.district = { code: district.id, location: { latitude: district.location.lat, longitude: district.location.lng }, name: district.name, pinyin: district.pinyin }
            }
        }
    }
    return result
}

/**
 * @description: 定位
 * @param {*}
 * @return {*}
 */
const getLocation = () => {
    return new Promise((resolve, reject) => {
        getH5Location({ timeout: 3000 }).then(({ latitude, longitude }) => {
            getAddress({ latitude, longitude }).then(res => {
                resolve(res)
            })
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = getLocation