/*
 * @Description: 这是ip地理地址查询（组件）
 * @Date: 2022-12-21 11:21:38
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-12-01 01:47:33
 */
const { decompressFromEncodedURIComponent } = require('lz-string')
const getFile = require('./getFile')

/**
 * @description: ip段加0
 * @param {*} ip
 * @return {*}
 */
const addZero = (ip) => {
    const add = (str) => {
        const reStr = str.split('').reverse()
        return new Array(3)
            .fill(0)
            .map((item, index) => {
                return reStr[index] || 0
            })
            .reverse()
            .join('')
    }
    const result = ip.split('.').reduce((total, item) => {
        return `${total}${add(item)}`
    }, '')
    return Number(result)
}

/**
 * @description: 获取ip
 * @return {*}
 */
const getIp = () => {
    return new Promise((resolve, reject) => {
        const callbackName = 'ipCallback' + new Date().getTime()
        const script = document.createElement('script')
        script.onerror = () => {
            reject(new Error('获取ip失败'))
        }
        window[callbackName] = (res) => {
            if (res && res.ip) {
                resolve(res.ip)
                return
            }
            reject(new Error('ip定位失败'))
        }
        const url =
            'BYFxAcGcC4HpYIbgJYDpkoGYE9UHsAnAc1gH5NCBbBEAXgCtI8A7cAMjYGMEAbHgIwScA1rSA'
        script.src = decompressFromEncodedURIComponent(url) + callbackName
        document.body.appendChild(script)
    })
}

/**
 * @description: 获取ip地址行政编码
 * @param {*} obj
 * @return {*}
 */
const getIpCode = async (obj = {}) => {
    let { ip } = { ...obj }
    if (!ip) {
        // ip缓存一天
        ip = await getFile.getVal({
            key: 'ip',
            gainVal: getIp,
            expiration: 1000 * 60 * 60 * 24,
        })
    }
    const ipArr = ip.split('.').map((item) => Number(item) || 0)
    if (ipArr.length !== 4) {
        throw new Error('ip格式错误，只支持ipv4')
    }
    const ipAddressArr = await getFile.get({
        dir: 'ip',
        file: `${ipArr[0]}.${ipArr[1]}`,
    })
    const code = ipAddressArr.reduce((total, item) => {
        const { district, id } = item
        const ipNum = addZero(ip)
        if (ipNum >= district[0] && ipNum <= district[1]) {
            return id
        }
        return total
    }, '')
    return { code, ip }
}

module.exports = { addZero, getIpCode }
