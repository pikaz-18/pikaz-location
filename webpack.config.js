/*
 * @Description: 这是***页面（组件）
 * @Date: 2021-12-26 22:58:52
 * @Author: zouzheng
 * @LastEditors: zouzheng
 * @LastEditTime: 2023-01-05 20:30:28
 */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        publicPath: path.resolve(__dirname, 'lib'),
        filename: 'pikazLocation.js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'umd',
        library: 'pikazLocation',
        globalObject: 'this'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'static'),
                    to: path.resolve(__dirname, 'lib', 'static')
                }
            ]
        })
    ]
};