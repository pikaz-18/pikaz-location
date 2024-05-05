/*
 * @Description: 这是打包esmodule配置页面（组件）
 * @Date: 2021-12-26 22:58:52
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2024-05-04 13:42:27
 */
const path = require('path')

module.exports = {
    mode: 'production',
    // entry: path.resolve(__dirname, 'lib', 'pikazLocation.js'),
    entry: path.resolve(__dirname, 'moduleExport.js'),
    experiments: {
        outputModule: true,
    },
    output: {
        filename: 'pikazLocationModule.js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'module',
    },
}
