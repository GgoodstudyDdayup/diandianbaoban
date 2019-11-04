//app.js
App({
  d: {
    hostUrl: 'https://devapi.yidianedu.com',
    province_id: 320500, //默认开通城市
    userID: 0,
    current_address: '',
    cityname: '苏州市'
  },
  wxlogin: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function(res) {
          console.log(res)
          var code = res.code;
          console.log(code);
          wx.request({
            url: that.d.hostUrl + '/api/miniprogram/login',
            data: {
              code: code
            },
            method: "POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(ress) {
              var data = ress.data;
              console.log(ress);
              if (data.code == 1) {
                that.globalData.sessionId = data.data.session_key;
                that.globalData.openid = data.data.openid;
                console.log(that.globalData.openid);
                //promise机制放回成功数据
                resolve(ress.data);
              }
            }
          })
        }
      })
    })
  },
  wxaddress: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      wx.getLocation({
        altitude: false,
        success: function(res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.globalData.location = {
            latitude: latitude,
            longitude: longitude
          }
          var qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + latitude + ',' +
            longitude + "&key=6EABZ-VEIK6-65DSA-M24UK-OFTS6-BLFQ3" + "&get_poi=1";
          console.log(qqMapApi);
          wx.request({
            url: qqMapApi,
            data: {},
            method: 'GET',
            success: (res) => {
              that.d.current_address = res.data.result.address;
              that.d.cityname = res.data.result.address_component.city;
              resolve(res.data);
            }
          });
        }
      });
    })
  },
  onLaunch: function() {
    var that = this
    // 展示本地存储能力1
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.getLocation({
      altitude: false,
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.globalData.location = {
          latitude: latitude,
          longitude: longitude
        }
      }
    })
  },
  getDistance: function(lat1, lng1, lat2, lng2) {
    lat1 = Number(lat1) || 0;
    lng1 = Number(lng1) || 0;
    lat2 = Number(lat2) || 0;
    lng2 = Number(lng2) || 0;
    console.log(lat1, lat2, lng1, lng2)
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
    distance = distance * 6378.137; //地球半径
    console.log(distance)
    if (distance > 1) {
      distance = Math.floor(Math.round(distance * 10000) / 10000) + 'km'
    } else {
      distance = Math.floor(Math.round(distance * 10000) / 10) + 'm'
    }
    return distance;
  },
  globalData: {
    userInfo: null,
    location: [],
    openid: '',
    sessionId: ''
  }
})