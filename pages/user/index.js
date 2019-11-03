const app = getApp();
Page({
  data: {
    detail: [],
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  onLoad: function () {
    var that = this;
    console.log(app.d.userID);
    wx.showLoading({
      title: '玩命加载中',
    })
    console.log(app.d.userID)
    if (wx.getStorageSync('userID') == 0 ) {
      wx.redirectTo({
        url: '../authorize/authorize'
      });
    }else{
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/get_userinfo',
        method: 'post',
        data: {
          openid: app.globalData.openid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          app.globalData.organization_id = res.data.data.users_model.organization_id
          app.d.userID = res.data.data.users_model.id
          that.setData({
            detail: res.data.data.users_model
          });
          console.log(app.d.userID)
          //endInitDatad
          wx.hideLoading();
        },
      })
    }

  },
  // onShow: function () {
  //   this.onLoad();
  // }
})
