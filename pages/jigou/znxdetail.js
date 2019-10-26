const app = getApp();
let wxparse = require("../../wxParse/wxParse.js");
Page({
  data: {
    organization_id:0,
    id:0,
    detail:[]
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
     wx.navigateTo({
      url: t
     });
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
    if (options.organization_id) {
      that.setData({
        organization_id: options.organization_id
      })
    }
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/organization_notice_detail',
      method: 'post',
      data: {
        id: options.id,
        organization_id: options.organization_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var cont = res.data.data.notice_model.content;
        that.setData({
          detail: res.data.data.notice_model
        });
        wxparse.wxParse('news', 'html', cont, that, 5);
      }
    })
    wx.hideLoading();
  }

})
