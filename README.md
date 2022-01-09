## 介绍

供中国地区使用的定位插件

* 支持h5定位、ip定位、经纬度查询地址、省市区三级联动列表搜索
* 定位信息文件已做压缩处理，一般启用gzip时大约只会花费几十k至上百k

ps：由于浏览器限制，http域名的网页使用h5定位可能会出现问题，如定位不准、禁止定位等，如果想要定位结果更加精准，最好使用https域名

## [demo](https://pikaz-18.github.io/pikaz-location/example/index.html)

### [demo代码](https://github.com/pikaz-18/pikaz-location/blob/master/example/index.html)

## 安装

### with npm or yarn 

```bash
yarn add @pikaz/location

npm i -S @pikaz/location
```

```js
import {
    getLocation
} from "@pikaz/location"
```

### with cdn

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@pikaz/location"></script>
或者
<script type="text/javascript" src="https://unpkg.com/@pikaz/location"></script>
```

```js
const {
    getLocation
} = window.pikazLocation
```

### 方法函数

方法名|说明|参数|默认参数值
-|-|-|-
setConfig|设置全局默认参数；timeout为所有定位函数超时时间，url为定位文件cdn地址，如：https://cdn.jsdelivr.net/npm/@pikaz/location/lib或https://unpkg.com/@pikaz/location/lib|{timeout: Number/选填, url: String/选填}|{timeout:3000, url:"https://cdn.jsdelivr.net/npm/@pikaz/location/lib"}
getLocation|默认定位函数，优先使用html5定位，html5定位失败，则会自动切换为ip定位；timeout为超时时间，enableHighAccuracy为是否开启高精度定位（开启设备gps定位，但所需时间更久）|{timeout: Number/选填, enableHighAccuracy: Boolean/选填}|{timeout:3000, enableHighAccuracy:false}
getH5Location|指定使用html5定位函数；timeout为超时时间，enableHighAccuracy为是否开启高精度定位（开启设备gps定位）|{timeout: Number/选填, enableHighAccuracy: Boolean/选填}|{timeout:3000, enableHighAccuracy:false}
getIpLocation|指定使用ip定位函数; timeout为超时时间, ip为ip地址，若不传ip地址则自动获取本机ip|{timeout: Number/选填, ip: String/选填}|{timeout:3000, ip:""}
getAddress|根据经纬度获取具体地址；latitude为纬度，longitude为经度|{ latitude: Number/必填, longitude : Number/必填}|{ latitude: 0, longitude : 0}
searchList|省市区三级联动，传入地区行政编码返回下级地区列表信息，code为地区编码，不传则为查询省级列表|code: String/选填|code:""

### 方法示例

#### setConfig

说明：设置全局默认参数，可把该项目的根目录下的static文件夹上传至至您的oss或服务器上，将static所在的地址作为url传入，如oss上的static文件夹可通过https://xxx.com/file/static访问，则url可传入https://xxx.com/file，若不设置，则url默认使用https://cdn.jsdelivr.net/npm/@pikaz/location/lib地址

```js
import {
    setConfig
} from "@pikaz/location"
setConfig({
    timeout: 3000,
    url: "https://cdn.jsdelivr.net/npm/@pikaz/location/lib"
})
```

#### getLocation

说明：默认定位函数，html5定位推荐使用https协议的域名，若为http，则html5定位可能出现定位不准确，开启高精度定位会更加耗时

```js
import {
    getLocation
} from "@pikaz/location"
getLocation({
    timeout: 3000,
    enableHighAccuracy: true
}).then(res => {
    console.log(res)
    // 返回值结构: {
    //     latitude:0//当期定位的纬度,
    //     longitude:0//当期定位的经度,
    //     province: ""//当期定位的省级单位名称,
    //     city: ""//当期定位的市级单位名称,
    //     district: ""//当期定位的区、县级单位名称,
    //     code: ""//当前定位的行政编码,
    //     type: ""//定位类型：h5或ip,
    //     details: {//当前地址详情
    //         province: {
    //             code: "",//当前定位的省级单位行政编码,
    //             location: {longitude:0,latitude:0},//当前定位的省级单位的经纬度
    //             name: "",//当前定位的省级单位名称,
    //             pinyin: ""//当前定位的省级单位名称拼音
    //         },
    //         city: {
    //             code: "",//当前定位的市级单位行政编码,
    //             location: {longitude:0,latitude:0},//当前定位的市级单位的经纬度
    //             name: "",//当前定位的市级单位名称,
    //             pinyin: ""//当前定位的市级单位名称拼音
    //         },
    //         district: {
    //             code: "",//当前定位的区县级单位行政编码,
    //             location: {longitude:0,latitude:0},//当前定位的区县级单位的经纬度
    //             name: "",//当前定位的区县级单位名称,
    //             pinyin: ""//当前定位的区县级单位名称拼音
    //         },
    // }
}).catch(err => {
    console.log(err)
})
```

#### getH5Location

说明：html5定位函数，html5定位推荐使用https协议的域名，若为http，则html5定位可能出现定位不准确，开启高精度定位会更加耗时；该函数只会返回经纬度，若需具体地址，可配合getAddress函数获取具体地址

```js
import {
    getH5Location
} from "@pikaz/location"
getH5Location({
    timeout: 3000,
    enableHighAccuracy: true
}).then(res => {
    console.log(res)
    // 返回值结构: {
    //     latitude:0//当期定位的纬度,
    //     longitude:0//当期定位的经度,
    // }
}).catch(err => {
    console.log(err)
})
```

#### getIpLocation

说明：ip定位函数，ip定位相比html5定位精准度更差，但是若用户拒绝定位授权时，则可以使用ip定位作为兜底方案；可传入ip值查询指定ip的经纬度，若不传则默认为本机ip；该函数只会返回经纬度，若需具体地址，可配合getAddress函数获取具体地址

```js
import {
    getIpLocation
} from "@pikaz/location"
getIpLocation({
    timeout: 3000,
    ip: ""
}).then(res => {
    console.log(res)
    // 返回值结构: {
    //     latitude:0//当期定位的纬度,
    //     longitude:0//当期定位的经度,
    // }
}).catch(err => {
    console.log(err)
})
```

#### getAddress

说明：根据经纬度查询具体定位函数

```js
import {
    getAddress
} from "@pikaz/location"
getAddress({
    latitude: 40.0402718,
    longitude: 116.2735831
}).then(res => {
    console.log(res)
    // 返回值结构: {
    //     latitude:0//当期定位的纬度,
    //     longitude:0//当期定位的经度,
    //     province: ""//当期定位的省级单位名称,
    //     city: ""//当期定位的市级单位名称,
    //     district: ""//当期定位的区、县级单位名称,
    //     code: ""//当前定位的行政编码,
    //     details: {//当前地址详情
    //         province: {
    //             code: "",//当前定位的省级单位行政编码,
    //             location: {longitude:0,latitude:0},//当前定位的省级单位的经纬度
    //             name: "",//当前定位的省级单位名称,
    //             pinyin: ""//当前定位的省级单位名称拼音
    //         },
    //         city: {
    //             code: "",//当前定位的市级单位行政编码,
    //             location: {longitude:0,latitude:0},//当前定位的市级单位的经纬度
    //             name: "",//当前定位的市级单位名称,
    //             pinyin: ""//当前定位的市级单位名称拼音
    //         },
    //         district: {
    //             code: "",//当前定位的区县级单位行政编码,
    //             location: {longitude:0,latitude:0},//当前定位的区县级单位的经纬度
    //             name: "",//当前定位的区县级单位名称,
    //             pinyin: ""//当前定位的区县级单位名称拼音
    //         },
    // }
}).catch(err => {
    console.log(err)
})
```

#### searchList

说明：省市区三级联动，传入对应行政单位编码，获取下级行政单位列表；不传行政单位编码默认获取省级单位列表

```js
import {
    searchList
} from "@pikaz/location"
searchList("110000").then(res => {
    console.log(res)
    // 返回值结构: [
    // {"code":"410100",//该行政单位编码
    // "name":"郑州市",//该行政单位名称
    // "pinyin":"zhengzhou",//该行政单位名称拼音
    // "location":{"latitude":34.74725,"longitude":113.62493}//该行政单位经纬度
    // ]
}).catch(err => {
    console.log(err)
})
```
