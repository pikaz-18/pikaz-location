/*
 * @Description: 这是配置文件页面（组件）
 * @Date: 2022-12-21 15:10:22
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-12-01 02:42:17
 */
class Config {
    constructor() {
        // 默认配置
        this.config = {
            // 超时时间
            timeout: 10000,
            // 是否需要高精度定位
            enableHighAccuracy: false,
            // 是否返回详细信息
            detail: false,
        }
        // 公共cdn链接地址列表
        this.cdn = [
            'https://npm.onmicrosoft.cn/@pikaz/location/lib',
            // 'https://jsd.onmicrosoft.cn/npm/@pikaz/location/lib',
            // 'https://cdn.jsdelivr.net/npm/@pikaz/location/lib',
            'https://unpkg.com/@pikaz/location/lib',
        ]
        // 用户设置cdn地址
        this.userCdn = ''
    }
    /**
     * @description: 修改配置
     * @param {*} obj
     * @return {*}
     */
    set(obj) {
        this.config = { ...this.config, ...obj }
        if (this.config.url) {
            this.userCdn = this.config.url
        }
    }
}

module.exports = new Config()
