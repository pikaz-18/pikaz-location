## 介绍

供中国地区使用的 js 定位插件

特性：

-   支持浏览器 h5 定位、ip 定位、经纬度查询地址、ip 查询、地区编码查询地址、地址文本解析、省市区三级联动列表搜索
-   定位信息文件已做压缩处理，如果有启用 gzip 时部分定位大约只会花费几十 k
-   web 端定位库，无需在服务端额外运行定位服务，没有并发限制、次数限制且无收费

ps：

-   由于浏览器限制，http 域名的网页使用 h5 定位可能会出现问题，如定位不准、禁止定位等，如果想要定位结果更加精准，最好使用 https 域名；

-   该插件的定位文件存放在第三方 cdn 中，若想存放至自己的 cdn 上，则可参考[setConfig](#setConfig)函数使用方法介绍

更新日志：

-   [0.1.x 文档请点击这里](https://github.com/pikaz-18/pikaz-location/blob/master/version/0.1.7.md)，1.x.x 版本相比 0.1.x 版本有破坏性更新，如需升级注意重新对接文档。
-   相比 0.1.x 版本新增了 ip 查询地址、地址文本解析、地区编码查询地址。
-   重构了 ip 定位方法，使用 ip 文件处理 ip 定位，对第三方的 ip 定位无依赖，ip 获取默认会缓存一天，也可自行结合自己服务获取用户 ip 进行 ip 定位。
-   对定位文件进行优化，使每次定位所加载的文件更小，且对所有加载过的定位文件进行持久化缓存，第二次对于同市的定位速度在 100ms 以内。
-   1.0.9 版本优化了 cdn 文件加载逻辑

## [demo 示例点击这里一键体验](https://pikaz-18.github.io/pikaz-location/example/index.html)

## [demo 代码点击这里一键 copy](https://github.com/pikaz-18/pikaz-location/blob/master/example/index.html)

## 安装

### with npm or yarn

```bash
yarn add @pikaz/location

npm i -S @pikaz/location
```

```js
import { getLocation } from '@pikaz/location'
```

### with cdn

```html
<script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/@pikaz/location"
></script>
或者
<script type="text/javascript" src="https://unpkg.com/@pikaz/location"></script>
```

```js
const { getLocation } = window.pikazLocation
```

### 方法函数

<table>
      <tr>
        <td>方法名</td>
        <td>方法说明</td>
        <td>参数/object</td>
        <td>参数说明</td>
        <td>默认参数值</td>
      </tr>
      <tr>
        <td rowspan="2">setConfig</td>
        <td rowspan="2">设置全局配置（不调用则使用默认配置）</td>
        <td>timeout: Number/选填</td>
        <td>所有定位函数默认超时时间，单位毫秒</td>
        <td>10000</td>
      </tr>
      <tr>
        <td>url: String/选填</td>
        <td>静态文件cdn地址</td>
        <td>https://cdn.jsdelivr.net/npm/@pikaz/location/lib</td>
      </tr>
      <tr>
        <td>getLocation</td>
        <td>
          默认定位函数，优先使用html5定位，html5定位失败，则会自动切换为ip定位
        </td>
        <td>
          对应定位类型的参数同下方的getH5Location方法和getIpLocation方法
        </td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td id="getH5LocationMed" rowspan="5">getH5Location</td>
        <td rowspan="5">html5定位</td>
        <td>timeout: Number/选填</td>
        <td>超时时间</td>
        <td>10000</td>
      </tr>
      <tr>
        <td>enableHighAccuracy: Boolean/选填</td>
        <td>是否开启设备gps启用高精度定位（更耗时）</td>
        <td>false</td>
      </tr>
      <tr>
        <td>detail: Boolean/选填</td>
        <td>是否需要地址详细信息（更耗时）</td>
        <td>false</td>
      </tr>
      <tr>
        <td>latitude: Number/选填</td>
        <td>
          手动传入经纬度查询地址信息，latitude与longitude需同时传入，不传则使用设备定位
        </td>
        <td>-</td>
      </tr>
      <tr>
        <td>longitude: Number/选填</td>
        <td>
          可手动传入经纬度查询地址信息，latitude与longitude需同时传入，不传则使用设备定位
        </td>
        <td>-</td>
      </tr>
      <tr>
        <td id="getIpLocationMed" rowspan="3">getIpLocation</td>
        <td rowspan="3">ip定位</td>
        <td>timeout: Number/选填</td>
        <td>超时时间</td>
        <td>10000</td>
      </tr>
      <tr>
        <td>detail: Boolean/选填</td>
        <td>是否需要地址详细信息（更耗时）</td>
        <td>false</td>
      </tr>
      <tr>
        <td>ip: String/选填</td>
        <td>
          可手动传入ipv4格式的ip地址（如114.114.114.114）查询地址信息，不传则使用设备ip定位
        </td>
        <td>-</td>
      </tr>
      <tr>
        <td rowspan="3">searchAddress</td>
        <td rowspan="3">解析地址文本</td>
        <td>timeout: Number/选填</td>
        <td>超时时间</td>
        <td>10000</td>
      </tr>
      <tr>
        <td>detail: Boolean/选填</td>
        <td>是否需要地址详细信息（更耗时）</td>
        <td>false</td>
      </tr>
      <tr>
        <td>address: String/必填</td>
        <td>
          地址文本字符串，必须带有省级或市级的全写或简写，不能只包含区县名称，如广东深圳/深圳南山
        </td>
        <td>-</td>
      </tr>
      <tr>
        <td rowspan="3">searchCodeAddress</td>
        <td rowspan="3">地区编码查询</td>
        <td>timeout: Number/选填</td>
        <td>超时时间</td>
        <td>10000</td>
      </tr>
      <tr>
        <td>detail: Boolean/选填</td>
        <td>是否需要地址详细信息（更耗时）</td>
        <td>false</td>
      </tr>
      <tr>
        <td>code: String/必填</td>
        <td>地区编码</td>
        <td>-</td>
      </tr>
      <tr>
        <td rowspan="1">searchList</td>
        <td rowspan="1">省市区三级联动，传入地区编码获取该地区下级地区列表</td>
        <td>code: String/选填</td>
        <td>地区编码，若不传则获取所有省级地区列表</td>
        <td>-</td>
      </tr>
      <tr>
        <td rowspan="2">searchCodeDetail</td>
        <td rowspan="2">获取单个地区编码的详细信息，等同于其他方法中的detail数据</td>
        <td>timeout: Number/选填</td>
        <td>超时时间</td>
        <td>10000</td>
      </tr>
      <tr>
        <td>code: String/必填</td>
        <td>地区编码</td>
        <td>-</td>
      </tr>
    </table>

注：[detail](#detail)开启则会在原本基础定位信息的基础上返回省市区的详细信息

### 方法示例

<h2 id="setConfig">setConfig</h2>

说明：设置全局配置（不调用则使用默认配置）

可把该项目的根目录下的 static 文件夹整个上传至您的 oss 上，将 static 文件夹的链接地址作为 url 传入，如 oss 上的 static 文件夹可通过https://xxx.com/file/static访问，则url可传入https://xxx.com/file，若不设置，则url默认使用https://cdn.jsdelivr.net/npm/@pikaz/location/lib等公共cdn地址（第三方cdn可能不稳定，最好自行上传定位文件）

```js
import { setConfig } from '@pikaz/location'
setConfig({
    // 超时时间
    timeout: 10000,
    // 您的oss地址
    url: 'https://unpkg.com/@pikaz/location/lib',
})
```

<h2 id="getLocation">getLocation</h2>

说明：默认定位函数，优先使用 html5 定位，html5 定位失败，则会自动切换为 ip 定位

```js
import { getLocation } from '@pikaz/location'
getLocation()
    .then((res) => {
        // 返回数据结构: {
        // ...,//返回对应定位类型数据，同下方的getH5Location和getIpLocation返回数据格式
        // type:"h5"//定位类型：h5/ip
        // }
    })
    .catch((err) => {
        console.log(err)
    })
```

<h2 id="getH5Location">getH5Location</h2>

说明：html5 定位函数，html5 定位推荐使用 https 协议，若为 http，则 html5 定位可能出现定位不准确或无法定位（取决于浏览器策略），开启高精度定位会更加耗时；

```js
import { getH5Location } from '@pikaz/location'
getH5Location({
    // 开启gps高精度定位
    enableHighAccuracy: true,
})
    .then((res) => {
        // 返回数据结构:{
        //     address: "广东省深圳市福田区"//完整地址
        //     city: "深圳市"//市级名称
        //     code: "440304"//地区编码
        //     district: "福田区"//区县级名称
        //     latitude: 22.547//区县级名称
        //     longitude: 114.085947//区县级名称
        //     province: "广东省"//省级名称
        // }
    })
    .catch((err) => {
        console.log(err)
    })
```

<h2 id="getIpLocation">getIpLocation</h2>

说明：ip 定位函数，ip 定位相比 html5 定位精度更差且可能不准，但是若用户拒绝定位授权时，则可以使用 ip 定位作为兜底方案；

```js
import { getIpLocation } from '@pikaz/location'
getIpLocation()
    .then((res) => {
        // 返回数据结构:{
        //     address: "江苏省南京市"//完整地址
        //     city: "南京市"//市级名称
        //     code: "320100"//地区编码
        //     district: ""//区县级名称
        //     province: "江苏省"//省级名称
        //     ip: "114.114.114.114"//ip地址
        // }
    })
    .catch((err) => {
        console.log(err)
    })
```

<h2 id="searchAddress">searchAddress</h2>

说明：解析地址文本，必须带有省级或市级的全写或简写，不能只包含区县名称，如广东深圳/广东省深圳市/广东南山/深圳/深圳南山

```js
import { searchAddress } from '@pikaz/location'
searchAddress({
    address: '广东福田',
})
    .then((res) => {
        // 返回数据结构:{
        //     address: "广东省深圳市福田区"//完整地址
        //     city: "深圳市"//市级名称
        //     code: "440304"//地区编码
        //     district: "福田区"//区县级名称
        //     province: "广东省"//省级名称
        // }
    })
    .catch((err) => {
        console.log(err)
    })
```

<h2 id="searchCodeAddress">searchCodeAddress</h2>

说明：地区编码查询地址信息

```js
import { searchCodeAddress } from '@pikaz/location'
searchCodeAddress({
    code: '440304',
})
    .then((res) => {
        // 返回数据结构:{
        //     address: "广东省深圳市福田区"//完整地址
        //     city: "深圳市"//市级名称
        //     code: "440304"//地区编码
        //     district: "福田区"//区县级名称
        //     province: "广东省"//省级名称
        // }
    })
    .catch((err) => {
        console.log(err)
    })
```

<h2 id="searchList">searchList</h2>

说明：省市区三级联动，传入对应行政单位编码，获取下级行政单位列表；不传行政单位编码默认获取省级单位列表

```js
import { searchList } from '@pikaz/location'
searchList({
    code: '110000',
})
    .then((res) => {
        // 返回数据结构: [
        // {
        //  "code":"110101",//该地区编码
        //  "name":"东城区",//该地区名称
        // },
        // {
        //  "code":"110102",//该地区编码
        //  "name":"西城区",//该地区名称
        // }
        // ]
    })
    .catch((err) => {
        console.log(err)
    })
```

<h2 id="searchCodeDetail">searchCodeDetail</h2>

说明：获取单个地区的详细信息：地区编码、经纬度、名称、名称拼音

```js
import { searchCodeDetail } from '@pikaz/location'
searchCodeDetail({
    code: '440304',
})
    .then((res) => {
        // {
        //     "code": "440304", //该地区编码
        //     "location": { //该地区经纬度
        //         "latitude": 22.521541,
        //         "longitude": 114.05498
        //     },
        //     "name": "福田区", //该地区名称
        //     "pinyin": "futianqu" //该地区拼音
        // }
    })
    .catch((err) => {
        console.log(err)
    })
```

<h2 id="detail">detail</h2>

说明：若开启则会在原本的返回数据中额外返回详细的地址信息

```js
import { getH5Location } from '@pikaz/location'
getH5Location({
    // 获取详细地址信息
    detail: true,
})
    .then((res) => {
        // {
        //     address: "广东省深圳市福田区" //完整地址
        //     city: "深圳市" //市级名称
        //     code: "440304" //地区编码
        //     district: "福田区" //区县级名称
        //     latitude: 22.547 //区县级名称
        //     longitude: 114.085947 //区县级名称
        //     province: "广东省" //省级名称
        //     "detail": { //详细地址信息
        //         "province": {
        //             "code": "440000", //省级地区编码
        //             "location": { //省级地区经纬度
        //                 "latitude": 23.13171,
        //                 "longitude": 113.26627
        //             },
        //             "name": "广东省", //省级名称
        //             "pinyin": "guangdong" //省级名称拼音
        //         },
        //         "city": {
        //             "code": "440300", //市级地区编码
        //             "location": { //市级地区经纬度
        //                 "latitude": 22.54286,
        //                 "longitude": 114.05956
        //             },
        //             "name": "深圳市", //市级名称
        //             "pinyin": "shenzhen" //市级名称拼音
        //         },
        //         "district": {
        //             "code": "440304", //区县级地区编码
        //             "location": { //区县级地区经纬度
        //                 "latitude": 22.521541,
        //                 "longitude": 114.05498
        //             },
        //             "name": "福田区", //区县级名称
        //             "pinyin": "futianqu" //区县级名称拼音
        //         }
        //     }
    })
    .catch((err) => {
        console.log(err)
    })
```
