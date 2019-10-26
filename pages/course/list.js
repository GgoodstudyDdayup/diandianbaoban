const app = getApp();
Page({
  data: {
    flMask: false,
    lxMask: false,
    xlMask: false,
    hsshow: false,
    qyMask: false,
    flname: '课程分类',
    kcname: '课程类型',
    xlname: '销量',
    qyname: '附近',
    page: 1,
    total_count:1,
    page_size:5,
    category_list:[],//分类数据
    category_list2: [],//二级分类数据
    district_list:[],//区域数据
    course_list: [], //数据
    top_category:0,
    second_category:0,
    is_hot: 0,
    age_id: 0,
    district_id:0,
    str: '',
    sort: 1
  },
  onShareAppMessage: function () {
    let users = wx.getStorageSync('user');
    if (res.from === 'button') { }
    return {
      title: '转发',
      path: 'pages/course/list',
      success: function (res) {

      }
    }
  },
  link: function (a) {
    var district = a.currentTarget.dataset.district;
    var qyname = a.currentTarget.dataset.qyname;
    var second_category = a.currentTarget.dataset.category2;
    var top_category = a.currentTarget.dataset.category;
    var flname = a.currentTarget.dataset.flname;
    var is_hot = a.currentTarget.dataset.hot;
    var kcname = a.currentTarget.dataset.kcname;
    var sort = a.currentTarget.dataset.sort;
    var xlname = a.currentTarget.dataset.xlname;
    var ageid = a.currentTarget.dataset.ageid;
    var that = this;

    if (second_category) {
      that.setData({
        second_category: second_category,
        top_category: top_category,
        flname: flname,
        flMask: false,
        lxMask: false,
        hsshow: false,
        xlMask: false,
        qyMask: false
      })
    }
    if (is_hot) {
      that.setData({
        is_hot: is_hot,
        kcname: kcname,
        flMask: false,
        lxMask: false,
        hsshow: false,
        xlMask: false,
        qyMask: false
      })
    }
    if (sort) {
      that.setData({
        sort: sort,
        xlname: xlname,
        flMask: false,
        lxMask: false,
        hsshow: false,
        xlMask: false,
        qyMask: false
      })
    }
    if (ageid) {
      that.setData({
        age_id: ageid
      })
    }
    if (district) {
      that.setData({
        district_id: district,
        qyname: qyname,
        flMask: false,
        lxMask: false,
        hsshow: false,
        xlMask: false,
        qyMask: false
      })
    }
    console.log(that.data.top_category);
    console.log(that.data.second_category);
    that.getdata();
  },
  bb:function(){
    this.setData({
      flMask: false,
      lxMask: false,
      hsshow: false,
      xlMask: false,
      qyMask: false
    })
  },
  clickPerson: function (a) {
    var flMask = this.data.flMask;
    var lxMask = this.data.lxMask;
    var xlMask = this.data.xlMask;
    var qyMask = this.data.qyMask;
    var t = a.currentTarget.dataset.current;
    if(t==1){
      if (flMask == true) {
        this.setData({
          flMask: false,
          lxMask: false,
          hsshow: false,
          xlMask: false,
          qyMask: false,
          flname: '课程分类'

        })
      } else {
        this.setData({
          flMask: true,
          lxMask: false,
          xlMask: false,
          qyMask: false,
          hsshow: true,
        })
      }
    }
    if(t == 2){
      if (lxMask == true) {
        this.setData({
          flMask: false,
          lxMask: false,
          hsshow: false,
          qyMask: false,
          xlMask: false,
          kcname: '课程类型'
        })
      } else {
        this.setData({
          flMask: false,
          lxMask: true,
          qyMask: false,
          xlMask: false,
          hsshow: true
        })
      }
    } 
    if (t == 3){
      if (xlMask == true) {
        this.setData({
          flMask: false,
          lxMask: false,
          qyMask: false,
          hsshow: false,
          xlMask: false,
          xlname: '销量'
        })
      } else {
        this.setData({
          flMask: false,
          lxMask: false,
          qyMask: false,
          xlMask: true,
          hsshow: true
        })
      }
    }
    if (t == 4) {
      if (qyMask == true) {
        this.setData({
          flMask: false,
          lxMask: false,
          qyMask: false,
          hsshow: false,
          xlMask: false,
          qyname: '附近'
        })
      } else {
        this.setData({
          flMask: false,
          lxMask: false,
          qyMask: true,
          xlMask: false,
          hsshow: true
        })
      }
    }
  },
  formSubmit:function(e){
   var that = this;
    this.setData({
      str: String(e.detail.value.keyword),
      course_list:[],
      top_category: 0,
      second_category:0,
      is_hot: 0,
      age_id: 0,
      district_id:0,
      sort: 1
    })
    console.log(that.data.str);
    this.getdata();
  },
  getdata:function(){
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_course_list',
      method: 'post',
      data: {
        page_size: that.data.page_size,
        page: that.data.page,
        top_category: that.data.top_category,
        second_category: that.data.second_category,
        is_hot: that.data.is_hot,
        age_id: that.data.age_id,
        district_id: that.data.district_id,
        str: that.data.str,
        sort: that.data.sort
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.data.total_count > 0 ) { 
            var listdata = res.data.data.course_list;
          
            var newsArr=[];
            if(that.data.page==1){
              newsArr =[];
            }else{
              newsArr = that.data.course_list;
            }
            console.log(newsArr);
            for (var i = 0; i < listdata.length; i++) {
              newsArr.push(listdata[i])
            }
          newsArr.forEach((item) => {
            item.juli = app.getDistance(app.globalData.location.latitude, app.globalData.location.longitude, item.location_y, item.location_x);
          })
            that.setData({
              course_list: newsArr,
              total_count: res.data.data.total_count
            });
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            course_list: ''
          });
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
  erjifenlie:function(a){
    var t = a.currentTarget.dataset.id;
    var that =this;
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_category_list',
      method: 'post',
      data: {
        parent_id: t
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          category_list2: res.data.data.category_list
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    if (options.top_category){
      that.setData({
        top_category: options.top_category,
        flname: options.flname
      })
    }
    if (options.is_hot){
      that.setData({
        is_hot: options.is_hot,
        kcname: options.kcname
      })
    } 
    if (options.sort){
      that.setData({
        sort: options.sort,
        xlname: options.xlname
      })
    }
    if (options.age_id) {
      that.setData({
        age_id: options.age_id
      })
    }
    if (options.district_id) {
      that.setData({
        district_id: options.district_id,
        qyname: options.qyname
      })
    }
    if (options.str) {
      that.setData({
        str: options.str
      })
    }
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
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_category_list',
      method: 'post',
      data: {
        parent_id:1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          category_list2: res.data.data.category_list
        })
      }
    })
    wx.request({
      url: app.d.hostUrl + '/api/area/get_district',
      method: 'post',
      data: {
        city_id:app.d.province_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          district_list: res.data.district
        })
      }
    })
    that.getdata();
  },
  onReachBottom: function () {
    var that = this;
    var totalpage = parseInt((parseInt(that.data.total_count) + that.data.page_size - 1) / that.data.page_size);
    var curpage = that.data.page + 1;
    console.log(totalpage);
    console.log(totalpage);
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
