// page/imageDiary/imageDiary.js

// 导入方法统一以大写字母开头
import { ParseText, UploadImage, GetCurrentPageUrl, GetCurrentPageUrlWithArgs, SaveDiary, GetCurrentTime, GetImageInfo, GetTemplates, HideShareMenu } from "../../common/util.js";
import { GetFliter } from "../../common/image_api.js";

let app = getApp()

Page({
  data: {
    test: true,
    originalImageUrl: '',
    filteredImageUrl: '',
    isShowConfirm: false,
    //全局变量
    mode: 'shortText',
    windowHeight: app.globalData.windowHeight,
    actions: "",
    /**
     * imageDiary頁
     */
    items: [
      { name: 'Weather', value: '天气' },
      { name: 'TimeAndSpace', value: '时空' },
      { name: 'Mood', value: '心情滤镜' },
    ],
    zIndex: 0,

    //富文本節點：用於handedText顯示
    textModule: [],
    //照片濾鏡
    imageFilter: "",
    //滑动区域
    scaleMax: 10,
    pixelRatio: app.globalData.pixelRatio,
    movableViewWidth: '',
    movableViewHeight: '',
    sliderValue: 40,
    //文本模板預覽參數
    choseTextModuleId: 0,
    richTextSize: 1,
    choseTextModule: "",
    textModuleScrollView: [],
    //顏色模板預覽參數
    choseColorModuleId: -1,
    colorModuleScrollView: [
      //適度提亮
      {
        backgroundColor: "#dfdfdf",
        color: "black",
        id: 0,
      },
      //適度壓暗
      {
        backgroundColor: "#808080",
        color: "white",
        id: 1,
      },
      //懷舊風 米黃
      {
        backgroundColor: "#f7de5f",
        color: "black",
        id: 2,
      },
      //清新藍
      {
        backgroundColor: "#10b2fa",
        color: "white",
        id: 3,
      },
      //白
      {
        backgroundColor: "white",
        color: "black",
        id: 4,
      },
      //黑
      {
        backgroundColor: "black",
        color: "white",
        id: 5,
      },
      //純灰度黃字
      {
        backgroundColor: "#333333",
        color: "#f7de5f",
        id: 6,
      },
      //懷舊灰黑字
      {
        backgroundColor: "#d9bea0",
        color: "black",
        id: 7,
      },
      //清新綠
      {
        backgroundColor: "#07e59c",
        color: "black",
        id: 8,
      },
      //低飽和度
      {
        backgroundColor: "#f5e9bf",
        color: "black",
        id: 9,
      },
    ],
    /**
     *  彈窗頁
     */
    keyboardHeight: 0,
    inputTitle: '',
    inputLength: 0,
    inputValue: '',
    inputCursor: 0,
    fontSize: "1pt",
    showModalStatus: true,
    showAddButton: true,
    isLengthOver: false,//检测输入内容长度是否超过25
    isFocus: true,  //是否获得焦点
    isMoveable: true, //是否可移动
    isInputNull: true, //判断输入是否为空
    isShowTools: false,    //显示工具栏
    isInputStatu: true,  //是否输入模式
    showEdit: false, //false显示文案,true显示名言
    showFontSizeSlider: true,   //打开字体选择slider
    switchChecked: false,  //是否选中叙事模式
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

  //-----------------------------生命週期函數-----------------------------------------//
  onLoad: function (options) {
    HideShareMenu()
    this.setData({
      originalImageUrl: options.imgUrl,
      filteredImageUrl: options.imgUrl,
      uploadedImageWidth: options.imageWidth,
      uploadedImageHeight: options.imageHeight,
    })
    // GetImageInfo(imageUrl)
    // .then((res) => {
    //res就是要的信息
    //   console.log(res)
    //   }).catch((res) => {
    // })
    // console.log(options.imgUrl)
    let data = {
      'imageURL': options.imgUrl,
      'all': 1
    }
    GetFliter(data)
      .then(() => {
        console.log("precreate all filter ")
      })
      .catch(() => {
        console.log("不用管这个被取消的请求，他没错误")
      })
    // 加载模版内容
    if (app.globalData.templates.length == 0) {
      GetTemplates()
        .then((data) => {
          app.globalData.templates = data
        })
    }
  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    wx.showModal({
      title: '提示',
      content: '是否放棄修改？',
    })
    console.log("onHide")
  },
  onUnload: function () {
    console.log("onUnload")
  },

  //-----------------------------前端函數-----------------------------------------//
  /**
     * 彈窗頁
     */
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    //調用文字模板函數
    if (this.data.inputLength != 0)
      this.getTextModule();
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
      });

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: !this.data.showModalStatus,
          }
        );
      }
    }.bind(this), 200);

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: !this.data.showModalStatus,
        }
      );
    }
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
   * input監聽事件
   */
  titleInputOnFocusEvent(e) {
  },
  titleInputOnBlurEvent(e) {
    this.setData({
      inputTitle: e.detail.value,
    })
  },
  /**
   * textarea监听事件
   */
  //input编辑
  textareaOnInputEvent: function (e) {
    if (this.data.isLengthOver) {
      this.setData({
        isLengthOver: !this.data.isLengthOVer,
      });
      return this.data.inputValue;
    }
    switch (e.target.id) {
      case 'title':
        break;
      case 'content':
        this.setData({
          inputCursor: e.detail.cursor,         //暂时没用
          inputLength: e.detail.value.length,
        });
        break;
      default: console.log("input函数有bug，快去消灭！");
    }
  },

  // 聚焦
  textareaOnFocusEvent: function (e) {
    // var keyboardHeight = e.detail.height;
    // //建立動畫：拉起鍵盤，彈窗向上偏移
    // var animation = wx.createAnimation({
    //   duration: 200,  //动画时长
    //   timingFunction: "linear", //线性
    //   delay: 0  //0则不延迟
    // });
    // this.animation = animation;
    // animation.translateY(-0.2 * keyboardHeight * app.globalData.pixelRatio).step();
    // this.setData({
    //   keyboardHeight: keyboardHeight,
    //   animationData: animation.export(),
    // });
    // wx.showToast({
    //   title: 'focus',
    // })
  },
  //失焦
  textareaOnBlurEvent(e) {
    var value = e.detail.value;
    var array = [];
    // if (value.length == 0) {
    //   //隨機調用名言模板
    // }
    // else {
    for (var i = 0; i < 10; i++) {
      var suitableTextModule = this.getTextModule(value, 'black', 0.5, i);
      array.push(suitableTextModule);
    }
    // }
    var choseTextModule = this.getTextModule(value, 'black', 1, 0);
    // this.parseInputValue(value);
    switch (e.target.id) {
      case 'title':
        this.setData({
          inputTitle: value,
        });
        break;
      case 'content':
        // var animation = wx.createAnimation({
        //   duration: 200,  //动画时长
        //   timingFunction: "linear", //线性
        //   delay: 0  //0则不延迟
        // });
        // this.animation = animation;
        // animation.translateY(0.2 * this.data.keyboardHeight * app.globalData.pixelRatio).step();
        // this.setData({
        //   inputValue: value,
        //   animationData: animation.export(),
        // });
        // wx.showToast({
        //   title: 'blur',
        // })
        var isShow = this.data.mode == 'longText';
        this.setData({
          inputValue: value,
          isMoveable: !this.data.isMoveable,
          textModuleScrollView: array,
          choseTextModule: choseTextModule,
          movableViewWidth: choseTextModule.systemVariable.width,
          movableViewHeight: choseTextModule.systemVariable.height,
          isShowConfirm: isShow,
          isShowTools: isShow,
          isInputStatu: isShow,
        });
        break;
      default:
        console.log("哈哈,失去焦点函数有bug!");
    }
  },

  /**
   * 确认输入内容并跳转
   */
  //   confirm() {
  //     if (this.data.inputValue.length == 0) {
  //       //隨機調用名言模板
  //     }
  //     else {
  //       var array = []
  //       for (var i = 0; i < 10; i++) {
  // <<<<<<< HEAD
  //         var suitableTextModule = this.getTextModule(value, 'black', 0.5, i);
  //         array.push(suitableTextModule)
  //       }
  //     }
  //     // var animation = wx.createAnimation({
  //     //   duration: 200,  //动画时长
  //     //   timingFunction: "linear", //线性
  //     //   delay: 0  //0则不延迟
  //     // });
  //     // this.animation = animation;
  //     // animation.translateY(0.2 * this.data.keyboardHeight * app.globalData.pixelRatio).step();
  //     // this.setData({
  //     //   inputValue: value,
  //     //   animationData: animation.export(),
  //     // });
  //     // wx.showToast({
  //     //   title: 'blur',
  //     // })
  //     var choseTextModule = this.getTextModule(value, 'black', 1, 0);
  //     var scaleMax;
  // =======
  //         var suitableTextModule = this.getTextModule(this.data.inputValue, 'black', 0.3, i);
  //         array.push(suitableTextModule)
  //       }
  //     };

  /**
   * movableArea 监听事件
   */
  //移动
  onMovableAreaChangeEvent(e) {
    var clientCoordinate = e.detail;
    this.setData({
      clientCoordinate: clientCoordinate,
    })
    if (this.data.isShowTools && e.detail.source == 'touch') {
      this.setData({
        isShowTools: false,
        isShowConfirm: false,
        isInputStatu: false,
      })
    }
  },
  //縮放
  onMovableAreaScaleEvent(e) {
    this.setData({
      sliderValue: e.detail.scale * 40,
    })
  },
  //
  onSlideOutlayoutMaskTap() {
    this.setData({
      isShowTools: false,
      isShowConfirm: false,
      isInputStatu: false,
    })
  },
  //调用api处理输入文字
  parseInputValue(value) {
    ParseText(value)
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.log(e + "token expired");
        app.relogin();
      })
  },


  //监测天气，时空，心情滤镜有没有选中
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  //开关叙事模式
  // switchModel() {
  //   var that = this;
  //   this.setData({
  //     switchChecked: !this.data.switchChecked,
  //   });
  //   if (this.data.switchChecked) {
  //     that.setData({
  //       inputMaxLength: 50,
  //     })
  //   } else {
  //     that.setData({
  //       inputMaxLength: 25,
  //       inputLength: that.data.inputValue.length,
  //     });
  //   }
  //   console.log(that.data.inputMaxLength);
  // },
  // 打开dictum下拉显示框
  selectDictum(e) {

    let id = e.currentTarget.id;
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
  },
  // 打开style下拉显示框
  selectStyle(e) {
    let id = e.currentTarget.id;
    this.setData({
      zIndex: -1,
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
      zIndex: 0,
    });
  },

  /**
   * 文字模板處理函數
   */
  onTextModuleItemTap(e) {
    var choseTextModuleId = e.currentTarget.dataset.textModuleId;
    if (choseTextModuleId == this.data.choseTextModuleId)
      return;
    var color = "black";
    if (this.data.choseColorModuleId != -1)
      color = this.data.colorModuleScrollView[this.data.choseColorModuleId].color;
    this.setData({
      choseTextModuleId: choseTextModuleId,
      choseTextModule: this.getTextModule(this.data.inputValue, color, this.data.richTextSize, choseTextModuleId)
    })
  },
  /**
   * 顏色模板處理函數
   */
  onColorModuleItemTap(e) {
    var colorModuleId = e.currentTarget.dataset.colorModuleId;
    if (colorModuleId == this.data.choseColorModuleId) {
      this.setData({
        filteredImageUrl: this.data.originalImageUrl,
        choseColorModuleId: -1,
      })
      return;
    }
    let data = {
      imageURL: this.data.originalImageUrl,
      type: colorModuleId + 1,
    };
    GetFliter(data)
      .then((res) => {
        this.setData({
          filteredImageUrl: res.imgUrl,
          choseColorModuleId: colorModuleId,
          choseTextModule: this.getTextModule(this.data.inputValue, this.data.colorModuleScrollView[colorModuleId].color, this.data.richTextSize, this.data.choseTextModuleId)
        })
      })
      .catch(() => {

      })
  },


  //-----------------------------前後交互函數-----------------------------------------//
  //請求文字模板
  getTextModule(sourceText, color, fontSize, id) {
    var textModule = {}
    // 获取本地保存的模版
    let template = app.globalData.templates[0]
    switch (id) {
      case 0://只显示用户输入的内容
      case 1: {
        var currentTime = GetCurrentTime();
        var temp = (currentTime.hh < 10 ? "0" : "") + currentTime.hh + ":" + (currentTime.min < 10 ? "0" : "") + currentTime.min;
        sourceText = sourceText == '' ? '让时间停在这一刻' : sourceText
        // 进行模版内容替换
        template = template.replace('{color}', color).replace(new RegExp('{fontSize}', 'g'), fontSize).replace('{temp}', temp).replace('{sourceText}', sourceText)

        textModule = {
          nodes: template,
          systemVariable: {
            defaultValue: '让时间停在这一刻',
            id: id,
            height: 84,
            width: 126,
            hasTime: true,
            time: temp,
            hasLocation: false,
            marginLeft: 8,
            marginTop: 6,
            maxLength: 8,
            keyWords: [],
          },
          userVariable: {
            color: color,
            fontSize: fontSize,
          }
        }
        return textModule;
      }
      case 2: {
        var currentTime = GetCurrentTime();
        var temp = (currentTime.hh < 10 ? "0" : "") + currentTime.hh + ":" + (currentTime.min < 10 ? "0" : "") + currentTime.min;
        sourceText = sourceText == '' ? '让时间不停在这一刻' : sourceText
        // 进行模版内容替换
        template = template.replace('{color}', color).replace(new RegExp('{fontSize}', 'g'), fontSize).replace('{temp}', temp).replace('{sourceText}', sourceText)
        textModule = {
          nodes: template,
          systemVariable: {
            defaultValue: '让时间不停在这一刻',
            id: id,
            height: 84,
            width: 126,
            hasTime: true,
            time: temp,
            hasLocation: false,
            marginLeft: 8,
            marginTop: 6,
            maxLength: 8,
            keyWords: [],
          },
          userVariable: {
            color: color,
            fontSize: fontSize,
          }
        }
        return textModule;
      }
    }
  },

  //返回文字模板
  putTextModule(textPosition, imagePosition) {
    var beginPoint = {
      'x': this.data.choseTextModule.systemVariable.marginLeft + textPosition.left - imagePosition.left,
      'y': textPosition.top - imagePosition.top,
    };
    var height = this.data.choseTextModule.systemVariable.height;
    var actions = [
      {
        'action': 'text',
        'text': this.data.choseTextModule.systemVariable.time,
        'position': [beginPoint.x, beginPoint.y + (height * 0.6 - 39) / 2],
        'font-style': '',
        'font-color': '',
        'font-size': 39,
      },
      {
        'action': 'text',
        'text': this.data.inputValue,
        'position': [beginPoint.x, beginPoint.y + height * 0.6 + (height * 0.2 - 12) / 2],
        'font-style': 'letter-spacing: 2px;',
        'font-color': this.data.choseTextModule.userVariable.color,
        'font-size': 12,
      },
      {
        'action': 'text',
        'text': 'Let time stop at this moment',
        'position': [beginPoint.x, beginPoint.y + height * 0.8 + (height * 0.2 - 8) / 2],
        'font-style': 'letter-spacing: 2px;',
        'font-color': this.data.choseTextModule.userVariable.color,
        'font-size': '8px',
      },
    ]
    return actions;
  },
  //显示文本工具栏
  showTools() {
    this.setData({
      isShowTools: !this.data.isShowTools,
      slideOutLayerTop: app.globalData.windowHeight * 0.7 - (app.globalData.windowHeight * 0.7 - this.data.uploadedImageHeight) / 2,
    });
  },

  //改变富文本大小
  changeRichSize(e) {
    this.setData({
      richTextSize: e.detail.value * 0.025,
      choseTextModule: this.getTextModule(this.data.inputValue, 'black', this.data.richTextSize, 0),
    });
  },

  //选择显示输入框还是富文本
  changeTextReady() {
    var isShow = this.data.mode == 'longText';
    this.setData({
      isFocus: true,
      isMoveable: !this.data.isMoveable,
      isInputStatu: true,
      isShowConfirm: isShow,
    })
  },

  /**
   * saveDiaryText
   */
  saveDiaryText(textPosition, imagePosition) {
    var actions = this.putTextModule(textPosition, imagePosition);
    console.log(actions)
    let diary = {
      'type': 1,
      'imageURL': this.data.filteredImageUrl,
      'location': '',
      'actions': actions,
    }
    console.log(diary)
    SaveDiary(diary)
      .then((res) => {
        wx.hideLoading();
        wx.redirectTo({
          url: 'finished/finished',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  },
  /**
   * 切换叙事模式
   */
  switchMode() {
    let value = this.data.inputValue;
    let isOver = this.data.isLengthOver;
    var mode = 'longText';
    if (this.data.mode == 'longText') {
      mode = 'shortText'
      if (value.length > 25) {
        value = value.slice(0, 25);
        isOver = true;
      }
    }
    var isShow = this.data.mode == 'longText';
    this.setData({
      mode: mode,
      isFocus: true,
      inputValue: value,
      isLengthOver: isOver,
      isShowConfirm: isShow,
      isInputStatu: true,
    })
  },
  //輸入模式
  onSwitchModeConfirmTap() {
    this.setData({
      isInputStatu: false,
      isShowConfirm: false,
      isShowTools: false,
    })
  },

  /**
   * 保存區
   */
  //分享好友
  onShareTap() {
    this.saveDiaryText();
  },
  //存至本地
  onSaveTap() {
    wx.showLoading({
      title: '正在保存...',
    })

    let textPosition = [];
    let imagePosition = [];

    wx.createSelectorQuery().select('#id-movable').boundingClientRect(function (rect) {
      var item = {
        top: rect.top,
        left: rect.left,
      }
      textPosition = item;
    }).exec();
    wx.createSelectorQuery().select('#id-uploadedImage').boundingClientRect(function (rect) {
      var item = {
        top: rect.top,
        left: rect.left,
      }
      imagePosition = item;
    }).exec();
    var that = this;
    setTimeout(
      function () {
        that.saveDiaryText(textPosition, imagePosition);
      }, 50
    );
  }
})
