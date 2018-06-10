
import { ParseText, UploadImage, GetDiary, DeleteDiary, GetUserAuthorize, getWeather, HideShareMenu, GetCurrentTime, Copy } from "../../common/util.js";
import { TryCacheData} from '../../common/cache.js'

const app = getApp()
const globalData = getApp().globalData
Page({
  data: {
     windowHeight: app.globalData.windowHeight,

    //時間軸
    today: GetCurrentTime(),
    diaryData: [],
    scrollHeight: 0, //scroll-top的值，控制滚动到底部
    currentSearchDiaryDataId: 'diaryDate0', //竖向定位到到哪一天，该值是子元素id
    currentSerarchTextDiaryId: 'textCard0-0',//横向定位到哪个文本日记
    currentSerarchImageDiaryId: 'imageCard0-0',//横向定位到哪个图片日记
    currentDisplayDiaryType: 'allTypes',      //显示哪种日记
    //日记区
    currentDiaryDataIndex: -1,  //标记是由哪组日记触发长按动作
    currentTextDiaryIndex: -1,  //标记是由哪个文本日记触发长按动作
    currentImageDiaryIndex: -1, //标记是由哪个图片日记触发长按动作
    searchKeywords: '', //需要搜索的关键字
    searchIndexArray: [], //保存匹配的字符串的下标
    isChangeSearchKeywords: false, //关键字是否改变
    keywordsArraryIndex: 0, //搜索到匹配关键字的数组的下标
    currentChoseDiaryTop: 0,
    //導航抽屜
    isShowMask: false,
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
    btnSettingOpenType: '', //设置按钮的open-type
    //按钮涟漪
    waveEffectsOnImageButton: "",
    waveEffectsOnTextButton: "",
  },

  /**
   * 生命週期函數
   */
  onReady() {
    HideShareMenu()
  },

  onLoad(options) {
    GetUserAuthorize('scope.userLocation', '位置', '位置权限用于什么？获取天气、城市信息')
    setTimeout(
      function () {
        console.log(app.globalData.userCurrentCityLongitude + "," + app.globalData.userCurrentCityLatitude)
        getWeather(app.globalData.userCurrentCityLongitude + "," + app.globalData.userCurrentCityLatitude)
      }, 2000
    )
  },

  onShow() {
    this.displayDiary()
  },
  onUnload() {

  },

  //導航抽屜
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
      animationData: animation.export(),
      isShowMask: true,
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
      animationData: animation.export(),
      isShowMask: false,
    });
  },

  toImageDiary: function () {

    wx.navigateTo({
      url: '../imageDiary/imageDiary',
    })
  },

  // 上傳圖片
  chooseImageTap(e) {
    this.initCurrentDiaryIndex()
    this.setData({
      waveEffectsOnImageButton: "waves-effect-animation",
    })
    var that = this;
    setTimeout(
      function () {
        wx.showActionSheet({
          itemList: ['本地上传', '拍照上传'],
          success: (res) => {
            if (!res.cancel) {
              if (res.tapIndex == 0) {
                that.doUpload('album')
              } else if (res.tapIndex == 1) {
                that.doUpload('camera')
              }
            }
          }
        })
      }, 200
    )
    setTimeout(
      function () {
        that.setData({
          waveEffectsOnImageButton: "",
        })
      }, 1000
    )
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
        let originalImageWidth = 0;
        let originalImageHeight = 0;
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: (res) => {
            imgUrl = tempFilePaths[0];
            originalImageWidth = res.width;
            originalImageHeight = res.height;
            if (res.height > res.width) {
              var width = res.width * (0.9 * 0.7 * app.globalData.windowHeight) / res.height;
              if (width > app.globalData.windowWidth) {
                uploadedImageWidth = app.globalData.windowWidth;
                uploadedImageHeight = res.height * app.globalData.windowWidth / res.width;
              } else {
                uploadedImageWidth = width;
                uploadedImageHeight = 0.9 * 0.7 * app.globalData.windowHeight;
              }
            } else if (res.height == res.width) {
              uploadedImageWidth = app.globalData.windowWidth;
              uploadedImageHeight = app.globalData.windowWidth;
            }
            else {
              res.height *= app.globalData.windowWidth / res.width;
              uploadedImageWidth = app.globalData.windowWidth;
              uploadedImageHeight = res.height;
            }
          },
          fail: function (res) { },
          complete: function (res) {
            wx.navigateTo({
              url: '../imageDiary/imageDiary?imgUrl=' + imgUrl + '&imageWidth=' + uploadedImageWidth + '&imageHeight=' + uploadedImageHeight + '&originalImageWidth=' + originalImageWidth + '&originalImageHeight=' + originalImageHeight
            });
          }
        })
      }
    })
  },

  //显示日记的数据
  displayDiary() {
    setTimeout(() => { 
      GetDiary()
        .then((res) => {
          TryCacheData(res.diary)
          .then(()=>{
            setTimeout(()=>{
              this.setData({
                btnSettingOpenType: 'getUserInfo',
                diaryData: res.diary,
              })
            },500)
          })
          .catch((err)=>{
            console.log(err)
          })
        })
      .catch((err) => {
        console.log(err)
        // app.relogin(() => {
        //   this.displayDiary()
        // })
      })
    }, 1000)
  },

  //文本日记跳转监听事件
  onToTextDiaryPageTap(e) {
    this.initCurrentDiaryIndex()
    this.setData({
      waveEffectsOnTextButton: "waves-effect-animation",
    })
    var that = this;
    setTimeout(
      function () {
        wx.navigateTo({
          url: '../textDiary/textDiary',
        })
      }, 200);
    setTimeout(
      function () {
        that.setData({
          waveEffectsOnTextButton: "",
        })
      }, 1000
    )
  },

  /**
     * 6/1/2018 by yjj
     * 点击文本预览
     */
  previewTextDiary(e) {
    this.textCard = this.selectComponent("#" + e.currentTarget.id) //将某个textDiary绑定textCard
    this.textCard.previewTextDiary()
  },

  /**
   * 5/27/2018 by yjj
   * 点击图片预览
   */
  previewImageDiary(e) {
    this.imageCard = this.selectComponent("#" + e.currentTarget.id) //将某个imageDiary绑定textCard
    this.imageCard.previewImageDiary()
  },

  /**
   * 6/1/2018 by yjj
   * 显示textDiary编辑菜单
   */
  showTextDiaryEditMenu(e) {
    var that = this
    var query = wx.createSelectorQuery().in(this)
    query.select('#' + e.currentTarget.id).boundingClientRect(function (res) {
      that.setData({
        currentChoseDiaryTop: res.top,// 这个组件内节点的上边界坐标
        currentDiaryDataIndex: e.currentTarget.dataset.diarydataindex,
        currentTextDiaryIndex: e.currentTarget.dataset.textdiaryindex,
      })
      console.log("currentEditMenuTop: " + that.data.currentChoseDiaryTop)
    }).exec()
  },

  /**
   * 6/4/2018 by yjj
   * 点击编辑按钮跳转到textDiary
   */
  toTextDiary(e) {
    this.initCurrentDiaryIndex()
    this.textCard = this.selectComponent("#" + e.currentTarget.dataset.textdiaryid) //将某个textDiary绑定textCard
    this.textCard.toTextDiary()
  },

  /**
   * 5/30/2018 by yjj
   * 显示imageDiary编辑菜单
   */
  showImageDiaryEditMenu(e) {
    var that = this
    var query = wx.createSelectorQuery().in(this)
    query.select('#' + e.currentTarget.id).boundingClientRect(function (res) {
      that.setData({
        currentChoseDiaryTop: res.height + res.top, // 这个组件内 #the-id 节点的上边界和高度坐标
        currentDiaryDataIndex: e.currentTarget.dataset.diarydataindex,
        currentImageDiaryIndex: e.currentTarget.dataset.imagediaryindex,
      })
      console.log("currentEditMenuTop: " + that.data.currentChoseDiaryTop)
    }).exec()
  },

  /**
   * 5/30/2018 by yjj
   * 点击空白处隐藏编辑菜单
   */
  click_block() {
    this.initCurrentDiaryIndex()
  },

  /**
   * 5/28/2018 by yjj
   * 删除日记
   */
  deleteDiary(e) {
    var that = this;
    this.initCurrentDiaryIndex()
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          DeleteDiary(e.currentTarget.dataset.diaryid).then((res) => {
            that.displayDiary()
          }).catch((res) => { })
        } else if (res.cancel) {
          return false
        }
      },
      complete: function (res) {
        that.setData({
          isShowTools: !that.data.isShowTools,
        }),
          that.displayDiary()
      }
    })
  },

  /**
   * 5/28/2018 by yjj
   * 分享
   */
  onShareAppMessage(options) {
    var that = this;
    this.initCurrentDiaryIndex()
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
      fail(res) {
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
    console.log('options.target.id: ' + options.target.id)
    if (options.from == 'button') {
      switch (options.target.id) {
        //根据share-button的id区分是分享图片日记还是文本日记
        case 'btnShareTextDiary':
          shareObj.path = '/pages/textDiaryShared/textDiaryShared?id=' + options.target.dataset.textdiaryid
          break
        default:
          let imgName = options.target.dataset.imageurl.split('=')
          let imgId = imgName[1].split('&')
          shareObj.path = '/pages/shareDiary/shareDiary?name=' + imgId[0] + '&secondData=' + imgId[1] + "&type=imageDiary"
          break
      }
    }
    // 返回shareObj
    return shareObj;
  },

  /**
   * 5/31/2018 by yjj
   * 改变日记显示的类别
   */
  changeDiaryDisplayType() {
    var that = this
    this.initCurrentDiaryIndex()
    switch (this.data.currentDisplayDiaryType) {
      case 'allTypes':
        wx.showToast({
          title: '只显示图片路迹',
          icon: 'none',
          duration: 1000,
        })
        that.setData({
          currentDisplayDiaryType: 'imageDiary'
        })
        break
      case 'imageDiary':
        wx.showToast({
          title: '只显示文字路迹',
          icon: 'none',
          duration: 1000,
        })
        that.setData({
          currentDisplayDiaryType: 'textDiary'
        })
        break
      default:
        wx.showToast({
          title: '显示图片文字路迹',
          icon: 'none',
          duration: 1000,
        })
        that.setData({
          currentDisplayDiaryType: 'allTypes'
        })
    }
  },

  /**
   * 6/1/2018 by yjj
   * 初始化diary当前下标
   */
  initCurrentDiaryIndex() {
    this.setData({
      currentDiaryDataIndex: -1,
      currentTextDiaryIndex: -1,
      currentImageDiaryIndex: -1,
    })
  },

  /**
   * 6/1/2018 by yjj
   * 定位到‘今天’/滑动到底部
   */
  locateToToday() {
    this.initCurrentDiaryIndex()
    this.setData({
      scrollHeight: 2000 //scroll-top大于显示的内容高度即可滑动到底部
    })
  },

  /**
   * 6/2/2018 by yjj
   * input获得焦点
   */
  inputOnFocus(e) {
    this.initCurrentDiaryIndex()
  },

  /**
   * 6/2/2018 by yjj
   * input保留输入的值
   */
  changeSearchKeywords(e) { },

  /**
   * 6/2/2018 by yjj
   * 搜索关键字并定位+高亮
   */
  searchKeywordsInThisPage(e) {
    var that = this
    var i = 0, diaryDataLen = 0, j = -1, k = -1, textDiaryLen = 0, imageDiaryLen = 0
    let imageText = ''
    let title = ''
    let text = ''
    if (this.data.searchKeywords != e.detail.value) {
      that.setData({
        searchKeywords: e.detail.value,
        isChangeSearchKeywords: true,
        searchIndexArray: [],
        keywordsArraryIndex: 0,
      })
    } else {
      that.setData({
        isChangeSearchKeywords: false,
      })
    }
    let keyword = this.data.searchKeywords
    //关键字改变执行if语句，重新遍历
    if (this.data.isChangeSearchKeywords) {
      for (i = 0, diaryDataLen = that.data.diaryData.length; i < diaryDataLen; i++) {
        //textDiary不为空时继续遍历
        if (that.data.diaryData[i].diary.text.length != 0) {
          for (j = 0, textDiaryLen = that.data.diaryData[i].diary.text.length; j < textDiaryLen; j++) {
            title = that.data.diaryData[i].diary.text[j].main.title  //标题
            text = that.data.diaryData[i].diary.text[j].main.text//正文
            if ((title.indexOf(keyword) != -1) || (text.indexOf(keyword) != -1)) {
              that.data.searchIndexArray.push({ i, j, k })
            }
          }
        }
        //imageDiary不为空时继续遍历
        if ((that.data.diaryData[i].diary.image.length) != 0) {
          j = -1
          for (k = 0, imageDiaryLen = that.data.diaryData[i].diary.image.length; k < imageDiaryLen; k++) {
            imageText = that.data.diaryData[i].diary.image[k].text
            if (imageText.indexOf(keyword) != -1) {
              that.data.searchIndexArray.push({ i, j, k })
            }
          }
        }
      }
    }
    //数组下标到数组长度时重置
    if (this.data.keywordsArraryIndex == this.data.searchIndexArray.length) {
      this.setData({
        keywordsArraryIndex: 0
      })
    }
    //捕捉没找到的异常
    try {
      // if ((that.data.searchIndexArray[that.data.keywordsArraryIndex].j) == -1) {
      //本来想通过scroll-into-view进行定位的,但是失效，暂时没找到原因
      // that.setData({
      //   currentSearchDiaryDataId: "diaryDate" + that.data.searchIndexArray[that.data.keywordsArraryIndex].i,
      //   currentSerarchTextDiaryId: "textCard" + that.data.searchIndexArray[that.data.keywordsArraryIndex].i + "-" + that.data.searchIndexArray[that.data.keywordsArraryIndex].k,
      //   currentSerarchImageDiaryId: "imageCard" + that.data.searchIndexArray[that.data.keywordsArraryIndex].i + "-" + 0,
      //   keywordsArraryIndex: that.data.keywordsArraryIndex + 1,
      // })
      this.setData({
        scrollHeight: that.data.searchIndexArray[that.data.keywordsArraryIndex].i * 150,
        keywordsArraryIndex: that.data.keywordsArraryIndex + 1,
      })
      // }
    } catch (e) {
      wx.showToast({
        title: '对不起,没有搜索到该关键字的相关日记！',
        icon: 'none'
      })
    }
  },

  //handle event "scrolltoupper"
  upper() { },
  //handle event "scrolltolower"
  lower() { },
  //handle event "scroll"
  scroll() { },

  //获取用户信息
  getuserinfo(e) {
    this.setData({
      btnSettingOpenType: 'openSetting',
    })
    console.log(e.detail.userInfo)
  },

})
