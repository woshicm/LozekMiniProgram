// page/imageDiary/imageDiary.js

import { ParseText, UploadImage, getCurrentPageUrl, getCurrentPageUrlWithArgs } from "../../common/util.js";

/**
 * -------------未完成
 * 1、input点击空白处时失去焦点函数有问题：提示blur，但是setData没有执行。
 * 2、从叙事模式转回非叙事模式时，超出的字怎么处理，
 * 3、在手机测试palceholder是会跟着主页面滑动
 * 4、数据格式怎么设计
 * 5、字体大小滑块
 * 6、布局
 * 7、wx.choosedImage()有问题,getImageInfo默认两种选择方式
 * 8、图片宽度显示太大
 * 9、slider控制文本放大缩小
 * 
 * -------------已完成
 * 1、去掉键盘上方的完成按钮
 * 2、解决再次弹起键盘时弹窗会向上偏移
 * 3、api.js移到common.util.js
 * 4、修改index.display点击事件:toImageDiary和chooseImageTap
 */

let app = getApp()

Page({
  data: {
    test: true,
    /**
     * imageDiary頁
     */
    items: [
      { name: 'Weather', value: '天气' },
      { name: 'TimeAndSpace', value: '时空' },
      { name: 'Mood', value: '心情滤镜' },
    ],
    zIndex: 0,
    imgUrl: '',
    uploadedImageWidth: 0,  
    uploadedImageHeigth: 0,
    isTextEmpty: true,
    isMoveable: true,
    isShowTools: false,
    //富文本節點：用於handedText顯示
    textModule: [],
    //照片濾鏡
    imageFilter: "",
    //文本模板預覽參數
    choseTextModuleId: 0,
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
    showModalStatus: true,
    showAddButton: true,
    keyboardHeight: 0,
    showEdit: false, //false显示文案,true显示名言
    inputLength: 0,
    inputValue: '',
    inputCursor: 0,
    inputMaxLength: 25,
    fontSize: "1pt",
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
    this.setData({
      imgUrl: wx.getStorageSync('imgUrl'),
      uploadedImageWidth: wx.getStorageSync('uploadedImageWidth'),
      uploadedImageHeight: wx.getStorageSync('uploadedImageHeight'),
    })
  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
  },
  onUnload: function () {
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
   * 触发 input 编辑事件
   */
  textareaOnInputEvent: function (e) {
    this.setData({
      inputCursor: e.detail.cursor,         //暂时没用
      inputLength: e.detail.value.length,
    })
  },

  /**
   * textarea獲得焦點處理函數
   */
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
  /**
   * textarea失去焦点处理函数
   */
  textareaOnBlurEvent(e) {
    var value = e.detail.value;
    this.parseInputValue(value);
    if(value.length == 0){
      //隨機調用名言模板
    }
    else{
      var array = []
      for (var i = 0; i < 10; i++) {
        var suitableTextModule = this.getTextModule(value, 'black', 0.3, i);
        array.push(suitableTextModule)
      }
    }
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
    this.setData({
      inputValue: value,
      isTextEmpty: !this.data.isTextEmpty,
      isMoveable: !this.data.isMoveable,
      textModuleScrollView: array,
      choseTextModule: this.getTextModule(value, 'black', 0.5, 0),
    });
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
  switchModel() {
    var that = this;
    this.setData({
      switchChecked: !this.data.switchChecked,
    });
    if (this.data.switchChecked) {
      that.setData({
        inputMaxLength: 50,
      })
    } else {
      that.setData({
        inputMaxLength: 25,
        inputLength: that.data.inputValue.length,
      });

    }
    console.log(that.data.inputMaxLength);
  },
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
  onTextModuleItemTap(e){
    var choseTextModuleId = e.currentTarget.dataset.textModuleId;
    if (choseTextModuleId == this.data.choseTextModuleId)
      return;
    var color = "black"; 
    if(this.data.choseColorModuleId != -1)
      color = this.data.colorModuleScrollView[this.data.choseColorModuleId].color;
    this.setData({
      choseTextModuleId: choseTextModuleId,
      choseTextModule: this.getTextModule(this.data.value, color, 0.5, choseTextModuleId)
    })
  },
  /**
   * 顏色模板處理函數
   */
  onColorModuleItemTap(e) {
    var colorModuleId = e.currentTarget.dataset.colorModuleId;
    if (colorModuleId == this.data.choseColorModuleId) {
      this.setData({
        imageFilter: "",
        choseColorModuleId: -1,
      })
      return;
    }
    var operation = "";
    switch (colorModuleId) {
      case 0:
        operation = "contrast(150%);";
        break;
      case 1:
        operation = "contrast(50%)";
        break;
      case 2:
        operation = "sepia(50%)";
        break;
      case 3:
        operation = "";
        break;
      case 4:
        operation = "brightness(150%);";
        break;
      case 5:
        operation = "brightness(50%);";
        break;
      case 6:
        operation = "";
        break;
      case 7:
        operation = "";
        break;
      case 8:
        operation = "";
        break;
      case 9:
        operation = "";
        break;
    }
    this.setData({
      imageFilter: operation,
      choseColorModuleId: colorModuleId,
      choseTextModule: this.getTextModule(this.data.inputValue, this.data.colorModuleScrollView[colorModuleId].color, 0.5, this.data.choseTextModuleId)
    })
  },


  //-----------------------------前後交互函數-----------------------------------------//
  //請求文字模板
  getTextModule(sourceText, color, fontSize, id) {
    var textModule = {
      nodes: "<div style='display: flex; flex-direction: column;justify-content: center; align-items: center; color: " + color + "; transform: scale(" + fontSize + "," + fontSize + ");'>"
      + "<div style='font-size: 50pt; font-family:; letter-spacing: 10rpx;'>05:20</div>"
      + "<div style='letter-spacing: 10rpx;'>" + sourceText + "</div>"
      + "<div style='font-size: 10pt'>Let time stop at this moment</div>"
      + "</div>",
      defaltValue: {},
      id: id,
    }
    return textModule;
  },

  //显示文本工具栏
  showTools() {
    console.log("我被点击了！");
    this.setData({
      isShowTools: !this.data.isShowTools,
    });
  },


  changeFontSize(e) {
    console.log(e.detail.value);
    this.setData({
      fontSize: e.detail.value,
    });
  },

  changeTextReady(){
    this.setData({
      isShowTools: !this.data.isShowTools,
      isMoveable: !this.data.isMoveable,
      isTextEmpty: !this.data.isTextEmpty,
    })
  }
})
