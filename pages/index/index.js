const app = getApp();
Page({
  data: {
    indicatorDots: !0,
    autoplay: !0,
    interval: 5e3,
    duration: 1e3,
    ad_show: !0,
    acticle: [],
    current_address: '定位中',
    multiIndex: [],
    current_city: '苏州市',
    cityname: ''
  },
  onShareAppMessage: function(e) {
    // let users = wx.getStorageSync('user');
    return {
      title: '点点报班',
      path: `/pages/index/index?recommendid=${app.globalData.userID}`,
      success: function(res) {
      }
    }
  },
  formSubmit: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../search/o_search?str=' + String(e.detail.value.keyword)
    });
  },
  link: function(a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },
  onLoad: function(e) {
    if (e.recommendid){
      app.globalData.recommendid = e.recommendid
      
    }
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_index',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.getLocation({
          type: 'wgs84',
          success(data) {
            app.globalData.location.latitude = data.latitude
            app.globalData.location.longitude = data.longitude
            var indexdata = res.data.data;
            indexdata.hot_course_list.forEach((item) => {
              item.juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, item.location_y, item.location_x);
            })
            indexdata.near_organization_list.forEach((item) => {
              item.juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, item.location_y, item.location_x);
              item.shuoming = item.category_str.split(",");
            })
            that.setData({
              banner: indexdata.banner_model,
              nav: indexdata.category_list,
              hot_course_list: indexdata.hot_course_list,
              near_course_list: indexdata.near_course_list,
              near_organization_list: indexdata.near_organization_list,
              acticle: indexdata.article_list,
            });
          }
        })
        //endInitDatad
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    // 地址
    app.wxaddress().then(res => {
      that.setData({
        current_address: app.d.current_address
      });
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/is_open_city',
        data: {
          city_name: app.d.cityname
        },
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          var opencity = res.data.data;
          if (opencity.is_open) {
            app.d.province_id = opencity.city_id;
            that.setData({
              current_city: opencity.city_name,
            });
          }
        }
      });
    })
    //  用户登录
    app.wxlogin().then(res => {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/get_userinfo',
        method: 'post',
        data: {
          openid: app.globalData.openid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code == 1) {
            app.globalData.userID = res.data.data.users_model.id;
          }
        },
      });
    })
    // 省级
    wx.request({
      url: app.d.hostUrl + '/api/area/get_provices',
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        var xiaoquList = res.data.province_list;
        var xiaoquArr = xiaoquList.map(item => {　　　　 // 此方法将省名称区分到一个新数组中
          return item.province;
        });
        that.setData({
          multiArray: [xiaoquArr, []],
          xiaoquList,
          xiaoquArr
        })
        var default_xiaoqu_id = xiaoquList[0]['province_id'];　　　　 //获取默认的省对应的id
        if (default_xiaoqu_id) {
          that.searchClassInfo(default_xiaoqu_id)　　　　　　 // 如果存在调用获取对应的省级数据
        }
      }
    })
    wx.hideLoading();
  },
  //市级
  searchClassInfo(xiaoqu_id) {
    var that = this;
    if (xiaoqu_id) {
      this.setData({
        pid: xiaoqu_id
      }, () => {
        wx.request({
          url: app.d.hostUrl + '/api/area/get_citys',
          https: '',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            "province_id": that.data.pid
          },
          success: function(res) {

            var classList = res.data.city;
            var classArr = classList.map(item => {
              return item.city;
            })
            var xiaoquArr = that.data.xiaoquArr;
            that.setData({
              multiArray: [xiaoquArr, classArr],
              classArr,
              classList
            })
          }
        })
      })
    }
  },
  bindMultiPickerColumnChange: function(e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    data.multiIndex[e.detail.column] = e.detail.value;
    var pid_session = this.data.pid;　　　　 // 保持之前的省id 与新选择的id 做对比，如果改变则重新请求数据
    switch (e.detail.column) {
      case 0:
        var xiaoquList = this.data.xiaoquList;
        var pid = xiaoquList[e.detail.value]['province_id'];
        if (pid_session != pid) {　　　　 // 与之前保持的省id做对比，如果不一致则重新请求并赋新值
          this.searchClassInfo(pid);
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindMultiPickerChange: function(e) {
    var that = this;
    var classList = this.data.classList;
    var select_key = e.detail.value[1];
    var province_id = classList[select_key]['city_id'];　　　　 // city_id 代表着选择的市级对应的
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_open_city',
      https: '',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {

      },
      success: function(res) {
        var opencity = res.data.data.city_list;
        var arrays = opencity.map(item => {
          return item.city_id;
        });
        if (arrays.indexOf(province_id)) {
          wx.showToast({
            title: '城市暂未开放',
            duration: 2000
          });
          app.d.province_id = app.d.coustcity_id;
        } else {
          app.d.province_id = classList[select_key]['city_id'];
          console.log(app.d.province_id);
        }
      }
    })
  },
  maps: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res, "location")
        console.log(res.name)
        app.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.setData({
          current_address: res.address
        })
      }
    });
  },
  tel(){
    wx.makePhoneCall({
      phoneNumber: '4006-985-017' //仅为示例，并非真实的电话号码
    })
  }
  // onShow: function() {
  //   this.onLoad();
  // }
})