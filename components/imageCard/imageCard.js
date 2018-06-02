Component({
  options:{
    multipleSlots: true //在组件定义时的选项中启用多slot支持
  },
  
  properties: {
    imageURL: {
      type: String,
    },
    location: {
      type: String,
      value: '深圳市南山区深圳大学',
    },
    height: {
      type: Number,
      value: 240,
    }
  },
  data: {
  },
  methods: {
    //预览图片
    previewImageDiary(){
      wx.previewImage({
        current: [], //当前显示图片的链接,不填则默认为urls的第一张
        urls: [this.properties.imageURL, this.properties.imageURL + '&type=origin'], //需要预览的图片链接列表
      })
    },
  }
})