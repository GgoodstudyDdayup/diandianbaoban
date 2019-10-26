const app = getApp();
Page({
  data: {
    category_list:[],
    logo:'',
    banner:'',
    jigou:'',
    xieyi:1,
    tels:'',
    current_address:''
  },
  maps: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          current_address: res.address
        })
      }
    });
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  checkboxChange1(e) {
    var that = this;
    if(e.detail.value==1){
      that.setData({
        xieyi: 1
      })
    }else{
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
      success: function (res) {
        that.setData({
          tels: res.data.phoneNumber
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this;
    var flag = true;
    var sqr = e.detail.value.names;
    var add = e.detail.value.address;
    var linkname = e.detail.value.linkname;
    var introduce = e.detail.value.introduce;
    var tel = e.detail.value.tel;
    if (sqr == '' || tel == '' || add == '' || that.data.logo == '' || linkname == '' || that.data.xieyi == 0 || that.data.jigou == '' || introduce =='' ) {
      if (that.data.xieyi == 0){
        wx.showModal({
          title: '提示',
          content: '请点击同意阅读并同意入住协议'
        })
     }else{
       wx.showModal({
         title: '提示',
         content: '请填写完整数据之后在提交'
       })
     }
     
    } else {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/join',
        method: 'post',
        data: {
          user_id: app.d.userID,
          name: sqr,
          logo: that.data.logo,
          banner: that.data.banner,
          tel: tel,
          city_id: app.d.province_id,
          X: app.globalData.location.longitude,
          Y: app.globalData.location.latitude,
          CITYID: app.d.province_id,
          linkman: linkname,
          address:add,
          category_str: that.data.jigou,
          introduce: introduce
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(that.data.logo);
          console.log(res.data.msg);
          console.log(that.data.jigou);
          if (res.data.code == 1) {
            wx.switchTab({
              url: 'index'
            })
          }
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    //判断是否审核
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
        if (res.data.data.users_model.organization_state == 1 || res.data.data.users_model.organization_state == 2 ){
          wx.showModal({
            title: '提示',
            content: '机构审核中，请耐心等待！'
          })
          wx.switchTab({
            url: 'index',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }
      },
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_category_list',
      method: 'post',
      data: {
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          category_list: res.data.data.category_list
        })
      }
    })
    wx.hideLoading();
  },
  changeAvatar1: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,// 默认9
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //这里是上传操作
        wx.uploadFile({
          url: app.d.hostUrl + '/api/upload/upload_single_img',
          filePath: tempFilePaths[0],//要上传文件资源的路径 String类型 
          name: 'upload_file',//按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data"//记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'session_token': wx.getStorageSync('session_token')
          },
          success: function (res) {
            console.log(res.data);
            var pic = JSON.parse(res.data);
            if (pic.code == 1) {
              that.setData({
                banner: app.d.hostUrl + '/' + pic.single_file_path
              })
              wx.hideToast();
            }
          }

        })
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
      }
    })
  },
  changeAvatar: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,// 默认9
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })  
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //这里是上传操作
        wx.uploadFile({
          url: app.d.hostUrl + '/api/upload/upload_single_img', 
          filePath: tempFilePaths[0],//要上传文件资源的路径 String类型 
          name: 'upload_file',//按个人情况修改，文件对应的 key,开发者在服务器端通过这个 key 可以获取到文件二进制内容，(后台接口规定的关于图片的请求参数)
          header: {
            "Content-Type": "multipart/form-data"//记得设置
          },
          formData: {
            //和服务器约定的token, 一般也可以放在header中
            'session_token': wx.getStorageSync('session_token')
          },
          success: function (res) {
            console.log(res.data);
            var pic = JSON.parse(res.data);
            if (pic.code== 1){
              that.setData({
                logo: app.d.hostUrl + '/' +pic.single_file_path
              })
              wx.hideToast();
            }
          }

        })
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
      }  
    })
  }


})