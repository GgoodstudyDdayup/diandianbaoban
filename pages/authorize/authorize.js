const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              //从数据库获取用户信息
              that.queryUsreInfo();
              console.log(app.d.userID);
              //用户已经授权过
              wx.switchTab({
                url: '/pages/user/index'
              })
            }
          });
        }
      }
    })
  },

  bindGetUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/register',
        data: {
          openid: app.globalData.openid,
          nickname: e.detail.userInfo.nickName,
          headimgurl: e.detail.userInfo.avatarUrl,
          province: e.detail.userInfo.province,
          sex: e.detail.userInfo.gender,
          city: e.detail.userInfo.city,
          Y: app.globalData.location.latitude,
          X: app.globalData.location.longitude,
          CITYID: app.d.province_id,
          country: e.detail.userInfo.country,
          recommendid: app.globalData.recommendid
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          //从数据库获取用户信息
          console.log(res)
          console.log(app.globalData.location.latitude);
          console.log(app.globalData.location.longitude);
          console.log(res.data.msg);
          if (res.data.code == 1 || res.data.code == -1) {
            that.queryUsreInfo();
          } else {
            wx.showToast({
              title: '授权失败！',
              duration: 2000
            });
          }
        }
      });
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function() {
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
        if (res.data.code == 1) {
          app.globalData.userInfo = res.data.data.users_model;
          app.d.userID = res.data.data.users_model.id;
          //授权成功后，跳转进入小程序首页
          console.log(app.d.userID);
          wx.switchTab({
            url: '/pages/user/index'
          })
          wx.setStorageSync('userID', res.data.data.users_model.id)
          console.log(wx.getStorageSync('userID'))
          console.log(app.d.userID);
        }
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  }

})