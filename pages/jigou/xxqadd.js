const app = getApp();
Page({
  data: {
    organization_id:0,
    detail:[],
    xianshi:[],
    suoluotu:'',
    show_imges:''
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  formSubmit: function (e) {
    var that = this;
    var xxqs='';
    if (that.data.show_imges){
      xxqs = that.data.show_imges + ',' + that.data.suoluotu;
    }else{
      xxqs =  that.data.suoluotu;
    }
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/edit_organization_image',
      method: 'post',
      data: {
        organization_id: that.data.organization_id,
        show_imges: xxqs
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.navigateTo({
          url: 'xxgl?id=' + that.data.organization_id
        })
      }
    })
  },
  dels: function (a) {
    var dd = a.currentTarget.dataset.tu + ',';
    var that = this;
    var a = that.data.suoluotu + ',';
    var str1 = a.replace(dd, '');
    var show_imges = str1.substring(0, str1.length - 1);
    that.setData({
      xianshi: show_imges.split(','),
      suoluotu: show_imges
    })
    wx.showToast({
      title: '删除成功！',
      icon: 'sucess',
      mask: true,
      duration: 1000
    }) 

  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_organization_detail',
      method: 'post',
      data: {
        id: options.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          show_imges: res.data.data.organization_model.show_imges,
        })
      }
    })
    that.setData({
      organization_id: options.id,
    })
  },
  changesuoluotu: function (e) {
    var that = this;
    wx.chooseImage({
      count: 9,// 默认9
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var length = res.tempFilePaths.length; //总数
        var tupian ='';
        var j=0;
        for (var i = 0; i < length; i++) {
          wx.uploadFile({
            url: app.d.hostUrl + '/api/upload/upload_single_img', 
            filePath: res.tempFilePaths[i],
            name: 'upload_file',
            formData: {
              'organization_id': that.data.organization_id
            },
            header: {
              "Content-Type": "multipart/form-data"//记得设置
            },
            success: function (res) {

              var pic = JSON.parse(res.data);
              if (pic.code == 1) {
                j++;
                tupian = tupian + ',' + app.d.hostUrl + pic.single_file_path;
                wx.showToast({
                  title: '正在上传第' + j + '张图片',
                  icon: 'sucess',
                  mask: true,
                  duration: 5000
                }) 
              }
              if(j==length){
                if(that.data.suoluotu){
                 var bb = that.data.suoluotu + ',';
                }else{
                 var bb='';
                }
                var aa = bb + tupian.substring(1, tupian.length);
                that.setData({
                  suoluotu: aa,
                  xianshi: aa.split(',')
                })
                wx.hideToast();
              }
            }
          })
        } 
      }
    })
  }


})