// pages/course/detail.js
const app = getApp();
Page({
  data: {
    detail:[],
    tels:'',
    parameter: [{ id: 1, name: '0-3岁' }, { id: 2, name: '3-6岁' }, { id: 3, name: '6-12岁' }, { id: 4, name: '12-15岁' }, { id: 5, name: '15-18岁' }]
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
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
  Submit1: function (e) {
    wx.showModal({
      title: '提示',
      content: '暂未开放'
    })
  },
  formSubmit: function (e) {

    var that = this;
    var flag = true;
    var sqr = e.detail.value.names;
    var tel = e.detail.value.tel;
    var parameterList = this.data.parameter;
    var age_id = 0;
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].checked == true) {
        age_id = parameterList[i].id;
      }
    }
    if(sqr=='' || tel=='' || age_id==0){
      wx.showModal({
        title:'提示',
        content: '请填写完整数据之后在提交'
      })
    }else{
      if (tel.length > 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.request({
          url: app.d.hostUrl + '/api/miniprogram/submit_order',
          method: 'post',
          data: {
            name: sqr,
            tel: tel,
            user_id: app.d.userID,
            age_id: age_id,
            total_fee: that.data.detail.price,
            course_id: that.data.detail.id,
            type: 2
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res.data.msg);
            console.log(app.d.userID);
            if (res.data.code == 1) {
              wx.showToast({
                title: '成功!',
                icon: 'sucess',
                mask: true,
                duration: 5000
              })
              wx.navigateTo({
                url: 'detail?id=' + that.data.detail.id
              });
            }
          }
        })
      }
    }
  },
  parameterTap: function (e) {//e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
    var that = this
    var this_checked = e.currentTarget.dataset.id
    var parameterList = this.data.parameter//获取Json数组
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].id == this_checked) {
        parameterList[i].checked = true;//当前点击的位置为true即选中
      }
      else {
        parameterList[i].checked = false;//其他的位置为false
      }
    }
    that.setData({
      parameter: parameterList
    })
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      parameter: this.data.parameter,
    })
    if (app.d.userID == 0) {
      wx.redirectTo({
        url: '../authorize/authorize'
      });
    } else {
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_course_detail',
      method: 'post',
      data: {
        id: options.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          detail: res.data.data.course_model
        })
      }
    })
   }
  }


})