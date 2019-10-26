// pages/course/detail.js
const app = getApp();
var count = 0;
Page({

  data: {
    detail:[],
    stardata: [1, 2, 3, 4, 5],
    key: 0, //评分
    organization_id:0
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  selectRight: function (e) {
    var num = e.currentTarget.dataset.no;
    this.setData({
      key: num
    })
  },
  formSubmit: function (e) {
    var that = this;
    var textarea = e.detail.value.textarea;
    if (textarea ==''){
      wx.showModal({
        title:'提示',
        content: '请填写完整数据之后在提交'
      })
    }else{
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/comment',
        method: 'post',
        data: {
          user_id: app.d.userID,
          organization_id: that.data.organization_id,
          star:that.data.key,
          content: textarea
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
           if(res.data.code==1){
             wx.showToast({
               title: '评价成功!',
               icon: 'sucess',
               mask: true,
               duration: 10000
             })
             wx.navigateTo({
               url: 'detail?id=' + that.data.organization_id
             });
           }
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      parameter: this.data.parameter,
      organization_id: options.id
    })
    if (app.d.userID == 0) {
      wx.redirectTo({
        url: '../authorize/authorize'
      });
    } else {
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
          detail: res.data.data.organization_model
        })
      }
    })
    }
  }


})