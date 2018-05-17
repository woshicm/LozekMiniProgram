// page/imageDiary/imageDiary.js
import {ParseText, UploadImage} from 'api.js'


let app = getApp()

Page({
  data: {
    /**
     * imageDiary頁
     */
    items: [
      { name: 'Weather', value: '天气' },
      { name: 'TimeAndSpace', value: '时空' },
      { name: 'Mood', value: '心情滤镜' },
    ],
    zIndex: 0,
    uploadedImageHeight: 0,
    uploadedImageWidth: 0,
    /**
     *  彈窗頁
     */
    showModalStatus: true,
    showAddButton: true,
    keyboardHeight: 0,
    showEdit: false, //false显示文案,true显示名言
    inputLength: 0,
	  inputValue: '',
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
      inputCursor: e.detail.cursor,
      inputLength: e.detail.value.length,
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
    animation.translateY(-0.2 * keyboardHeight * app.globalData.pixelRatio).step();
    console.log(-1 * keyboardHeight)
    this.setData({
      keyboardHeight: keyboardHeight,
      animationData: animation.export(),
    });
    wx.showToast({
      title: 'focus',
    })
  },
  /**
   * textarea失去焦点处理函数
   */
  textareaOnBlurEvent(e){
    var value = e.detail.value;
    this.parseInputValue(value);
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    this.animation = animation;
    animation.translateY(0.2 * this.data.keyboardHeight * app.globalData.pixelRatio).step();
    this.setData({
      inputValue: value,
      animationData: animation.export(),
    });
    wx.showToast({
      title: 'blur',
    })
  },
//调用api处理输入文字 
  parseInputValue(value){
    ParseText(value)
    .then((res)=>{
      console.log(res)
    })
    .catch((e)=>{
      console.log(e + "token expired");
      app.relogin();
    })
  },

  //监测天气，时空，心情滤镜有没有选中
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
  chooseImageTap() {
    wx.showActionSheet({
      itemList: ['本地上传', '拍照上传'],
      success: (res)=> {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            this.doUpload('album')
          } else if (res.tapIndex == 1) {
            this.doUpload('camera')
          }
        }
      }
    })
  },
  
  // 上传图片接口
  doUpload() {
    // 选择图片
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: (res) => {
            if(res.height > res.width){
              res.width *= (0.95 * 0.8 * 1094) / res.height;
              that.setData({
                showAddButton: false,
                imgUrl: tempFilePaths,
                uploadedImageHeight: res.height * app.globalData.pixelRatio,
                uploadedImageWidth: res.width,
              });
            }else if(res.height == res.width){
              that.setData({
                showAddButton: false,
                imgUrl: tempFilePaths,
                uploadedImageHeight: res.height * app.globalData.pixelRatio,
                uploadedImageWidth: res.width * app.globalData.pixelRatio,
              });
            }
            else{
              res.height *= 750 / res.width;
              that.setData({
                showAddButton: false,
                imgUrl: tempFilePaths,
                uploadedImageHeight: res.height,
                uploadedImageWidth: res.width * app.globalData.pixelRatio,
              });
            }
            console.log("外面：" + that.data.uploadedImageHeight + " " + that.data.uploadedImageWidth);
          }
        });
 //       wx.showLoading({
 //         title: '正在上传',
 //       })
        UploadImage(tempFilePaths[0])
          .then((res) => {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000,
            })
            console.log("upload images completed: " + res.imgUrl)
     //       this.setData({
     //         imgUrl: res.imgUrl
    //        });
          })
          .catch((e) => {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败: ' + e,
              icon: 'fail',
              duration: 2000,
            })
            console.log("upload images fail:" + e)
          })
      },
      fail: function (res) { },
      complete: function (res) { }
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
            showModalStatus: !this.data.showModalStatus,
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: !this.data.showModalStatus,
        }
      );
    }
  }
})
