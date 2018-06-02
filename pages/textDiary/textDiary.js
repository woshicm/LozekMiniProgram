Page({
  data:{
    titleValue: "",
    inputBottomLineColor: '5rpx solid #3f8ae9',
    showFunctionArea: true,
  },

 //-----------------------------生命週期函數-----------------------------------------//
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    //从主页传递标题和内容
    // if (options.type == 'reEdit') {
    //   this.setData({
    //     titleValue: options.title,
    //   })
    // }
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
   * TitleInput 标题输入事件
   */
  onTitleInputFocusEvent(){
    var inputBottomLineColor = '5rpx solid #3f8ae9';
    this.setData({
      inputBottomLineColor: inputBottomLineColor,
    })
  },

  onTitleInputBlurEvent(){
    var inputBottomLineColor = '3rpx solid rgba(55,121,205,0.12)';
    this.setData({
      inputBottomLineColor: inputBottomLineColor,
    })
  },

   /**
   * diaryArea 日记文本区输入事件
   */
  onDiaryAreaFocusEvent(){
    this.setData({
      showFunctionArea: false,
    })
  },

  onDiaryAreaBlurEvent() {
    this.setData({
      showFunctionArea: true,
    })
  }

})