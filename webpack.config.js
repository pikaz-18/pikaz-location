const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        "pikaz-location": "./src/index.js",
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'umd'
    },
};