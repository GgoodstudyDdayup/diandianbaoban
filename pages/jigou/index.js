const app = getApp();
Page({
  data: {
    detail: []
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.switchTab({
      url: t
      })
  },
  headTap(e){
    wx.navigateTo({
      url: `jigouguanli?id=${this.data.detail.id}`
    })
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

        that.setData({
          detail: res.data.data.organization_model
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
