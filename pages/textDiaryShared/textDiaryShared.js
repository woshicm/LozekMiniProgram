// page/textDiaryShared/textDiaryShared.js

// 导入方法统一以大写字母开头
import { getWeather, getWord, getLocationInfo, GetDiary, HideShareMenu } from "../../common/util.js";

let app = getApp()
Page({
  data: {
    //全局变量
    textDiaryData: [],
    textDiaryId: '',
    //标题区
    titleValue: "",
    currentTime: [],
    currentWeather: '100',
    currentLocation: '深圳',
    titleSplit: 0,
    //正文区
    textValue_preview: '',
    //上传图片区
    addedPhoto: [],
    choseCount: 0,

  },

  //-----------------------------生命週期函數-----------------------------------------//
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    HideShareMenu
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getTextDiaryData()

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

  getTextDiaryData() {
    var that = this
    GetDiary(131)
      .then((d) => {
        for (let i = 0; i < d.diary[0].diary.text.length; i++){
          if ('131' == d.diary[0].diary.text[i].main.id){
            that.data.textDiaryData = d.diary[0].diary.text[i]
            break
          }
        }
        var data = that.data.textDiaryData
        console.log(data)
        that.setData({
          titleValue: data.main.title,
          textValue_preview: data.main.text,
          addedPhoto: data.main.images,
          currentTime: data.system.createdTime,
          currentWeather: data.system.weather
        })
      }).catch(() => {
          that.getTextDiaryData()     
      })
  }
})