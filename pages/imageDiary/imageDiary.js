// page/imageDiary/imageDiary.js
import {ParseText, UploadImage} from 'api.js'

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: '/images/icon-imageDiary-addPhoto.svg',
    inputLength: '0',
	  inputValue: 'a',
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
   * 实时显示字符串长度
   */
  displayInputLength: function(e){
    this.setData({
      inputLength: this.data.inputValue.length
    })
  },
  /**
   * 同步 input 值到 data
   */
  bindInputValueToData: function(value){
    this.setData({
      inputValue: value
    })
  },
  /**
   * 触发 input 编辑事件
   */
  inputEditEvent: function (e) {
    this.bindInputValueToData(e.detail.value)
    this.displayInputLength()
  },
  /**
   * 失去焦点时开始调用api处理输入文字
   */
  parseInputValue: function(e){
    ParseText(this.data.inputValue)
    .then((res)=>{
      console.log(res)
    })
    .catch((e)=>{
      console.log(e + "token expired")
      app.relogin()
    })
  },
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
})