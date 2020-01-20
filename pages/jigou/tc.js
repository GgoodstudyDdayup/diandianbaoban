const app = getApp();
Page({
  data: {
    page: 1,
    total_count:1,
    page_size:5,
    organization_id:0,
    str: '',
    teacher_list:[]
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
     wx.navigateTo({
      url: t
     });
  },
  del(e) {
    let that = this
    let f1_img = that.data.f1_img
    wx.showModal({
      title: '提示',
      content: '你确定要删除这张照片吗？',
      success(res) {
        if (res.confirm) {
          if (e.currentTarget.dataset.logo == 'banner') {
            that.setData({
              suoluotu: ''
            })
          } else if (e.currentTarget.dataset.logo == 'logo') {
            that.setData({
              logo: ''
            })
          } else {
            that.setData({
              show_imges: ''
            })
          }

        } else if (res.cancel) {
          return false
        }
      }
    })
  },
  shanchu: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.d.hostUrl + '/api/miniprogram/del_teacher',
            method: 'post',
            data: {
              id: e.currentTarget.dataset.id,
              organization_id: e.currentTarget.dataset.orid,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 1
                  });
                },1000)
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  formSubmit:function(e){
   var that = this;
    this.setData({
      str: String(e.detail.value.keyword),
      teacher_list:[]
    })
    this.getdata();
  },
  getdata:function(){
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/organization_teacher_list',
      method: 'post',
      data: {
        page_size: that.data.page_size,
        page: that.data.page,
        organization_id: that.data.organization_id,
        name: that.data.str
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.data.total_count > 0 ) { 
          that.setData({
            teacher_list: res.data.data.teacher_list
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    wx.hideLoading();
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    if (options.str) {
      that.setData({
        str: options.str
      })
    }
    if (options.id) {
      that.setData({
        organization_id: options.id
      })
    }
    that.getdata();
  },
  onReachBottom: function () {
    var that = this;
    var totalpage = parseInt((parseInt(that.data.total_count) + that.data.page_size - 1) / that.data.page_size);
    var curpage = that.data.page + 1;
    if (that.data.page >= totalpage) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'success',
        duration: 2000
      })
    }else{
      that.setData({
        page: curpage
      })
      this.getdata();
    }
  }
})
