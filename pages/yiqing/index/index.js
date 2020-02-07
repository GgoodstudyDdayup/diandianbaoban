// pages/yiqing/index/index.js
const app = getApp()
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.js')
Page({
  data: {
    nearVar: true,
    searchVar: false,
    top: 0
  },
  onLoad: function (options) {
    this.getAddressDetail()
  },
  getAddressDetail() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',// 参考系
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        that.setData({
          latitude,
          longitude
        })
        wx.showToast({
          title: '获取中',
          icon: "loading"
        })
        that.nearSearch(latitude, longitude)
        
        that.city(latitude, longitude)
      }
    })
  },
  city(latitude, longitude) {
    const that = this
    const qqmapsdk = new QQMapWX({
      key: 'NH4BZ-5DEYU-LKGV7-4X2XO-M6JP6-YEFVA' // 必填
    });
    qqmapsdk.reverseGeocoder({
      location:{
        latitude:latitude,
        longitude:longitude
      },
      success:(res)=>{
        that.Search(res.result.address_component.city)
      }
    });
  },
  //附近的数据
  nearSearch(latitude, longitude) {
    const that = this
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_nearest_feiyan', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        location_x: longitude,
        location_y: latitude
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        const arr = res.data.data.list.reduce((l1, item) => {
          item.distance = Number(item.distance).toFixed(2)
          l1.push(item)
          return l1
        }, [])
        const markers = res.data.data.list.reduce((l2, item) => {
          l2.push({
            id: item.id,
            latitude: item.location_y,
            longitude: item.location_x,
            title: item.shop_name,
            iconPath: `../../../images/zuobiao.png`,
            width: 30,
            height: 30
          })
          return l2
        }, [])
        that.setData({
          nearList: arr,
          markers
        })
      }
    })
  },
  //搜索的默认数据
  Search(address) {
    const that = this
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_feiyan_list', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        detail_address: address
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          searchList: res.data.data.list,
        })
      }
    })
  },
  formSubmit(e) {
    console.log(e)
    const that = this
    wx.showToast({
      title: '获取中',
      icon: "loading"
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_feiyan_list', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        detail_address: e.detail.value.address
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        wx.hideToast()
        that.setData({
          searchList: res.data.data.list,
          top: 0
        })
      }
    })
  },
  nearTab() {
    const that = this
    that.setData(
      {
        nearVar: true,
        searchVar: false
      }
    )
  },
  searchTab() {
    const that = this
    that.setData(
      {
        nearVar: false,
        searchVar: true
      }
    )
  },
  info(e){
    console.log(e)
    wx.navigateTo({
      url: `../info/info?longitude=${e.currentTarget.dataset.longitude}&latitude=${e.currentTarget.dataset.latitude}&name=${e.currentTarget.dataset.name}`,
    })
  },
  onShareAppMessage: function () {
  }
})