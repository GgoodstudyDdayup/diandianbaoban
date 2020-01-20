// pages/course/detail.js
const app = getApp();
Page({

  data: {
    detail: [],
    organization: [],
    juli: 0,
    csslightList: {
      0: '全部',
      1: '0-3岁',
      2: '3-6岁',
      3: '6-12岁',
      4: '12-15岁',
      5: '15-18岁'
    },
    mask:false
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
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  link2() {
    wx.showModal({
      title: '提示',
      content: '订购即将上线敬请期待！！',
    })

  },
  calltel: function (a) {
    var t = a.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: t
    })
  },
  onShareAppMessage: function () {
    let users = wx.getStorageSync('user');
    if (res.from === 'button') { }
    return {
      title: '转发',
      path: `pages/course/detail?recommendid=${app.globalData.userID}`,
      success: function (res) {
      }
    }
  },
  onLoad: function (options) {
    const that = this;
    let codeData = null//作为全局变量
    if (options.recommendid) {
      app.globalData.options = options.recommendid
    }
    if (options.scene) {
      codeData = options.scene.split('_')
      app.globalData.options = codeData[2]
    }
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_course_detail',
      method: 'post',
      data: {
        id: options.id || codeData[1]
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let cssString = that.data.csslightList
        let listuseObject = res.data.data.course_age_list.map(res => {
          return cssString[res.age_id]
        }) || ''
        const imgList = res.data.data.course_model.show_images.split(',')
        listuseObject = listuseObject.join('/') || ''
        var juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, res.data.data.course_model.location_y, res.data.data.course_model.location_x);
        that.setData({
          detail: res.data.data.course_model,
          juli: juli,
          id:options.id || codeData[1],
          organization: res.data.data.organization_model,
          location_x: res.data.data.organization_model.location_x,
          location_y: res.data.data.organization_model.location_y,
          listuseObject,
          imgList//图片集
        })
      }
    })
  },
  share() {
    const _that = this.data
    const that = this
    wx.showLoading({
      title: '生成中..',
    })
    wx.request({
      url: 'https://devapi.yidianedu.com/api/miniprogram/get_qr_code',
      method:"POST",
      data: {
        type: 1,
        key: _that.id,
        user_id: app.globalData.userID
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:(e)=>{
        wx.hideLoading()
        that.setData({
          mask:true,
          img:e.data.data.image
        })
      }
    })
  },
  maskdisappear(){
    this.setData({
      mask:false
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
      success: function(res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function(err) {
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