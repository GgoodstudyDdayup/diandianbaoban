const app = getApp();
Page({
  data: {
    detail: [],
    tels: '',
    id:'',
    casIndex:0, 
    current_address: '',
    casArray: ['小班','中班','大班','一年级','二年级','三年级','四年级','五年级','六年级','初一','初二','初三','高一','高二','高三','高中毕业','大学','成人','其它']
  },
  bindCasPickerChange: function (e) { 
        this.setData({ 
          casIndex: e.detail.value 
          }) 
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
    var tel = e.detail.value.tel;
    var school = e.detail.value.school;
    var grade = e.detail.value.grade;
    var classs = e.detail.value.classs;
    if (sqr == '' || tel == '' || add == '' || grade == '' || classs == '' || school == '' ) {
        wx.showModal({
          title: '提示',
          content: '请填写完整数据之后在提交'
        })
    } else {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/edit_userinfo',
        method: 'post',
        data: {
          id: that.data.id,
          name: sqr,
          mobile: tel,
          school: school,
          grade: grade,
          class: classs,
          address: add
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data.msg);
            wx.switchTab({
              url: 'index'
            })
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
   
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
        that.setData({
          detail: res.data.data.users_model,
          tels: res.data.data.users_model.mobile,
          current_address: res.data.data.users_model.address,
          id: res.data.data.users_model.id
        });
        if (res.data.data.users_model.grade!=null){
          that.setData({
            casIndex: res.data.data.users_model.grade
          });
        }
      }
    });
    wx.hideLoading();
  }

})