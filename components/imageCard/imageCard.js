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
        urls: [this.properties.imageURL + '&type=origin'],
      })
    },
  }
})