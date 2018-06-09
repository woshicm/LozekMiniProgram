// page/textDiary/textDiary.js

// 导入方法统一以大写字母开头
import { GetCurrentTime, UploadImage, GetImageInfo, SaveDiary, getWeather, getWord, getLocationInfo } from "../../common/util.js";

let app = getApp()
Page({
  data: {
    //全局变量
    state: 'edit',
    isReEdit: false,
    textDiaryData: {},
    isShowMask: false,
    //功能区
    snapshot: [],
    textValueGoBackQueue: [],//回退队列
    textValueGoForwardQueue: [], //前进队列
    textDiaryDataSnapArray: [],
    searchValue: "",  //搜索關鍵字
    isShowDictionarySearchResult: false,
    dictionaryResult: "",
    dictionaryTop: 0,
    functionAreaData: ["Indent", "Dictionary", "Snap", "GoBackward-disabled", "GoForward-disabled", "Confirm"],
    selectedFunction: [false, false, false, false, false, false, false],
    lineCount: 1,
    //标题区
    titleValue: "",
    hideTitle: true,
    inputBottomLineColor: '5rpx solid #3f8ae9',
    currentTime: GetCurrentTime(),
    currentWeather: ['100', '晴'],
    currentLocation: '深圳',
    titleSplit: 0,
    //正文区
    textValue: "",
    isDiaryTextMaskHidden: true,
    isDiaryTextFocus: false,
    lastInputTime: 0,
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
            isReEdit: true,
            textDiaryId: res.data[0].id,
            titleValue: res.data[0].title,
            textValue: res.data[0].text,
            addedPhoto: res.data[0].imageUrl,
            choseCount: res.data[0].imageUrl.length,
            weather: res.data[0].weather,
          })
        },
        complete: function () {
          wx.removeStorage({
            key: 'textDiaryData',
            success: function (res) { },
          })
        }
      })
      return;
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
    var weather = [app.globalData.weather.cond_code, app.globalData.weather.cond_txt];
    console.log(weather);
    this.setData({
      currentWeather: weather,
    });
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
   * 全局
   */
  //全局遮罩
  onMaskTap() {
    this.setData({
      isShowMask: false,
      isShowDictionarySearchResult: false,
      state: "edit",
    })
  },

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
    if (value.length >= 8) {
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
    this.setData({
      state: "edit",
    })
  },
  /**
   * 标题区-展示
   */
  onTitleTapEvent() {
    var selectedFunction = this.data.selectedFunction;
    selectedFunction[1] = false,
      this.setData({
        hideTitle: true,
        selectedFunction: selectedFunction,
      })
  },

  /**
   * 功能区 
   */
  // 点击功能
  onFunctionTap(e) {
    var selectedFunctionIndex = e.currentTarget.dataset.selectedFunctionIndex;
    switch (selectedFunctionIndex) {
      case (0): this.functionIndent(0);
        break;
      case (1): this.functionDictionary(1);
        break;
      case (2): this.functionSnap(2);
        break;
      case (3): this.functionBackward(3);
        break;
      case (4): this.functionForward(4);
        break;
      case (5): this.functionConfirm(5);
        break;
    }
    var selectedFunction = this.data.selectedFunction;
    if (selectedFunctionIndex == 0 || selectedFunctionIndex == 1)
      selectedFunction[selectedFunctionIndex] = !selectedFunction[selectedFunctionIndex];
    else
      selectedFunction[selectedFunctionIndex] = true;
    this.setData({
      selectedFunction: selectedFunction,
    })
  },
  //缩进
  functionIndent(selectedFunctionIndex) {
    if (!this.data.selectedFunction[selectedFunctionIndex]) {
      wx.showToast({
        title: '开启自动缩进',
        icon: 'none',
      })
    }
    else
      wx.showToast({
        title: '取消自动缩进',
        icon: 'none'
      })
  },
  //字典
  functionDictionary(selectedFunctionIndex) {
    if (!this.data.selectedFunction[selectedFunctionIndex]) {
      wx.showToast({
        title: '字典已启用',
        icon: 'none',
      })
    }
  },
  //字典-輸入失焦
  onFunctionDictionaryInputBlur(e) {
    this.setData({
      searchValue: e.detail.value,
    })
  },
  //字典-搜索
  onFunctionDictionarySearchTap() {
    var data = {
      "name": "好像",
      "pinyin": "hǎo xiànɡ",
      "content": '<div style="font-size: 10pt;">有些像；仿佛：他们俩一见面就～是多年的老朋友丨静悄悄的，～屋子里没有人丨他低着头不作声，～在想什么事。<br></div>',
      "example": '<div style="font-size: 10pt;">1. 软件必须对坏数据保持高度警惕，就<b>好像</b>过境处的海关官员那样。 <br>   2. 如果不对称，界面会显得失衡，<b>好像</b>摇摇欲坠倒向一边。 <br>   3. 尽管我们一直在反复经常地使用自己个人计算机中的个人的软件，它们也<b>好像</b>不记得关于我们个人的一些事情。 <br>   4. 警告通知应该是清楚且非模态的，告知用户他们做了什么，就<b>好像</b>速度表安静地向我们报告超速。<br></div>',
      "comefrom": "",
      "jin": "宛如 彷佛 犹如 好似 如同 貌似 似乎",
      "fan": ""
    }
    this.setData({
      isShowDictionarySearchResult: true,
      isShowDictionarySearchResult: true,
      state: "text",
      dictionaryResult: data,
      isShowMask: true,
    })
    // var that = this;
    // setTimeout(function () {
    //   console.log(that.data.searchValue)
    //   if (that.data.searchValue.length == 0) {
    //     wx.showToast({
    //       title: '请输入搜寻内容',
    //       icon: 'none',
    //     })
    //     return;
    //   }
    //   getWord(that.data.searchValue)
    //     .then((res) => {
    //       console.log(res)
    //       if (res != "") {
    //         res.content = '<div style="font-size: 10pt;">' + res.content + '</div>';
    //         res.example = '<div style="font-size: 10pt;">' + res.example.replace(/、/, ". ") + '</div>';
    //         res.pinyin = res.pinyin.replace(/　/g, " ");
    //         that.setData({
    //           isShowDictionarySearchResult: true,
    //           state: "text",
    //           dictionaryResult: res,
    //           isShowMask: true,
    //         })
    //         return;
    //       } else {
    //         wx.showToast({
    //           title: '搜索无结果！',
    //           icon: 'none',
    //         })
    //         that.setData({
    //           dictionaryResult: res,
    //         })
    //         return;
    //       }
    //       console.log(res)
    //       setTimeout(function () {
    //         wx.showToast({
    //           title: '响应超时',
    //           icon: 'none',
    //         })
    //       }, 1000)
    //     });
    // }, 250)
  },
  //快照
  functionSnap(selectedFunctionIndex) {
    var that = this;
    setTimeout(
      function () {
        var selectedFunction = that.data.selectedFunction;
        selectedFunction[selectedFunctionIndex] = false;
        that.setData({
          selectedFunction: selectedFunction,
        })
      }, 200
    )
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
  //快照-取快照
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
  //撤销
  functionBackward(selectedFunctionIndex) {
    var that = this;
    setTimeout(
      function () {
        var selectedFunction = that.data.selectedFunction;
        selectedFunction[selectedFunctionIndex] = false;
        that.setData({
          selectedFunction: selectedFunction,
        })
      }, 200
    )
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
      var functionAreaData = this.data.functionAreaData;
      functionAreaData[3] = 'GoBackward-disabled'
      this.setData({
        functionAreaData: functionAreaData,
      })
    }
  },
  //前进
  functionForward(selectedFunctionIndex) {
    var that = this;
    setTimeout(
      function () {
        var selectedFunction = that.data.selectedFunction;
        selectedFunction[selectedFunctionIndex] = false;
        that.setData({
          selectedFunction: selectedFunction,
        })
      }, 200
    )
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
      var functionAreaData = this.data.functionAreaData;
      functionAreaData[4] = 'GoForward-disabled'
      this.setData({
        functionAreaData: functionAreaData,
      })
    }
  },
  //完成
  functionConfirm(selectedFunctionIndex) {
    var that = this;
    setTimeout(
      function () {
        var selectedFunction = that.data.selectedFunction;
        selectedFunction[selectedFunctionIndex] = false;
        that.setData({
          selectedFunction: selectedFunction,
        })
      }, 200
    )
    var text = this.data.textValue;
    if (text.length == 0) {
      wx.showToast({
        title: '阁下还什么都没写噢~',
        duration: 1000,
        icon: 'none',
      });
      return 0;
    }
    var selectedFunction = this.data.selectedFunction;
    selectedFunction[1] = false,
      this.setData({
      })
    setTimeout(() => {
      text = text.replace(/ /g, "&nbsp;")
      this.setData({
        state: 'preview',
        textValue_preview: text,
        selectedFunction: selectedFunction,
      })
      console.log("functionTap: " + text)
    }, 50);
    this.save();
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
    let nowInputTime = Date.parse(new Date())
    if ((nowInputTime - this.data.lastInputTime) >= 2500) {
      var functionAreaData = this.data.functionAreaData;
      functionAreaData[3] = 'GoBackward'
      this.setData({
        functionAreaData: functionAreaData,
      })
      if (this.data.textValueGoBackQueue.length == 100) {
        this.data.textValueGoBackQueue.shift()
      }
      that.data.lastInputTime = nowInputTime
      that.data.textValueGoBackQueue.push(e.detail.value)
      // console.log("保存: " + that.data.textValueGoBackQueue)
    }
    if (this.data.selectedFunction[0]) {
      this.setData({
        textValue: e.detail.value,
      })
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
    // console.log("保存: " + that.data.textValueGoBackQueue)
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
  //行数变化
  onDiaryAreaLineChangeEvent(e) {
    if(!this.data.selectedFunction[0]) return;
    if(e.detail.lineCount < this.data.lineCount) {
      this.setData({
        lineCount: e.detail.lineCount,
      })
      return;
    }
    if (this.data.textValue.indexOf('\n') != -1) {
      this.setData({
        textValue: this.data.textValue + "         ",
        lineCount: e.detail.lineCount,
      })
    }
    console.log(this.data.lineCount)
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
    let textDiaryData = {
      'type': 0,
      'title': this.data.titleValue,
      'text': this.data.textValue,
      'images': this.data.addedPhoto,
      'weather': this.data.weather,
    }
    if (this.data.textDiaryId != null)
      textDiaryData.id = this.data.textDiaryId
    
    SaveDiary(textDiaryData)
      .then((res) => {
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