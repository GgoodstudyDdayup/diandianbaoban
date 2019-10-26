const app = getApp();
let wxparse = require("../../wxParse/wxParse.js");
Page({
  data: {
    detail: []
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_other',
      method: 'post',
      data: {
        code: options.code,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          detail: res.data.data.model
        })
        wxparse.wxParse('news', 'html', res.data.data.model.content, that, 5);
      }
    })
    wx.hideLoading();
  }

})
