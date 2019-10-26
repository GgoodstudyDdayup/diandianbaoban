const app = getApp();
let wxparse = require("../../wxParse/wxParse.js");
Page({
  data: {
    id: 0,
    detail: []
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    if (options.id) {
      that.setData({
        id: options.id
      })
    }
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_article_detail',
      method: 'post',
      data: {
        id: options.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          detail: res.data.data.article_model
        })
        wxparse.wxParse('news', 'html', res.data.data.article_model.content, that, 5);
      }
    })
    wx.hideLoading();
  }

})
