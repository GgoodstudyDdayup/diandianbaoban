// pages/jigou/jigouguanli.js
const app = getApp();
Page({
  data: {
    category_list: [],
    f1_img: {
      logo: '',
      banner: '',
      show_imges: []
    },
    logo: '',
    banner: '',
    show_imges: [],
    jigou: '',
    xieyi: 1,
    tels: '',
    current_address: ''
  },
  maps: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          current_address: res.address,
          location_x: res.longitude,
          location_y: res.latitude
        })
      }
    });
  },
  link: function(a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  checkboxChange1(e) {
    var that = this;
    if (e.detail.value == 1) {
      that.setData({
        xieyi: 1
      })
    } else {
      that.setData({
        xieyi: 0
      })
    }
    console.log(that.data.xieyi);
  },
  checkboxChange(e) {
    var that = this;
    that.setData({
      jigou: e.detail.value
    })
    console.log(that.data.jigou);
  },
  getPhoneNumber(e) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/ecrypt_str',
      method: 'post',
      data: {
        iv: e.detail.iv,
        sessionKey: app.globalData.sessionId,
        data_str: e.detail.encryptedData,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          tels: res.data.phoneNumber
        })
      }
    })
  },
  formSubmit: function(e) {
    console.log(e)
    var that = this;
    var flag = true;
    var sqr = e.detail.value.names;
    var add = e.detail.value.address;
    var linkname = e.detail.value.linkname;
    var introduce = e.detail.value.introduce;
    var tel = e.detail.value.tel;
    let location_x = that.data.location_x || that.data.category_list.location_x
    let location_y = that.data.location_y || that.data.category_list.location_y
    let address = that.data.current_address || that.data.category_list.address
    let logo = that.data.f1_img.logo || that.data.category_list.logo
    let banner = that.data.f1_img.banner || that.data.category_list.banner
    let show_imges = that.data.f1_img.show_imges || that.data.category_list.show_imges
    show_imges = show_imges.join(',')
    // console.log(logo, banner, show_img)
    if (sqr == '' || tel == '' || add == '' || linkname == '' || introduce == '') {
      wx.showModal({
        title: '提示',
        content: '请填写完整数据之后在提交'
      })
    } else {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/edit_organization',
        method: 'POST',
        data: {
          organization_id: app.globalData.organization_id,
          name: sqr,
          tel,
          linkman: linkname,
          location_x,
          location_y,
          address,
          introduce,
          logo,
          show_imges,
          banner
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res)
          console.log(that.data.logo);
          console.log(res.data.msg);
          console.log(that.data.jigou);
          if (res.data.code == 1) {
            wx.showToast({
              title: `${res.data.msg}`,
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else if (res.data.code == -1) {
            wx.showToast({
              title: `${res.data.msg}`,
            })
          }
        }
      })
    }
  },
  onLoad: function(options) {
    var that = this;
    //判断是否审核
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_organization_detail',
      method: 'post',
      data: {
        id: app.globalData.organization_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        let f1_img = that.data.f1_img
        f1_img.show_imges = res.data.data.organization_model.show_imges.split(',')
        f1_img.banner = res.data.data.organization_model.banner
        f1_img.logo = res.data.data.organization_model.logo
        that.setData({
          category_list: res.data.data.organization_model,
          f1_img
        })
        console.log(f1_img.show_imges)
      }
    })
    wx.hideLoading();
  },
  del(e) {
    console.log(e)
    let that = this
    let category_list = that.data.category_list
    let f1_img = that.data.f1_img
    wx.showModal({
      title: '提示',
      content: '你确定要删除这张照片吗？',
      success(res) {
        if (res.confirm) {
          if (e.currentTarget.dataset.logo == 'show_imges') {
            let i = e.currentTarget.dataset.index
            console.log(i)
            console.log(f1_img.show_imges)
            f1_img.show_imges.splice(i, 1)
            that.setData({
              f1_img
            })
          } else if (e.currentTarget.dataset.logo == 'logo'){
            f1_img.logo = ''
            that.setData({
              f1_img
            })
          }else{
            f1_img.banner = ''
            that.setData({
              f1_img
            })
          }
        } else if (res.cancel) {
          return false
        }
      }
    })
    console.log(e)
  },
  changeAvatar1: function(e) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let f1_img = that.data.f1_img
        f1_img.banner = res.tempFilePaths[0]
        that.setData({
          f1_img
        })
        //这里是上传操作
        wx.uploadFile({
          url: app.d.hostUrl + '/api/upload/upload_single_img',
          filePath: tempFilePaths[0], //要上传文件资源的路径 String类型 
          name: 'upload_file', //按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'session_token': wx.getStorageSync('session_token')
          },
          success: function(res) {
            console.log(res.data);
            var pic = JSON.parse(res.data);
            if (pic.code == 1) {
              let banner = that.data.banner
              f1_img.banner = app.d.hostUrl + '/' + pic.single_file_path
              that.setData({
                banner
              })
              wx.hideToast();
            }
          }

        })
      },
      fail: function(res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function(res) {}
        })
      }
    })
  },
  changeAvatar: function(e) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let f1_img = that.data.f1_img
        f1_img.logo = res.tempFilePaths[0]
        that.setData({
          f1_img
        })
        //这里是上传操作
        wx.uploadFile({
          url: app.d.hostUrl + '/api/upload/upload_single_img',
          filePath: tempFilePaths[0], //要上传文件资源的路径 String类型 
          name: 'upload_file', //按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'session_token': wx.getStorageSync('session_token')
          },
          success: function(res) {
            console.log(res.data);
            var pic = JSON.parse(res.data);
            if (pic.code == 1) {
              let logo = that.data.logo
              logo = app.d.hostUrl + '/' + pic.single_file_path
              that.setData({
                logo
              })

              wx.hideToast();
            }
          }
        })
      },
      fail: function(res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function(res) {}
        })
      }
    })
  },
  changeAvatar3: function(e) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let f1_img = that.data.f1_img
        console.log(res.tempFilePaths[0])
        // f1_img.show_imges.push(res.tempFilePaths[0])
        // that.setData({
        //   f1_img
        // })
        // console.log(f1_img.show_imges)
        //这里是上传操作
        wx.uploadFile({
          url: app.d.hostUrl + '/api/upload/upload_single_img',
          filePath: tempFilePaths[0], //要上传文件资源的路径 String类型 
          name: 'upload_file', //按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'session_token': wx.getStorageSync('session_token')
          },
          success: function(res) {
            console.log(res.data);
            var pic = JSON.parse(res.data);
            if (pic.code == 1) {
              f1_img.show_imges.push(`${app.d.hostUrl}/${pic.single_file_path}`)
              // show_imges = app.d.hostUrl + '/' + pic.single_file_path
              that.setData({
                f1_img
              })
              wx.hideToast();
            }
          }
        })
      },
      fail: function(res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function(res) {}
        })
      }
    })
  }
})