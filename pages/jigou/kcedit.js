const app = getApp();
Page({
  data: {
    multiIndex: [],
    category1: '课程一级分类',
    category2: '课程二级分类',
    cateid1:0,
    cateid2: 0,
    logo:'',
    suoluotu:'',
    xianshi:[],
    organization_id:0,
    is_audition:0,
    detail:[],
    isradio1:false,
    isradio2:false
  },
  link: function (a) {
    var t = a.currentTarget.dataset.link;
    wx.navigateTo({
      url: t
    });
  },

  radioChange(e) {
    var that = this;
    that.setData({
      is_audition: e.detail.value
    })
    console.log(that.data.is_audition);
  },
  formSubmit: function (e) {
    var that = this;
    var flag = true;
    var names = e.detail.value.names;
    var id = that.data.detail.id;
    var price = e.detail.value.price;
    var renshu = e.detail.value.renshu;
    var shiting = e.detail.value.shiting;
    var subtitle = e.detail.value.subtitle;
    var use_object = e.detail.value.use_object;
    var class_type_str = e.detail.value.class_type_str;
    var class_system = e.detail.value.class_system;
    var class_hour = e.detail.value.class_hour;
    var riqi = e.detail.value.riqi;
    var introduce = e.detail.value.introduce;
    if (names == '' || that.data.cateid1 == 0 || that.data.is_audition == 0 || that.data.cateid2 == 0 || price =='' )     {
       wx.showModal({
         title: '提示',
         content: '请填写完整数据之后在提交'
       })
    } else {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/edit_course',
        method: 'post',
        data: {
          id:that.data.detail.id,
          course_name:names,
          subtitle: subtitle,
          top_category: that.data.cateid1,
          second_category: that.data.cateid2,
          organization_id: that.data.organization_id,
          price:price,
          use_object: use_object,
          class_type_str: class_type_str,
          class_system: class_system,
          class_hour: class_hour,
          class_date:riqi,
          banner: that.data.logo,
          show_images: that.data.suoluotu,
          detail: introduce,
          is_audition:that.data.is_audition,
          X: app.globalData.location.longitude,
          Y: app.globalData.location.latitude,
          CITYID: app.d.province_id,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(that.data.is_audition);
          console.log(names);
          console.log(that.data.cateid1);
          console.log(that.data.cateid2);
          console.log(that.data.organization_id);
          console.log(res.data.msg);
          if(res.data.code==1){
            wx.navigateTo({
              url: 'kec?id=' + that.data.organization_id
            });
          }
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.setData({
      organization_id: options.organization_id
    })
    //课程详情
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_course_detail',
      data: {
        id: options.id
      },
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          detail: res.data.data.course_model,
          cateid1: res.data.data.course_model.top_category,
          cateid2: res.data.data.course_model.second_category,
          suoluotu: res.data.data.course_model.show_images,
          logo: res.data.data.course_model.banner,
          xianshi: res.data.data.course_model.show_images.split(","),
          is_audition: res.data.data.course_model.is_audition
        })
        if (res.data.data.course_model.is_audition==1){
          that.setData({
            isradio1:true
          })
        }else{
          that.setData({
            isradio2: true
          })
        }
      }
    })
    // 一级分类
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_category_list',
      data: {
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var xiaoquList = res.data.data.category_list;
        var xiaoquArr = xiaoquList.map(item => {　　　　 // 此方法将省名称区分到一个新数组
          return item.name;
        });
        that.setData({
          multiArray: [xiaoquArr, []],
          xiaoquList,
          xiaoquArr
        })
        var default_xiaoqu_id = xiaoquList[0]['id'];　　 //获取默认的省对应的id
        if (default_xiaoqu_id) {
          that.searchClassInfo(default_xiaoqu_id)　　　// 如果存在调用获取对应的省级数据
        }
      }
    })
    wx.hideLoading();
  },
  //二级分类
  searchClassInfo(xiaoqu_id) {
    var that = this;
    if (xiaoqu_id) {
      this.setData({
        pid: xiaoqu_id
      }, () => {
        wx.request({
          url: app.d.hostUrl + '/api/miniprogram/get_category_list',
          https: '',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            "parent_id": that.data.pid
          },
          success: function (res) {

            var classList = res.data.data.category_list;
            var classArr = classList.map(item => {
              return item.name;
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
  bindMultiPickerColumnChange: function (e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    console.log(e);
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
        var pid = xiaoquList[e.detail.value]['id'];
        if (pid_session != pid) {　　　　 // 与之前保持的省id做对比，如果不一致则重新请求并赋新值
          this.searchClassInfo(pid);
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindMultiPickerChange: function (e) {
    var that = this;
    var xiaoquList = this.data.xiaoquList;
    var classList = this.data.classList;
    var select_key = e.detail.value[1];　　 
    
    that.setData({
      multiIndex: e.detail.value,
      category1: xiaoquList[that.data.multiIndex[0]]['name'],
      category2: classList[select_key]['name'],
      cateid1: classList[select_key]['parent_id'],
      cateid2: classList[select_key]['id']
    })
    console.log(that.data.cateid1);
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
          filePath: tempFilePaths[0],
          name: 'upload_file',
          header: {
            "Content-Type": "multipart/form-data"//记得设置
          },
          formData: {
            'organization_id': e.currentTarget.dataset.id
          },
          success: function (res) {
            //当调用uploadFile成功之后，再次调用后台修改的操作，这样才真正做了修改头像
              var pic = JSON.parse(res.data);
              if (pic.code == 1) {
                that.setData({
                  logo: app.d.hostUrl + '/' + pic.single_file_path
                })
                wx.hideToast();
              }
          }
        })
      }
    })
  },
  changesuoluotu: function (e) {
    var that = this;
    var organization_id = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 9,// 默认9
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var length = res.tempFilePaths.length; //总数
        var tupian = '';
        var j = 0;
        for (var i = 0; i < length; i++) {
          wx.uploadFile({
            url: app.d.hostUrl + '/api/upload/upload_single_img',
            filePath: res.tempFilePaths[i],
            name: 'upload_file',
            formData: {
              'organization_id': organization_id
            },
            header: {
              "Content-Type": "multipart/form-data"//记得设置
            },
            success: function (res) {

              var pic = JSON.parse(res.data);
              if (pic.code == 1) {
                j++;
                tupian = tupian + ',' + app.d.hostUrl + pic.single_file_path;
              }
              if (j == length) {
                if (that.data.suoluotu) {
                  var bb = that.data.suoluotu + ',';
                } else {
                  var bb = '';
                }
                var aa = bb + tupian.substring(1, tupian.length);
                that.setData({
                  suoluotu: aa,
                  xianshi: aa.split(',')
                })
              }
            }
          })
        }

        console.log(tupian);
      }
    })
  }


})