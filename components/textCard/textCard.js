Component({
  properties: {
    textDiaryId: {
      type: String
    },
    title: {
      type: String,
    },
    text: {
      type: String
    },
    iamgeUrl: {
      type: []
    },
    currentTextDiaryData:{
      type: []
    }

  },

  data: {
    width: 441,
    boxType: 'oneText',
    visible: false,
    animationOnExtraMenu: [],
  },
  methods: {
    onTapExtra() {
      console.log('触发了')
      this.setData({
        visible: true,
      });
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        transformOrigin: '0% 0% 0'
      });
      animation.scaleY(10).scaleX(10).step();
      this.setData({
        animationOnExtraMenu: animation.export(),
      })
    },

    /**
     * 6/1/2018 by yjj
     * 预览textDiary
     */
    previewTextDiary() {
      wx.navigateTo({
        url: '/pages/shareDiary/shareDiary?title=' + this.properties.title + '&text=' + this.properties.text + '&type=textDiary',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    /**
     * 6/1/2018 by yjj
     * 跳转到textDiary
     */
    toTextDiary() {
      var that = this
      wx.setStorage({
        key: 'textDiaryData',
        data: that.properties.currentTextDiaryData,
      })
      wx.navigateTo({
        url: '/pages/textDiary/textDiary?type=reEdit',
      })
    }
  }
})