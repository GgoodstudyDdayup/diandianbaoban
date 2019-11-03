const app = getApp();
Page({
  data: {
    multiIndex: [],
    category1: '课程一级分类',
    category2: '课程二级分类',
    cateid1: 0,
    cateid2: 0,
    logo: '',
    suoluotu: '',
    xianshi: [],
    organization_id: 0,
    is_audition: 1, //待开发
    csslightList: {
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: ''
    },
    age_id: [],
    age_String: ''
  },
  link: function(a) {
    let that = this
    var t = a.currentTarget.dataset.link;
    let age_id = that.data.age_id
    let list = that.data.csslightList
    if (list[`${t}`] == false) {
      list[`${t}`] = true
    } else {
      list[`${t}`] = false
    }
    that.setData({
      csslightList: list
    })
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
    console.log(e)
  },
  dels: function(a) {
    var dd = a.currentTarget.dataset.tu + ',';
    var that = this;
    var a = that.data.suoluotu + ',';
    var str1 = a.replace(dd, '');
    var show_imges = str1.substring(0, str1.length - 1);
    console.log(show_imges)
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
  radioChange(e) {
    var that = this;
    that.setData({
      is_audition: e.detail.value
    })
    console.log(that.data.is_audition);
  },
  formSubmit: function(e) {
    var that = this;
    var flag = true;
    var names = e.detail.value.names;
    var price = e.detail.value.price;
    var subtitle = e.detail.value.subtitle;
    var use_object = e.detail.value.use_object;
    var class_type_str = e.detail.value.class_type_str;
    var class_system = e.detail.value.class_system;
    var class_hour = e.detail.value.class_hour;
    var riqi = e.detail.value.riqi;
    var introduce = e.detail.value.introduce;
    let age_id = that.data.age_id
    let list = that.data.csslightList
    let string = that.data.age_String
    //多选适用对象
    for (let index in list) {
      if (list[index] == true) {
        age_id.push(index)
        let set = new Set(age_id)
        let arr = [...set].join(',')
        string = arr
        that.setData({
          age_String: string
        })
      } else {
        for (let i = 0; i <= age_id.length; i++) {
          if (age_id[i] == index) {
            age_id.splice(i, 1);
            let set = new Set(age_id)
            let arr = [...set].join(',')
            string = arr
            that.setData({
              age_String: string
            })
          }
        }
      }
    }
    if (names == '' || price == '') {
      wx.showModal({
        title: '提示',
        content: '请填写完整数据之后在提交'
      })
    } else {
      wx.request({
        url: app.d.hostUrl + '/api/miniprogram/add_course',
        method: 'post',
        data: {
          course_name: names,
          subtitle: subtitle,
          top_category: that.data.cateid1,
          second_category: that.data.cateid2,
          organization_id: that.data.organization_id,
          price: price,
          // use_object: use_object,
          class_type_str: class_type_str,
          // class_system: class_system,
          class_hour: class_hour,
          class_date: riqi,
          banner: that.data.logo,
          show_images: that.data.suoluotu,
          detail: introduce,
          age_ids: string,
          is_audition: that.data.is_audition,
          X: app.globalData.location.longitude,
          Y: app.globalData.location.latitude,
          CITYID: app.d.province_id
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(that.data.is_audition);
          console.log(names);
          console.log(that.data.cateid1);
          console.log(that.data.cateid2);
          console.log(that.data.organization_id);
          console.log(res.data.msg);
          if (res.data.code == 1) {
            wx.showToast({
              title: `${res.data.msg}`,
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            wx.showToast({
              title: `${res.data.msg}`,
            })
          }
        }
      })
    }
  },
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.setData({
      organization_id: options.id
    })
    // 一级分类
    wx.request({
      url: app.d.hostUrl + '/api/miniprogram/get_category_list',
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
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
          that.searchClassInfo(default_xiaoqu_id)　　　 // 如果存在调用获取对应的省级数据
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
          success: function(res) {
            console.log(res)
            var classList = res.data.data.category_list;
            let classArr = []
            classList.forEach(item => {
              console.log(item.name)
              classArr.push(item.name)
            })
            console.log(classArr)
            console.log(classList)
            var xiaoquArr = that.data.xiaoquArr;
            console.log(xiaoquArr)
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
    console.log(e);
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    data.multiIndex[e.detail.column] = e.detail.value;
    var pid_session = this.data.pid;　　　　
    switch (e.detail.column) {
      case 0:
        var xiaoquList = this.data.xiaoquList;
        var pid = xiaoquList[e.detail.value]['id'];
        if (pid_session != pid) {　　　　
          this.searchClassInfo(pid);
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindMultiPickerChange: function(e) {
    var that = this;
    var xiaoquList = this.data.xiaoquList;
    var classList = this.data.classList;
    var select_key = e.detail.value[1];　　
    console.log(xiaoquList, classList)
    that.setData({
      multiIndex: e.detail.value,
      category1: xiaoquList[that.data.multiIndex[0]]['name'],
      category2: classList[select_key]['name'],
      cateid1: classList[select_key]['parent_id'],
      cateid2: classList[select_key]['id']
    })
    console.log(that.data.cateid1);
  },
  changeAvatar: function(e) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
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
            "Content-Type": "multipart/form-data" //记得设置
          },
          formData: {
            'organization_id': e.currentTarget.dataset.id
          },
          success: function(res) {
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
  changesuoluotu: function(e) {
    var that = this;
    var organization_id = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var length = res.tempFilePaths.length; //总数
        var tupian = '';
        var j = 0;
        // for (var i = 0; i < length; i++) {
        wx.uploadFile({
          url: app.d.hostUrl + '/api/upload/upload_single_img',
          filePath: res.tempFilePaths[0],
          name: 'upload_file',
          formData: {
            'organization_id': organization_id
          },
          header: {
            "Content-Type": "multipart/form-data" //记得设置
          },
          success: function(res) {

            var pic = JSON.parse(res.data);
            console.log(pic)
            // if (pic.code == 1) {
            //   j++;
            //   wx.showToast({
            //     title: '正在上传第' + j + '张图片',
            //     icon: 'sucess',
            //     mask: true,
            //     duration: 5000
            //   })
            //   tupian = tupian + ',' + app.d.hostUrl + pic.single_file_path;
            // }
            // if (j == length) {
            //   if (that.data.suoluotu) {
            //     var bb = that.data.suoluotu + ',';
            //   } else {
            //     var bb = '';
            //   }
            //   var aa = bb + tupian.substring(1, tupian.length);
            that.setData({
              // suoluotu: aa,
              suoluotu: app.d.hostUrl + '/' + pic.single_file_path,
              // xianshi: aa.split(',')
            })
            wx.hideToast();
          }
          // }
        })
        // }
        console.log(tupian);
      }
    })
  },



})