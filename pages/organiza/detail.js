// pages/course/detail.js
const app = getApp();
Page({

  data: {
    detail: [],
    course_list: [],
    xxq: [],
    teacher_list: [],
    comment: [],
    aab: [],
    mask: false
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  onShareAppMessage: function () {
    let users = wx.getStorageSync('user');
    return {
      title: '点点报班',
      path: `pages/organiza/detail?recommendid = ${app.globalData.userID}`,
      success: function (res) {

      }
    }
  },
  calltel: function (a) {
    var t = a.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: t
    })
  },
  address: function () {
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
  onLoad: function (options) {
    var that = this;
    let codeData = null
    if (options.recommendid) {
      app.globalData.recommendid = options.recommendid
    }
    if (options.bottom) {
      setTimeout(() => {
        that.pageScrollToBottom()
      }, 500)
    }
    if (options.scene) {
      codeData = options.scene.split('_')
      app.globalData.options = codeData[2]
    }
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_organization_detail',
      method: 'post',
      data: {
        id: options.id || codeData[1]
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var a = res.data.data.organization_model.show_imges ? res.data.data.organization_model.show_imges.split(",") : '';
        var b = res.data.data.organization_model.category_str ? res.data.data.organization_model.category_str.split(",") : '';
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
          id: options.id || codeData[1],
          comment: newsArr,
          teacher_list: res.data.data.teacher_list,
          location_x: res.data.data.organization_model.location_x,
          location_y: res.data.data.organization_model.location_y
        })
      }
    })
    wx.hideLoading();
  },
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  share() {
    const _that = this.data
    const that = this
    wx.showLoading({
      title: '生成中..',
    })
    wx.request({
      url: 'https://devapi.yidianedu.com/api/miniprogram/get_qr_code',
      method: "POST",
      data: {
        type: 2,
        key: _that.id,
        user_id: app.globalData.userID
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (e) => {
        wx.hideLoading()
        that.setData({
          mask: true,
          img: e.data.data.image
        })
      }
    })
  },
  maskdisappear() {
    this.setData({
      mask: false
    })
  },
  saveImg() {
    let that = this
    let imgSrc = that.data.img
    that.shouquan(imgSrc)
  },
  shouquan(imgSrc) {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              that.fileload(imgSrc)
            }
          })
        } else {
          that.fileload(imgSrc)
        }
      }
    })
  },
  fileload(imgSrc) {
    wx.showLoading({
      title: '保存中...',
      mask: true,
    })
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")

            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  },
})