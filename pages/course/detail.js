// pages/course/detail.js
const app = getApp();
Page({

  data: {
    detail:[],
    organization:[],
    juli:0
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  calltel: function(a){
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
      path: 'pages/course/detail',
      success: function (res) {

      }
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_course_detail',
      method: 'post',
      data: {
        id:options.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, res.data.data.course_model.location_y, res.data.data.course_model.location_x);
        that.setData({
          detail: res.data.data.course_model,
          juli: juli,
          organization: res.data.data.organization_model
        })
      }
    })
  }


})