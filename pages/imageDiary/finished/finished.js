let app = getApp();

Page({
  data:{
    windowHeight: app.globalData.windowHeight,
  },

  onBackToIndexTap(){
    var that = this;
    this.setData({
      waveEffectsOnTextButton: "waves-effect-animation",
    })
    setTimeout(
      function(){
        wx.navigateBack({
        });
      }, 400
    )
    setTimeout(
      function () {
        that.setData({
          waveEffectsOnTextButton: "",
        })
      }, 1000
    )
  }
})