import { ParseText, UploadImage, getDiary } from "../../common/util.js";

const app = getApp()

Page({
  data: {
    shareImageURL: '', //要分享的图片
    deleteImageDIaryId: '', //要删除的图片日记的id
    isShowTools: false, //是否显示图片工具菜单
    //時間軸
    diaryData: {},
    //導航抽屜
    userInfo: {},
    check: false,   //是否触发滑动操作
    state: 0,    //0:初始状态 1:菜单弹出中状态 2:菜单弹入状态中 3:菜单弹出状态
    firstTouchX: 0,  //首次触摸X坐标值
    touchCheckX: 40,  //触发滑动的触摸X
    moveX: 0,   // 滑动操作横向的移动距离
    maxMoveX: wx.getSystemInfoSync().windowWidth - 120, //抽屉菜单最大移动距离
    lastTranlateX: 0,  //上次动画效果的平移距离，用于校准left值
    startTime: 0,
    endTime: 0,
  },

  /**
   * 生命週期函數
   */
  onReady() {
  },

  onLoad(options) {

  },
  onShow() {
    this.displayDiary()
  },
  onUnload() {

  },

  //導航抽屜
  onMainPageTouchstart: function (e) {
    var data = this.data;
    var clientX = e.touches[0].clientX;
    data.startTime = e.timeStamp;
    //初识状态
    if (data.state === 0) {
      if (clientX <= data.touchCheckX) {
        data.check = true;
        data.state = 1;
        data.firstTouchX = clientX;
      }
    }
    //菜单弹出状态
    else if (data.state === 3) {
      if (clientX >= 0) {
        data.check = true;
        data.state = 2;
        data.firstTouchX = clientX;
      }
    }
  },
  onMainPageTouchmove: function (e) {
    var data = this.data;
    var pixelRatio = wx.getSystemInfoSync().pixelRatio;
    if (data.check) {
      var mainPageLeft = 0, drawerMenuLeft = 0;
      var moveX = e.touches[0].clientX - data.firstTouchX;
      if (data.state === 1) {
        //处理边界状态
        if (moveX < 0) {
          moveX = 0;
        }
        if (moveX > data.maxMoveX) {
          moveX = data.maxMoveX;
        }
        if (moveX >= 0 && moveX <= data.maxMoveX) {
          data.moveX = moveX;
          moveX = moveX - data.lastTranlateX;
          //px转为rpx
          moveX = moveX * pixelRatio;
          mainPageLeft = moveX;
          drawerMenuLeft = -580 + moveX;
        }
      }
      else if (data.state === 2) {
        //处理边界状态
        if (moveX > 0) {
          moveX = 0;
        }
        if (moveX < -data.maxMoveX) {
          moveX = -data.maxMoveX;
        }
        if (moveX <= 0 && moveX >= -data.maxMoveX) {
          data.moveX = moveX;
          moveX = moveX - data.lastTranlateX;
          //px转为rpx
          moveX = moveX * pixelRatio;
          var maxMoveX = data.maxMoveX * pixelRatio;
          mainPageLeft = maxMoveX + moveX;
          drawerMenuLeft = maxMoveX - 580 + moveX;
        }
      }
      this.setData({
        mainPageLeft: mainPageLeft,
        drawerMenuLeft: drawerMenuLeft
      });
    }
  },
  onMainPageTouchend: function (e) {
    var data = this.data;
    if (!data.check) {
      return;
    }
    data.endTime = e.timeStamp;
    data.check = false;
    data.firstTouchX = 0;
    var moveX = data.moveX;
    data.moveX = 0;
    var animation = wx.createAnimation({
      duration: 250,
      timingFunction: 'ease'
    });
    var translateX = 0;
    var mainPageLeft = 0;
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    if (data.state === 1) {
      if (moveX === 0 || moveX === data.maxMoveX) {
        data.state = (moveX === 0) ? 0 : 3;
        return;
      }
      mainPageLeft = moveX;
      //滑动距离是否超过窗口宽度一半
      if (mainPageLeft > (windowWidth / 3) || data.endTime - data.startTime < 200) {
        translateX = data.maxMoveX - moveX;
        data.state = 3;
      }
      else {
        translateX = -moveX;
        data.state = 0;
      }
    }
    else if (data.state === 2) {
      if (moveX === 0 || moveX === -data.maxMoveX) {
        data.state = (moveX === 0) ? 3 : 0;
        return;
      }
      //滑动距离是否超过窗口宽度一半
      mainPageLeft = data.maxMoveX + moveX
      if (mainPageLeft > (windowWidth / 3)) {
        translateX = -moveX;
        data.state = 3;
      }
      else {
        translateX = -mainPageLeft;
        data.state = 0;
      }
    }
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },
  onMainPageTap: function (e) {
    var data = this.data;
    if (data.state !== 3) {
      return;
    }
    data.state = 0;
    var translateX = -data.maxMoveX;
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    var animation = wx.createAnimation({ duration: 100 });
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },

  onPortraitTap: function (e) {
    var data = this.data;
    if (data.state !== 0) {
      return;
    }
    var data = this.data;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    var translateX = data.maxMoveX;
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    data.state = 3;
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },

  onMainPageTap: function (e) {
    var data = this.data;
    if (data.state !== 3) {
      return;
    }
    data.state = 0;
    var translateX = -data.maxMoveX;
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    var animation = wx.createAnimation({ duration: 100 });
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },

  toImageDiary: function () {

    wx.navigateTo({
      // url: '../imageDiary/imageDiary',
    })
  },

  // 上傳圖片
  chooseImageTap() {
    wx.showActionSheet({
      itemList: ['本地上传', '拍照上传'],
      success: (res) => {
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
  doUpload(choose) {
    // 选择图片
    var that = this;
    let srcType = [];
    if (choose === "album") {
      srcType.push("album");
    } else {
      srcType.push("camera");
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: srcType,
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        let imgUrl = ' ';
        let uploadedImageWidth = 0;
        let uploadedImageHeight = 0;
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: (res) => {
            imgUrl = tempFilePaths[0];
            if (res.height > res.width) {
              res.width *= (0.9 * 0.8 * wx.getSystemInfoSync().windowHeight) / res.height;
              uploadedImageWidth = res.width;
              uploadedImageHeight = 0.9 * 0.8 * wx.getSystemInfoSync().windowHeight;
            } else if (res.height == res.width) {
              uploadedImageWidth = wx.getSystemInfoSync().windowWidth;
              uploadedImageHeight = wx.getSystemInfoSync().windowWidth;
            }
            else {
              res.height *= wx.getSystemInfoSync().windowWidth / res.width;
              uploadedImageWidth = wx.getSystemInfoSync().windowWidth;
              uploadedImageHeight = res.height;
            }
          },
          //   UploadImage(tempFilePaths[0])
          //     .then((res) => {
          //       wx.hideLoading();
          //       wx.showToast({
          //         title: '上传成功',
          //         icon: 'success',
          //         duration: 2000,
          //       })
          //       console.log("upload images completed: " + res.imgUrl)
          //     })
          //     .catch((e) => {
          //       wx.hideLoading()
          //       wx.showToast({
          //         title: '上传失败: ' + e,
          //         icon: 'fail',
          //         duration: 2000,
          //       })
          //       console.log("upload images fail:" + e)
          //     })
          // },
          fail: function (res) { },
          complete: function (res) {
            // wx.setStorageSync('imgUrl', imgUrl);
            // wx.setStorageSync('uploadedImageWidth', uploadedImageWidth);
            // wx.setStorageSync('uploadedImageHeight', uploadedImageHeight);
            //获取图片base64编码
            // let reader = new FileReader();
            // let base64 = "";
            // reader.readAsArrayBuffer(new Blob(imgUrl));
            // reader.onload = function (e) {
            //   let arrayBuffer = reader.result;
            //   base64 = wx.arrayBufferToBase64(arrayBuffer)
            //   console.log(base64)
            // }
            //发起api滤镜
            // wx.request({
            //   url: 'https://api.ai.qq.com/fcgi-bin/vision/vision_imgfilter',
            //   data:{
            //     "app_id": 1106918284,
            //     "time_stamp": 2,
            //     "noce_str": "sadsadefadsfas",
            //      "sign": "",
            //      "filter": 1,
            //      "iamge": ,
            //   },
            // header:{
            //   "content-type": "aplication/json"
            // },
            // success:(res)=>{
            //   console.log(res.data)
            // }
            // })
            wx.navigateTo({
              url: '../imageDiary/imageDiary?imgInfo=' + [imgUrl, uploadedImageWidth, uploadedImageHeight],
            });

          }
        })
      }
    })
  },

  //显示日记的数据
  displayDiary() {
    getDiary()
      .then((res) => {
        this.setData({
          diaryData: res.diary,
        })
      })
      .catch(() => {
        app.relogin(() => {
          this.displayDiary()
        })
      })
  },

  //文本日记跳转监听事件
  onToTextDiaryPageTap() {
    wx.navigateTo({
      url: '../textDiary/textDiary',
    })
  },

  /**
   * 5/27/2018 by yjj
   * 点击图片预览
   */
  previewImage(e) {
    this.imageCard = this.selectComponent("#" + e.currentTarget.id);
    this.imageCard.previewImage();
  },

  /**
   * 5/30/2018 by yjj
   * 显示image编辑菜单
   */
  showImageEditTools(e){
    this.setData({
      shareImageURL: e.currentTarget.dataset.imageurl,
      deleteImageDIaryId: e.currentTarget.dataset.index,
      isShowTools: !this.data.isShowTools,
    })
  },

  /**
   * 5/30/2018 by yjj
   * 点击空白处隐藏编辑菜单
   */
  click_block(){
    this.setData({
      shareImageURL: '',
      isShowTools: !this.data.isShowTools,
    })
  },

  /**
   * 5/28/2018 by yjj
   * 删除图片
   */
  deleteImage(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.api.deleteImageDiary,
            data:{
              'id': that.data.deleteImageDiaryId,
            },
            method: 'POST',
          })
          console.log('点击确定了');
          that.displayDiary()
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

  /**
   * 5/28/2018 by yjj
   * 分享
   */
  onShareAppMessage(options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "这是我的日记",        // 默认是小程序的名称(可以写slogan等)
      // path: '',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success(res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail() {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete() {
        // 转发结束之后的回调（转发成不成功都会执行）
      },
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      console.log("that.data.shareImageURL: " + that.data.shareImageURL)
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/previewDiary/previewDiary?imgUrl=' + that.data.shareImageURL 
    }
    // 返回shareObj
    return shareObj;
  },
})
