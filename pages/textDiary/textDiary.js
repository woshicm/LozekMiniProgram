// page/textDiary/textDiary.js

// 导入方法统一以大写字母开头
import { GetCurrentTime, UploadImage, GetImageInfo } from "../../common/util.js";

let app = getApp()
Page({
  data: {
    //全局变量
    state: 'edit',
    textDiaryData: [],
    //功能区
    snapshot: [],
    //标题区
    titleValue: "",
    hideTitle: true,
    inputBottomLineColor: '5rpx solid #3f8ae9',
    currentTime: GetCurrentTime(),
    currentWeather: 'sunny',
    currentLocation: '深圳',
    //正文区
    textValue: "",
    isDiaryTextMaskHidden: true,
    isDiaryTextFocus: false,
    //上传图片区
    addedPhoto: [],
    choseCount: 0,
  },

  //-----------------------------生命週期函數-----------------------------------------//
  onLoad() {
  },

  //-----------------------------事件监听器-----------------------------------------//
  /**
   * 标题区-输入
   */
      //聚焦
  onTitleInputFocusEvent() {
    var inputBottomLineColor = '5rpx solid #3f8ae9';
    this.setData({
      inputBottomLineColor: inputBottomLineColor,
    })
  },
      //失焦
  onTitleInputBlurEvent(e) {
    var inputBottomLineColor = '3rpx solid rgba(55,121,205,0.12)';
    var value = e.detail.value;
    this.setData({
      inputBottomLineColor: inputBottomLineColor,
      titleValue: value,
      isDiaryTextMaskHidden: false,
      hideTitle: false,
    })
  },

  /**
   * 标题区-展示
   */
  onTitleTapEvent(){
    this.setData({
      hideTitle: true,
    })
  },

  /**
   * 功能区 
   */
  onFunctionConfirmTap() {
    var that = this;
    setTimeout(
      function () {
        var text = that.data.textValue;
        text = text.replace(/ /g, "&nbsp;")
        that.setData({
          state: 'preview',
          textValue_preview: text,
        })
        console.log("functionTap: " + text)
      }, 50);
    this.save();
  },

  /**
  * 正文区-输入
  */
  onDiaryAreaFocusEvent() {
    this.setData({
      showFunctionArea: false,
      isDiaryTextMaskHidden: false,
    })
  },

  onDiaryAreaBlurEvent(e) {
    var value = e.detail.value;
    this.setData({
      textValue: value,
      isDiaryTextMaskHidden: true,
    })
  },
      //正文輸入的遮罩，確保拿到text值
  onDiaryAreaMaskTapEvent() {
    this.setData({
      isDiaryTextFocus: false,
      isDiaryTextMaskHidden: true,
    })
  },

  /**
   * 正文区-展示
   */
  onShowDiaryTapEvent() {
    this.setData({
      state: 'edit',
      isDiaryTextFocus: true,
    })
  },
      // 预览相片
  onPreviewPhotoTapEvent(){

  },

  /**
   * 图片上传区
   */
  onAddPhotoTap() {
    this.doUpload();
  },
  onDeletePhotoTap(e){
    var addedPhoto = this.data.addedPhoto;
    var index = e.currentTarget.dataset.deleteIndex;
    for (var i = index; i < addedPhoto.length - 1; i++){
      addedPhoto[i] = addedPhoto[i+1]
    }
    addedPhoto.pop();
    this.setData({
      addedPhoto: addedPhoto,
    })
  },
  //-----------------------------前後交互函數-----------------------------------------//
      // 获取图片
  doUpload() {
    var that = this;
    wx.chooseImage({
      count: 5 - that.data.choseCount,
      sizeType: ['original', 'compressed'],
      sourceType: 'album',
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        var addedPhoto = that.data.addedPhoto;
        for (var i = 0; i < tempFilePaths.length; i++) {
          GetImageInfo(tempFilePaths[i])
            .then((res) => {
              addedPhoto.push(res);
            }).catch((res) => {
            })
        }
        setTimeout(
          function () {
            that.setData({
              addedPhoto: addedPhoto,
            })
          }, 100
        )
      }
    })
  },
      //上传后台
  save() {
    var createdTime = GetCurrentTime();
    if(this.data.textDiaryData.length != 0)
      createdTime = this.data.textDiary.system.createdTime;
    var textDiaryData = {
      main: {
        'type': 0,
        'title': this.data.titleValue,
        'text': this.data.textValue,
        'images': this.data.addedPhoto, //通過addedPhoto[i].url 獲取圖片url
      },
      extra: {
        snapshot: this.data.snapshot,
      },
      system: {
        createdTime: createdTime,
        lastModifiedTime: GetCurrentTime(), //數組元素{ yy, mm, dd, day_en, day_cn, hh, min, ss};
        weather: "",
      }
    }
  }
})