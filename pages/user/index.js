const app = getApp();
Page({
  data: {
    detail: [],
  },
  link: function(a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  onLoad: function() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    if (wx.getStorageSync('userID') == 0) {
      wx.redirectTo({
        url: '../authorize/authorize'
      });
    } else {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/get_userinfo',
        method: 'post',
        data: {
          openid: app.globalData.openid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.msg == '该会员不存在') {
            wx.hideLoading();
            wx.navigateTo({
              url: '../authorize/authorize',
            })
          } else {
            app.globalData.organization_id = res.data.data.users_model.organization_id
            app.d.userID = res.data.data.users_model.id
            that.setData({
              detail: res.data.data.users_model
            });
            //endInitDatad
            wx.hideLoading();
          }
        },
      })
    }

  },
  tel(){
    wx.makePhoneCall({
      phoneNumber: '4006-985-017' //仅为示例，并非真实的电话号码
    })
  }
  // onShow: function () {
  //   this.onLoad();
  // }
})