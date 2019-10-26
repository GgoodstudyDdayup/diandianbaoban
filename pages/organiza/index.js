const app = getApp();
Page({
  data: {
    current_address: '定位中'
  },
  link: function(a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  onShareAppMessage: function() {
    let users = wx.getStorageSync('user');
    if (res.from === 'button') {}
    return {
      title: '转发',
      path: 'pages/organiza/index',
      success: function(res) {

      }
    }
  },
  onLoad: function() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_organization',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var indexdata = res.data.data;
        indexdata.near_organization_list.forEach((item) => {
          item.juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, item.location_y, item.location_x);
          item.shuoming = item.category_str.split(",");
        })

        console.log(app.globalData.location.latitude);
        that.setData({
          nav: indexdata.category_list,
          near_organization_list: indexdata.near_organization_list,
          current_address: app.d.current_address
        });
        //endInitDatad
        wx.hideLoading();
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  formSubmit: function(e) {
    var that = this;
    var t = e.detail.value.keyword;
    wx.navigateTo({
      url: 'list?str=' + t
    });
  },
  maps: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        app.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.setData({
          current_address: res.address
        })
      }
    });
  },
  // onShow: function() {
  //   this.onLoad();
  // }
})