// pages/course/detail.js
const app = getApp();
Page({

  data: {
    detail: [],
    organization: [],
    juli: 0,
    csslightList: {
      0: '全部',
      1: '0-3岁',
      2: '3-6岁',
      3: '6-12岁',
      4: '12-15岁',
      5: '15-18岁'
    }
  },
  address: function() {
    console.log(111)
    let that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const x = that.data.location_x
        const y = that.data.location_y
        wx.openLocation({
          latitude:Number(y) ,
          longitude: Number(x),
          scale: 18
        })
      }
    })
  },
  link: function(a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  link2(){
    wx.showModal({
      title: '提示',
      content: '订购即将上线敬请期待！！',
    })
    
  },
  calltel: function(a) {
    var t = a.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: t
    })
  },
  onShareAppMessage: function () {
    let users = wx.getStorageSync('user');
    if (res.from === 'button') { }
    return {
      title: '转发',
      path: `pages/course/detail?recommendid=${app.globalData.userID}`,
      success: function (res) {
      }
    }
  },
  onLoad: function(options) {
    if (options.recommendid){
      app.globalData.options = options.recommendid
    }
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_course_detail',
      method: 'post',
      data: {
        id: options.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        let cssString = that.data.csslightList
        let listuseObject = res.data.data.course_age_list.map(res=>{
          return cssString[res.age_id]
        })
        const imgList = res.data.data.course_model.show_images.split(',')
        console.log(imgList)
        listuseObject = listuseObject.join('/')
        var juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, res.data.data.course_model.location_y, res.data.data.course_model.location_x);
        that.setData({
          detail: res.data.data.course_model,
          juli: juli,
          organization: res.data.data.organization_model,
          location_x: res.data.data.organization_model.location_x,
          location_y: res.data.data.organization_model.location_y,
          listuseObject,
          imgList//图片集
        })
      }
    })
  }


})