// pages/testPage/testPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: ''
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

  bindgetuserinfo(e) {
    console.log(e.detail.userInfo.city)
  },
  getLocation() {
    var that = this
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
              wx.chooseLocation({
                success: function (res) {
                  that.setData({
                    location: res.address
                  })
                },
              })
            },
            fail: (res) =>{
             wx.showToast({
               title: '没有定位权限，请再次点击重新授权',
             })
            }
          })
        }else(
          wx.chooseLocation({
            success: function (res) {
              that.setData({
                location: res.address
              })
            },
          })
        )
      }
    })
  },
})