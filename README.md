## 介绍

供中国地区使用的定位插件

* 支持h5定位、ip定位、经纬度查询地址、省市区三级联动列表搜索
* 定位信息文件已做压缩处理，一般启用gzip时大约只会花费几十k至上百k

ps：由于浏览器限制，http域名的网页使用h5定位可能会出现问题，如定位不准、禁止定位等，如果想要定位结果更加精准，最好使用https域名

## [demo](https://pikaz-18.github.io/pikaz-location/example/index.html)

### [demo代码](https://github.com/pikaz-18/pikaz-location/tree/master/example)

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
