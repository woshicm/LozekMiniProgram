// page/imageDiary/imageDiary.js
import {ParseText} from 'api.js'

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: 'a',
    inputLength:'0',

    items: [
      { name: 'Weather', value: '天气' },
      { name: 'TimeAndSpace', value: '时空' },
      { name: 'Mood', value: '心情滤镜' },

    ],


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
  displayInputLength: function(){
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
})