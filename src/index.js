/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-12-26 22:58:52
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-01-10 01:25:55
 */
const pointInPolygon = require("point-in-polygon/flat")
const { decompressFromEncodedURIComponent } = require("lz-string")

// 默认配置
const defaultConfig = {
    // 超时时间
    timeout: 3000,
    // 是否需要高精度定位
    enableHighAccuracy: false,
    // cdn地址
    url: "https://unpkg.com/@pikaz/location/lib"
}

// 基础返回结果：province省；/city市；/district区县；/code行政编码；/details地址详情；
const defaultResult = { province: "", city: "", district: "", code: "", details: { province: { code: "", location: {}, name: "", pinyin: "" }, city: { code: "", location: {}, name: "", pinyin: "" }, district: { code: "", location: {}, name: "", pinyin: "" } } }

/**
 * @description: 设置默认值
 * @param {*}
 * @return {*}
 */
const setConfig = ({ timeout, url }) => {
    timeout && (defaultConfig.timeout = timeout)
    url && (defaultConfig.url = url)
}

/**
 * @description: 深拷贝
 * @param {*}
 * @return {*}
 */
const deepCopy = (obj) => {
    const oldObj = JSON.stringify(obj)
    const newObj = JSON.parse(oldObj)
    return newObj
}

/**
 * @description: html5定位
 * @param {*}timeout/超时时间
 * @param {*}enableHighAccuracy/是否需要高精度定位
 * @return {*}
 */
const getH5Location = (obj) => {
    const { timeout, enableHighAccuracy } = { ...defaultConfig, ...obj }
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
                        reject("html5已拒绝定位")
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject("html5位置信息不可用")
                        break;
                    case error.TIMEOUT:
                        reject("html5定位超时")
                        break;
                    case error.UNKNOWN_ERROR:
                        reject("html5定位未知错误")
                        break;
                }
            }, { enableHighAccuracy, timeout, maximumAge: 0 });
            return
        }
        reject("浏览器不支持HTML5定位")
    })
}

/**
 * @description: ip定位
 * @param {*}timeout/超时时间
 * @return {*}
 */
const getIpLocation = (obj) => {
    const { timeout } = { ...defaultConfig, ...obj }
    const request = () => {
        return new Promise((resolve, reject) => {
            //创建script标签并加入到页面中
            const head = document.getElementsByTagName("head")[0];
            const script = document.createElement("script");
            head.appendChild(script);
            //设置超时处理
            script.timer = setTimeout(() => {
                window["getIpLocation"] = null;
                head.removeChild(script);
                reject("ip定位超时")
            }, timeout);
            script.src = window.location.protocol + `//pv.sohu.com/cityjson?ie=utf-8`;
            script.onload = () => {
                head.removeChild(script);
                clearTimeout(script.timer);
                if (returnCitySN && returnCitySN.cid) {
                    // 精确到区
                    const code = returnCitySN.cid.slice(0, 4) + "00"
                    const id = returnCitySN.cid.slice(0, 2) + "0000"
                    importFile("city", id).then(res => {
                        const item = res.find(address => address.id === code)
                        if (item) {
                            resolve(item.location)
                            return
                        }
                        reject("ip定位失败")
                    }).catch(err => {
                        console.log(err);
                        reject("ip定位失败")
                    })
                    return
                }
                reject("ip定位失败")
            }
        })
    }
    // 整体超时处理
    const timeoutFuc = (timeout) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("ip定位超时")
            }, timeout);
        })
    }
    return Promise.race([request(), timeoutFuc(timeout)])
}

/**
 * @description: 经纬度查询地址
 * @param {*} latitude/纬度
 * @param {*} longitude/经度
 * @param {*}address/地区数组
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
 * @description: 引入文件
 * @param {*} type/区域类型
 * @param {*} id/区域编码
 * @return {*}
 */
const importFile = (type, id) => {
    const url = defaultConfig.url
    return new Promise((resolve, reject) => {
        fetch(`${url}/static/${type}/${id}.json`).then(res => res.json()).then(file => {
            const jsonStr = decompressFromEncodedURIComponent(file.s)
            const arr = JSON.parse(jsonStr)
            resolve(arr)
        }).catch(err => {
            console.log("文件获取失败" + err);
            reject(err)
        })
    })
}

/**
 * @description: 获取地址
 * @param {*} latitude/纬度
 * @param {*} longitude/经度
 * @return {*}
 */
const getAddress = async ({ latitude, longitude }) => {
    try {
        const result = { ...deepCopy(defaultResult), latitude, longitude }
        const provinceArr = await importFile("province", 0)
        const province = search({ latitude, longitude, address: provinceArr })
        if (province) {
            result.province = province.name
            result.code = province.id
            result.details.province = { code: province.id, location: province.location, name: province.name, pinyin: province.pinyin }
            const cityArr = await importFile("city", province.id)
            const city = search({ latitude, longitude, address: cityArr })
            if (city) {
                result.city = city.name
                result.code = city.id
                result.details.city = { code: city.id, location: city.location, name: city.name, pinyin: city.pinyin }
                const districtArr = await importFile("district", city.id)
                const district = search({ latitude, longitude, address: districtArr })
                if (district) {
                    result.district = district.name
                    result.code = district.id
                    result.details.district = { code: district.id, location: district.location, name: district.name, pinyin: district.pinyin }
                }
            }
        }
        if (!result.code) {
            throw new Error("非中国境内")
        }
        return result
    } catch (error) {
        throw error
    }
}

/**
 * @description: 定位
 * @param {*}timeout/超时时间
 * @param {*}enableHighAccuracy/是否需要高精度定位
 * @return {*}
 */
const getLocation = (obj) => {
    const config = { ...defaultConfig, ...obj }
    return new Promise((resolve, reject) => {
        getH5Location(config).then(({ latitude, longitude }) => {
            getAddress({ latitude, longitude }).then(res => {
                resolve({ ...res, type: "h5" })
            }).catch(err => {
                reject(err)
            })
        }).catch(err => {
            console.log(err);
            getIpLocation(config).then(({ latitude, longitude }) => {
                getAddress({ latitude, longitude }).then(res => {
                    resolve({ ...res, type: "ip" })
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                console.log(err);
                reject(err)
            })
        })
    })
}

/**
 * @description: 格式化searchList返回结果
 * @param {*}list/原列表
 * @return {*}
 */
const formatSearchListResult = (list) => {
    return list.map(item => {
        return { code: item.id, name: item.name, pinyin: item.pinyin, location: item.location }
    })
}

/**
 * @description: 省市区三级联动
 * @param {*}code/省、市、区县行政编码
 * @return {*}
 */
const searchList = async (code) => {
    try {
        // 省级
        if (!code) {
            const provinceArr = await importFile("province", 0)
            return formatSearchListResult(provinceArr)
        }
        const id = code.toString()
        // 市级
        if (id.slice(2) === "0000") {
            const cityArr = await importFile("city", code)
            return formatSearchListResult(cityArr)
        }
        // 区、县
        const districtArr = await importFile("district", code)
        return formatSearchListResult(districtArr)
    } catch (error) {
        throw error
    }
}

module.exports = { getLocation, getH5Location, getIpLocation, getAddress, searchList, setConfig }