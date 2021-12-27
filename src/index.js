/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-12-26 22:58:52
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2021-12-28 00:12:29
 */
const getLocation = async () => {
    // fetch("http://www.geoplugin.net/json.gp")
    //     .then((res) => res.json())
    //     .then((res) => {
    //         console.log(res);
    //     });
    const getH5Location = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (e) => {
                        // 纬度，经度
                        const { latitude, longitude } = e.coords;
                        resolve({ latitude, longitude })
                    },
                    (error) => {
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
                    },
                    { enableHighAccuracy: false, timeout: 3000, maximumAge: 0 }
                );
                return
            }
            reject("浏览器不支持HTML5定位")
        })
    }
    const getIpLocation = (timeout = 3000) => {
        return new Promise((resolve, reject) => {
            fetch("http://www.geoplugin.net/json.gp")
                .then((res) => res.json())
                .then((res) => {
                    resolve({ latitude: res.geoplugin_latitude, longitude: res.geoplugin_longitude })
                }).catch(() => {
                    reject("定位失败")
                });
            setTimeout(() => {
                reject("定位失败")
            }, timeout);
        })
    }
    try {
        const res = await getH5Location()
        console.log(res);
    } catch (error) {

    }
}

module.exports = getLocation