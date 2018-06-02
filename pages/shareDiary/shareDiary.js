var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textDiaryTitle: '',    //文本日记标题
    textDiaryContent: '',  //文本日记内容
    imageDiaryImgUrl: '',   //图片日记Url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'textDiary') {
      this.setData({
        textDiaryTitle: options.title,
        textDiaryContent: options.content,
      })
    } else {
      this.setData({
        imageDiaryImgUrl: app.globalData.api.getShareDiary + '?name=' + options.name + '&' + options.secondData
      })
    }
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
  }
})