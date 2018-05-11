Component({
  properties: {
    head: {
      type: String,
    },
    lookthrough: {
      type: String  
    },
  },

  data: {
    width: 441,
    boxType: 'oneText',
  },

  onTapExtra: function(e){

  },
  onTapExtra: function (e) {
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
})