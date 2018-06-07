// page/textDiary/textDiary.js

// 导入方法统一以大写字母开头
import { GetCurrentTime, UploadImage, GetImageInfo, SaveDiary, getWeather, getWord, getLocationInfo } from "../../common/util.js";

let app = getApp()
Page({
  data: {
    //全局变量
    state: 'edit',
    textDiaryData: [],
    textDiaryId: '',
    //功能区
    snapshot: [],
    textValueGoBackQueue: [],//回退队列
    textValueGoForwardQueue: [], //前进队列
    textDiaryDataSnapArray: [],
    //标题区
    titleValue: "213123213",
    hideTitle: true,
    inputBottomLineColor: '5rpx solid #3f8ae9',
    currentTime: GetCurrentTime(),
    currentWeather: '100',
    currentLocation: '深圳',
    titleSplit: 0,
    //正文区
    textValue: "",
    isDiaryTextMaskHidden: true,
    isDiaryTextFocus: false,
    lastInputTime: 0,
    textValue_preview: '12312321312',
    //上传图片区
    addedPhoto: [],
    choseCount: 0,

  },

  //-----------------------------生命週期函數-----------------------------------------//
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    //从主页传递标题和内容
    var that = this
    if (options.type == 'reEdit') {
      wx.getStorage({
        key: 'textDiaryData',
        success: function (res) {
          that.setData({
            textDiaryId: res.data.main.id,
            titleValue: res.data.main.title,
            textValue: res.data.main.text,
            addedPhoto: res.data.main.images,
            choseCount: res.data.main.images.length,
          })
        },
        complete: function () {
          wx.removeStorage({
            key: 'textDiaryData',
            success: function (res) { },
          })
        }
      })
    }
    wx.getStorage({
      key: 'textDiaryDataSnapArray',
      success: (res) => { that.data.textDiaryDataSnapArray = res.data },
      fail: (res) => {
        wx.setStorage({
          key: 'textDiaryDataSnapArray',
          data: [],
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

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
  onShareAppMessage: function (options) {
  },

  //-----------------------------事件监听器-----------------------------------------//
  /**
   * 标题区-输入
   */
  //聚焦
  onTitleInputFocusEvent() {
    var inputBottomLineColor = '5rpx solid #3f8ae9';
    this.setData({
      inputBottomLineColor: inputBottomLineColor,
      state: "text",
    })
    console.log(this.data.state)
  },
  //失焦
  onTitleInputBlurEvent(e) {
    var inputBottomLineColor = '3rpx solid rgba(55,121,205,0.12)';
    var value = e.detail.value;
    value = value.replace(/ /g, "");
    var titleSplit = this.data.titleSplit;
    if(value.length >= 8){
      titleSplit = Math.floor(value.length * 2 / 5);
    }
    this.setData({
      inputBottomLineColor: inputBottomLineColor,
      titleValue: value,
      hideTitle: false,
      state: "edit",
      titleSplit: titleSplit,
    });
  },
  //
  onDiaryAreaNoticeTapEvent() {

  },
  /**
   * 标题区-展示
   */
  onTitleTapEvent() {
    this.setData({
      hideTitle: true,
    })
  },

  /**
   * 功能区 
   */
  onFunctionConfirmTap() {
    var text = this.data.textValue;
    if (text.length == 0) {
      wx.showToast({
        title: '阁下还什么都没写噢~',
        duration: 1000,
        icon: 'none',
      });
      return 0;
    }
    setTimeout(() => {
      text = text.replace(/ /g, "&nbsp;")
      this.setData({
        state: 'preview',
        textValue_preview: text,
      })
      console.log("functionTap: " + text)
    }, 50);
    this.save();
  },

  bindSnap() {
    var that = this
    var textDiarySnapItemList = []
    wx.getStorage({
      key: 'textDiaryDataSnapArray',
      success: (res) => { that.data.textDiaryDataSnapArray = res.data },
      fail: (res) => { },
    })
    var textDiaryDataSnapArray = that.data.textDiaryDataSnapArray
    console.log('textDiaryDataSnapArray: ' + textDiaryDataSnapArray.length)
    switch (textDiaryDataSnapArray.length) {
      case 0: textDiarySnapItemList = ['创建新快照']
        break
      case 1:
        textDiarySnapItemList = ['创建新快照', '最近第一次的快照']
        break
      case 2: textDiarySnapItemList = ['创建新快照', '最近第一次的快照', '最近第二次的快照']
        break
      case 3: textDiarySnapItemList = ['创建新快照', '最近第一次的快照', '最近第二次的快照', '最近第三次的快照']
        break
      case 4: textDiarySnapItemList = ['创建新快照', '最近第一次的快照', '最近第二次的快照', '最近第三次的快照', '最近第四次的快照']
        break
      default: textDiarySnapItemList = ['创建新快照', '最近第一次的快照', '最近第二次的快照', '最近第三次的快照', '最近第四次的快照', '最近第五次的快照']
        break
    }
    wx.showActionSheet({
      itemList: textDiarySnapItemList,
      success: (res) => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0: {
              let snapData = {
                title: that.data.titleValue,
                text: that.data.textValue,
                addedPhoto: that.data.addedPhoto,
              }
              if (textDiaryDataSnapArray.length == 5) {
                that.data.textDiaryDataSnapArray.shift()
              }
              that.data.textDiaryDataSnapArray.push(snapData)
              wx.setStorage({
                key: 'textDiaryDataSnapArray',
                data: that.data.textDiaryDataSnapArray,
              })
            }
              break
            default: that.getTextDiaryDataFromSnapArray(res.tapIndex - 1)
              break
          }
        }
      }
    })
  },

  getTextDiaryDataFromSnapArray(index) {
    let textDiaryDataSnapArray = this.data.textDiaryDataSnapArray
    this.setData({
      titleValue: textDiaryDataSnapArray[index].title,
      textValue: textDiaryDataSnapArray[index].text,
      addedPhoto: textDiaryDataSnapArray[index].addedPhoto
    })
    textDiaryDataSnapArray.splice(index, 1)
    wx.setStorage({
      key: 'textDiaryDataSnapArray',
      data: textDiaryDataSnapArray,
    })
  },

  //前进
  goForwardTextValue() {
    if (this.data.textValueGoBackQueue.length == 10) {
      this.data.textValueGoBackQueue.shift()
    }
    this.data.textValueGoBackQueue.push(this.data.textValue)
    if (this.data.textValueGoForwardQueue.length > 0) {
      this.setData({
        textValue: this.data.textValueGoForwardQueue.pop()
      })
    } else {
      wx.showToast({
        title: '不能前进了',
      })
    }
  },

  //撤销
  goBackTextValue() {
    var that = this
    if (this.data.textValueGoBackQueue.length > 0) {
      if (this.data.textValueGoForwardQueue.length == 100) {
        that.data.textValueForwardQueue.shift()
      }
      this.data.textValueGoForwardQueue.push(this.data.textValue)
      this.setData({
        textValue: this.data.textValueGoBackQueue.pop()
      })
    } else {
      wx.showToast({
        title: '回到最初的起点',
      })
    }
  },

  /**
  * 正文区-输入
  */
  onDiaryAreaFocusEvent() {
    this.setData({
      showFunctionArea: false,
      isDiaryTextMaskHidden: false,
    })
  },

  onDiaryAreaInputEvent(e) {
    var that = this
    console.log(" inputValue: " + e.detail.value + '\n')
    let nowInputTime = Date.parse(new Date())
    if ((nowInputTime - this.data.lastInputTime) >= 2500) {
      if (this.data.textValueGoBackQueue.length == 100) {
        this.data.textValueGoBackQueue.shift()
      }
      that.data.lastInputTime = nowInputTime
      that.data.textValueGoBackQueue.push(e.detail.value)
      console.log("保存: " + that.data.textValueGoBackQueue)
    }
  },

  onDiaryAreaBlurEvent(e) {
    var value = e.detail.value;
    var that = this
    var textValueGoBackQueue = this.data.textValueGoBackQueue
    if (textValueGoBackQueue.length == 100) {
      textValueGoBackQueue.shift()
    }
    if (textValueGoBackQueue[textValueGoBackQueue.length - 1] != value) {
      that.data.textValueGoBackQueue.push(value)
    }
    console.log("保存: " + that.data.textValueGoBackQueue)
    this.setData({
      textValue: value,
      isDiaryTextMaskHidden: true,
    })
  },
  //正文輸入的遮罩，確保拿到text值
  onDiaryAreaMaskTapEvent() {
    this.setData({
      isDiaryTextFocus: false,
      isDiaryTextMaskHidden: true,
    })
  },

  /**
   * 正文区-展示
   */
  onShowDiaryTapEvent(e) {
    this.setData({
      state: 'edit',
      isDiaryTextFocus: true,
    })
  },
  // 预览相片
  onPreviewPhotoTapEvent(e) {
    wx.previewImage({
      current: [],
      urls: [e.currentTarget.dataset.imageurl],
    })
  },

  /**
   * 图片上传区
   */
  onAddPhotoTap() {
    this.doUpload();
  },
  onDeletePhotoTap(e) {
    var addedPhoto = this.data.addedPhoto;
    var index = e.currentTarget.dataset.deleteIndex;
    for (var i = index; i < addedPhoto.length - 1; i++) {
      addedPhoto[i] = addedPhoto[i + 1]
    }
    addedPhoto.pop();
    this.setData({
      addedPhoto: addedPhoto,
      choseCount: this.data.choseCount - 1
    })
  },
  //-----------------------------前後交互函數-----------------------------------------//
  // 获取图片
  doUpload() {
    var that = this;
    wx.chooseImage({
      count: 5 - that.data.choseCount,
      sizeType: ['original', 'compressed'],
      sourceType: 'album',
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        var addedPhoto = that.data.addedPhoto;
        for (var i = 0; i < tempFilePaths.length; i++) {
          GetImageInfo(tempFilePaths[i])
            .then((res) => {
              addedPhoto.push(res);
            }).catch((res) => {
            })
        }
        setTimeout(
          function () {
            that.setData({
              choseCount: that.data.choseCount + tempFilePaths.length,
              addedPhoto: addedPhoto,
            })
          }, 1000
        )
      }
    })
  },
  //上传后台
  save() {
    var createdTime = GetCurrentTime();
    if (this.data.textDiaryData.length != 0)
      createdTime = this.data.textDiary.system.createdTime;
    // var textDiaryData = {
    //   main: {
    //     'type': 0,
    //     'title': this.data.titleValue,
    //     'text': this.data.textValue,
    //     'images': this.data.addedPhoto, //通過addedPhoto[i].url 獲取圖片url
    //   },
    //   extra: {
    //     snapshot: this.data.snapshot,
    //   },
    //   system: {
    //     createdTime: createdTime,
    //     lastModifiedTime: GetCurrentTime(), //數組元素{ yy, mm, dd, day_en, day_cn, hh, min, ss};
    //     weather: "",
    //   }
    // }
    let textDiaryData = {
      'type': 0,
      'title': this.data.titleValue,
      'text': this.data.textValue,
      'images': this.data.addedPhoto,
      'weather': "",
    }
    if (this.data.textDiaryId != null)
      textDiaryData.id = this.data.textDiaryId
    console.log("id: " + textDiaryData.id)
    SaveDiary(textDiaryData)
      .then((res) => {
        console.log(res)
        wx.removeStorage({
          key: 'textDiaryDataSnapArray',
          success: function (res) { },
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
})