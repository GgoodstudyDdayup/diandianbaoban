// pages/course/detail.js
const app = getApp();
Page({

  data: {
    detail: [],
    course_list: [],
    xxq: [],
    teacher_list: [],
    comment: [],
    aab: []
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
      path: 'pages/organiza/detail',
      success: function(res) {

      }
    }
  },
  calltel: function(a) {
    var t = a.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: t
    })
  },
  address: function() {
    let that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const x = that.data.location_x
        const y = that.data.location_y
        wx.openLocation({
          latitude: Number(y),
          longitude: Number(x),
          scale: 18
        })
      }
    })
  },
  onLoad: function(options) {
    var that = this;
    if (options.bottom) {
      setTimeout(() => {
        that.pageScrollToBottom()
      }, 500)
    }
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
      success: function(res) {
        console.log(res)
        var a = res.data.data.organization_model.show_imges.split(",");
        var b = res.data.data.organization_model.category_str.split(",");
        var newsArr = res.data.data.comment_list;
        newsArr.forEach((item) => {
          item.one_1 = parseInt(item.star);
          item.two_1 = 5 - parseInt(item.star);
        })
        that.setData({
          detail: res.data.data.organization_model,
          course_list: res.data.data.course_list,
          xxq: a,
          aab: b,
          comment: newsArr,
          teacher_list: res.data.data.teacher_list,
          location_x: res.data.data.organization_model.location_x,
          location_y: res.data.data.organization_model.location_y
        })
      }
    })
    wx.hideLoading();
  },
  pageScrollToBottom: function() {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function(rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },


})