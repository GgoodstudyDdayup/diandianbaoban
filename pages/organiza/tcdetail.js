const app = getApp();
Page({
  data: {
    detail: []
  },
  onShareAppMessage: function () {
    let users = wx.getStorageSync('user');
    return {
      title: '点点报班',
      path: `pages/organiza/tcdetail?recommendid = ${app.globalData.userID}`,
      success: function (res) {

      }
    }
  },
  onLoad: function (options) {
    if (options.recommendid){
      app.globalData.recommendid = options.recommendid
    }
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/organization_teacher_detail',
      method: 'post',
      data: {
        id:options.id,
        organization_id: options.organization_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.setData({
          detail: res.data.data.teacher_model
        });
        //endInitDatad
        wx.hideLoading();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  }

})
