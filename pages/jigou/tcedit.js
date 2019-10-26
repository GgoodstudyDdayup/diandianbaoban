const app = getApp();
Page({
  data: {
    logo:'',
    organization_id:0,
    detail:[]
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },

  formSubmit: function (e) {
    var that = this;
    var name = e.detail.value.names;
    var teach = e.detail.value.teach;
    var introduce = e.detail.value.introduce;
    if (name == '' || teach == '' || that.data.logo == ''  || introduce =='' ) {
       wx.showModal({
         title: '提示',
         content: '请填写完整数据之后在提交'
       })
    } else {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/edit_teacher',
        method: 'post',
        data: {
          name:name,
          id:that.data.detail.id,
          image:that.data.logo,
          teach:teach,
          organization_id: that.data.organization_id,
          detail: introduce,
          X: app.globalData.location.longitude,
          Y: app.globalData.location.latitude,
          CITYID: app.d.province_id,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data.msg);
          if (res.data.code == 1) {
            wx.navigateTo({
              url: 'tc?id=' + that.data.organization_id
            })
          }
        }
      })
    }
  },
  onLoad: function (options) {
   var that = this;
   that.setData({
     organization_id: options.organization_id
   })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/organization_teacher_detail',
      method: 'post',
      data: {
        id: options.id,
        organization_id: options.organization_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          detail: res.data.data.teacher_model
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
                logo: app.d.hostUrl +'/'+ pic.single_file_path
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