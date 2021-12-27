const getLocation = () => {
    fetch("http://www.geoplugin.net/json.gp")
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
        });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (e) => {
                // 纬度，经度
                const { latitude, longitude } = e.coords;
                console.log(latitude, longitude);
                const list = require("../polygon.json");
                list[0].some((item) => {
                    const { polygon } = item;
                    return polygon.some((po) => {
                        const result = pointInPolygon([longitude, latitude], po);
                        if (result) {
                            console.log(item);
                            console.log(po);
                            return true;
                        }
                        return false;
                    });
                });
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.log("已拒绝定位");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log("位置信息不可用");
                        break;
                    case error.TIMEOUT:
                        console.log("定位超时");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log("未知错误");
                        break;
                }
            },
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
        );
    } else {
        alert("浏览器不支持HTML5定位");
    }
}

module.exports = getLocation