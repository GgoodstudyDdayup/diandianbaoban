const app = getApp();
Page({
  data: {
    xxq:[]
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
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_organization_detail',
      method: 'post',
      data: {
        id: options.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var a = res.data.data.organization_model.show_imges.split(",");
        that.setData({
          xxq: a
        })
      }
    })
    wx.hideLoading();
  }

})
