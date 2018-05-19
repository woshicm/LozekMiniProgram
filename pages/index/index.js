var app = getApp()

Page({
  data: {
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

  onLoad(options) {
    this.getDiaryData();
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
      url: '../imageDiary/imageDiary',
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
        let uploadedImageHeigth = 0;
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: (res) => {
            if (res.height > res.width) {
              res.width *= (0.95 * 0.8 * 1094) / res.height;
              imgUrl = tempFilePaths;
              uploadedImageWidth = res.width;
              uploadedImageHeigth = res.height * app.globalData.pixelRatio;
            } else if (res.height == res.width) {
              imgUrl = tempFilePaths;
              uploadedImageWidth = 750;
              uploadedImageHeigth = 750;
            }
            else {
              res.height *= 750 / res.width;
              imgUrl = tempFilePaths;
              uploadedImageWidth = res.width * app.globalData.pixelRatio;
              uploadedImageHeigth = res.height;
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
            wx.setStorageSync('imgUrl', imgUrl);
            wx.setStorageSync('uploadedImageWidth', uploadedImageWidth);
            wx.setStorageSync('uploadedImageHeigth', uploadedImageHeigth);
            wx.navigateTo({
              url: '../imageDiary/imageDiary',
            })
          }
        })
      }
    })
  },
  getDiaryData() {
    var diaryData = [
      {
        diary: {
          text: [],
          image: [{
            imageURL: '/images/image-test.jpeg',
          }],
        },
        date: [2018, 5, 1, 'Sat'],
      },
      {
        diary: {
          text: [{
            head: '今天过得很快乐',
            lookthrough: '我是这里',
          },
          {
            head: '今天过得很快乐',
            lookthrough: '我是这里',
          }],
          image: [],
        },
        date: [2018, 5, 5, 'Sat'],
      }
    ];
    this.setData({
      diaryData: diaryData,
    })
  }
})