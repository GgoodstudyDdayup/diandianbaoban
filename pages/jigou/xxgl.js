const app = getApp();
Page({
  data: {
    organization_id:0,
    detail:''
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  shanchu: function (e) {
    var that = this;
    var a = e.currentTarget.dataset.ds +',';
    var str = that.data.detail + ',';
    var str1 = str.replace(a, '');
    var show_images = str1.substring(0,str1.length-1);
    console.log(show_images);
    if (!show_images) { show_images='';}
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.d.hostUrl + '/api/miniprogram/edit_organization_image',
            method: 'post',
            data: {
              organization_id: that.data.organization_id,
              show_imges: show_images
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data.msg);
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateTo({
                url: 'index?id=' + that.data.organization_id
              });
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onLoad: function (options) {
    var that = this;
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
      success: function (res) {
        console.log(res.data.data.organization_model.show_imges);
        that.setData({
          organization_id: res.data.data.organization_model.id,
        })
        if (res.data.data.organization_model.show_imges){
          that.setData({
            xxq: res.data.data.organization_model.show_imges.split(","),
            detail: res.data.data.organization_model.show_imges
          })
        }else{
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
    wx.hideLoading();

  }
})
