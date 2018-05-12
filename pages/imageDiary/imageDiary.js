// page/imageDiary/imageDiary.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  displayInputLength: function(e){
    this.setData({
      inputLength: e.detail.value.length
    })
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

})