Page({
  data:{
    titleValue: "",
    inputBottomLineColor: '5rpx solid #3f8ae9',
    showFunctionArea: true,
  },

 //-----------------------------生命週期函數-----------------------------------------//

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