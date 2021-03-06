const app = getApp();
Page({
  data: {
    type:1,
    page: 1,
    total_count:1,
    page_size:5,
    order_list: [], //数据
    sort:''
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
     wx.navigateTo({
      url: t
     });
  },
  getdata:function(){
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/my_order_list',
      method: 'post',
      data: {
        page_size: that.data.page_size,
        page: that.data.page,
        user_id:app.d.userID||app.globalData.userID,
        type:that.data.type,
        sort: that.data.sort
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.data.total_count > 0 ) { 
            that.setData({
              order_list: res.data.data.order_list
            });
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    wx.hideLoading();
  },
  onLoad: function (options) {
    var that = this;
    // that.setData({
    //   type: options.type
    // });
    //暂时只有试听
    that.getdata();
  },
  onReachBottom: function () {
    var that = this;
    var totalpage = parseInt((parseInt(that.data.total_count) + that.data.page_size - 1) / that.data.page_size);
    var curpage = that.data.page + 1;
    if (that.data.page >= totalpage) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'success',
        duration: 2000
      })
    }else{
      that.setData({
        page: curpage
      })
      this.getdata();
    }
  }
})



