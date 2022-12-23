/*
 * @Description: 这是获取ip地理地址页面（组件）
 * @Date: 2022-12-21 11:21:38
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-12-21 16:33:04
 */
/**
 * @description: ip段加0
 * @param {*} ip
 * @return {*}
 */
const addZero = (ip) => {
    const add = (str) => {
        const reStr = str.split("").reverse()
        return new Array(3).fill(0).map((item, index) => {
            return reStr[index] || 0
        }).reverse().join("")
    }
    const result = ip.split(".").reduce((total, item) => {
        return `${total}${add(item)}`
    }, "")
    return Number(result)
}

/**
 * @description: 获取ip
 * @return {*}
 */
const getIp = () => {
    return new Promise((resolve, reject) => {
        const callbackName = "ipCallback" + new Date().getTime();
        const script = document.createElement("script");
        window[callbackName] = (res) => {
            if (res && res.ip) {
                resolve(res.ip);
                return;
            }
            reject("ip定位失败");
        };
        script.src =
            "https://api.ipify.org/?format=jsonp&&callback=" + callbackName;
        document.body.appendChild(script);
    });
};

const getIpLocation = (obj) => {
    // const obj={}
}

module.exports = { addZero }