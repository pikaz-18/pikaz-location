/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-12-26 22:58:52
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2022-01-01 20:18:51
 */
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        "pikaz-location": path.resolve(__dirname, 'src', 'index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'umd',
        library: "pikazLocation"
    },
    optimization: {
        minimize: true,
    },
};