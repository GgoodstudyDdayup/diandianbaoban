const app = getApp();
Page({
  data: {
    page: 1,
    total_count:1,
    page_size:5,
    course_list: [], //数据
    str: ''
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  formSubmit:function(e){
   var that = this;
    this.setData({
      str: String(e.detail.value.keyword),
    })
    this.getdata();
  },
  getdata:function(){
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_course_list',
      method: 'post',
      data: {
        page_size: that.data.page_size,
        page: that.data.page,
        str: that.data.str
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1 && res.data.data.course_list.length > 0) { 
          var listdata = res.data.data.course_list;
            var newsArr=[];
            if(that.data.page==1){
              newsArr =[];
            }else{
              newsArr = that.data.course_list;
            }
            for (var i = 0; i < listdata.length; i++) {
              newsArr.push(listdata[i])
            }
          newsArr.forEach((item) => {
            item.juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, item.location_y, item.location_x);
          })
            that.setData({
              course_list: newsArr,
              total_count: res.data.data.total_count
            });
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            course_list: ''
          });
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
    if (options.str) {
      that.setData({
        str: options.str
      })
    }
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
