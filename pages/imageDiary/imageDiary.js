// page/imageDiary/imageDiary.js
import {ParseText, UploadImage} from 'api.js'


let app = getApp()

Page({
  data: {
    /**
     *  彈窗頁
     */
    showModalStatus: true,
    keyboardHeight: 0,

    inputLength: '0',
	  inputValue: 'a',
    inputCursor: 0,
    showDictumFisrt: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    showDictumSecond: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    showDictumThird: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    showStyleFisrt: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    showStyleSecond: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    showStyleThird: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    dataDictumFirst: ['名言', '例子', '矩阵', '水果', '蔬菜', '上衣'],//下拉列表的数据
    dataDictumSecond: ['真的', '开心', '失望', '烦闹', '生气', '伤心'],//下拉列表的数据
    dataDictumThird: ['有趣', '不', '是', '开心', '烦闹', '伤心'],//下拉列表的数据
    dataStyleFirst: ['名言', '例子', '矩阵', '水果', '蔬菜', '上衣'],//下拉列表的数据
    dataStyleSecond: ['真的', '开心', '失望', '烦闹', '生气', '伤心'],//下拉列表的数据
    dataStyleThird: ['有趣', '不', '是', '开心', '烦闹', '伤心'],//下拉列表的数据
    indexDictumFirst: 0,//选择的下拉列表下标
    indexDictumSecond: 0,//选择的下拉列表下标
    indexDictumThird: 0,//选择的下拉列表下标
    indexStyleFirst: 0,//选择的下拉列表下标
    indexStyleSecond: 0,//选择的下拉列表下标
    indexStyleThird: 0,//选择的下拉列表下标

    items: [
      { name: 'Weather', value: '天气' },
      { name: 'TimeAndSpace', value: '时空' },
      { name: 'Mood', value: '心情滤镜' },

    ],

    zIndex: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 触发 input 编辑事件
   */
  textareaOnInputEvent: function (e) {
    this.setData({
      inputLength: e.detail.value.length,
      inputCursor: e.detail.cursor,
    })
  },
/**
 * textarea獲得焦點處理函數
 */

  textareaOnFocusEvent: function(e){
    var keyboardHeight = e.detail.height;
    //建立動畫：拉起鍵盤，彈窗向上偏移
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    this.animation = animation;
    animation.translateY(-1 * keyboardHeight * app.globalData.pixelRatio).step();
    this.setData({
      keyboardHeight: keyboardHeight,
      animationData: animation.export()
    });
    wx.showToast({
      title: 'focus',
    })
  },
  /**
   * textarea失去焦点处理函数
   */
  textareaOnBlurEvent: function(e){
    var value = e.detail.value;
    parseInputValue(value);
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    this.animation = animation;
    animation.translateY(this.data.keyboardHeight * app.globalData.pixelRatio).step();
    this.setData({
      inputValue: value,
      animationData: animation.export(),
    });
    wx.showToast({
      title: 'blur',
    })
  },
//调用api处理输入文字 
  parseInputValue: function(value){
    ParseText(value)
    .then((res)=>{
      console.log(res)
    })
    .catch((e)=>{
      console.log(e + "token expired");
      app.relogin();
    })
  },
  //？？cm: 这里干嘛的
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  // 打开dictum下拉显示框
  selectDictum(e) {

    let id = e.currentTarget.id;
    this.setData({
      zIndex: -1
    });
    switch (id) {
      case "dictumFirst":
        this.setData({
          showDictumFirst: !this.data.showDictumFirst
        });
        break;
      case "dictumSecond":
        this.setData({
          showDictumSecond: !this.data.showDictumSecond
        });
        break;
      case "dictumThird":
        this.setData({
          showDictumThird: !this.data.showDictumThird
        });
        break;
      default:
        console.log("该id不存在！");
    }
  },
  // 点击dictum下拉列表
  optionDictum(e) {
    let target = e.currentTarget;
    let id = target.id;
    console.log(id);
    let index = target.dataset.index;//获取点击的下拉列表的下标
    switch (id) {
      case "selectDictumFirst":
        this.setData({
          indexDictumFirst: index,
          showDictumFirst: !this.data.showDictumFirst,
        });
        break;
      case "selectDictumSecond":
        this.setData({
          indexDictumSecond: index,
          showDictumSecond: !this.data.showDictumSecond,
        });
        break;
      case "selectDictumThird":
        this.setData({
          indexDictumThird: index,
          showDictumThird: !this.data.showDictumThird,
        });
        break;
      default:
        console.log("该id不存在!！");
    }
    this.setData({
      zIndex: 0
    });
  },
  // 打开style下拉显示框
  selectStyle(e) {
    
    let id = e.currentTarget.id;
    this.setData({
      zIndex: -1
    });
    switch (id) {
      case "styleFirst":
        this.setData({
          showStyleFirst: !this.data.showStyleFirst
        });
        break;
      case "styleSecond":
        this.setData({
          showStyleSecond: !this.data.showStyleSecond
        });
        break;
      case "styleThird":
        this.setData({
          showStyleThird: !this.data.showStyleThird
        });
        break;
      default:
        console.log("该id不存在！");
    }
  },
  /**
   * 上传图片
   */
  uploadImage(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=> {
        let tempFilePaths = res.tempFilePaths
        this.setData({
          imageSrc: tempFilePaths[0]
        })
        UploadImage(tempFilePaths[0])
        .then((res)=>{
            console.log("upload images completed: "+res)
        })
        .catch((e)=>{
            console.log("upload images fail:"+ e)
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击style下拉列表
  optionStyle(e) {
    let target = e.currentTarget;
    let id = target.id;
    let index = target.dataset.index;//获取点击的下拉列表的下标
    switch (id) {
      case "selectStyleFirst":
        this.setData({
          indexStyleFirst: index,
          showStyleFirst: !this.data.showStyleFirst,
        });
        break;
      case "selectStyleSecond":
        this.setData({
          indexStyleSecond: index,
          showStyleSecond: !this.data.showStyleSecond,
        });
        break;
      case "selectStyleThird":
        this.setData({
          indexStyleThird: index,
          showStyleThird: !this.data.showStyleThird,
        });
        break;
      default:
        console.log("该id不存在!！");
    }
    this.setData({
      zIndex: 0
    });
  },

  // 上傳圖片
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['本地上传', '拍照上传'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.doUpload('album')
          } else if (res.tapIndex == 1) {
            that.doUpload('camera')
          }
        }
      }
    })
  },
  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showLoading({
          title: '正在上传',
        })
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: '111.230.24.245',
          filePath: filePath,
          name: 'file',

          success: function (res) {
           wx.showToast({
             title: '上传成功',
             icon: 'success',
             duration: 2000,
           }),

           wx.hideLoading(),
           
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function (e) {
            wx.showToast({
              title: '上传失败',
              icon: 'fail',
              duration: 2000,
            })
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },


  /**
   * 彈窗頁
   */
  data: {
    showModalStatus: false
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})