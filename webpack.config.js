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
    }
};