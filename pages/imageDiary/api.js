let globalData  = getApp().globalData

/**
 * 1、input点击空白处时失去焦点函数有问题：提示blur，但是setData没有执行。
 * 2、从叙事模式转回非叙事模式时，超出的字怎么处理，
 * 3、在手机测试palceholder是会跟着主页面滑动
 * 4、数据格式怎么设计
 * 5、字体大小滑块
 * 6、布局
 */

function ParseText(text){
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.parseText,
      data: {
        text: text
      },
      header: {
        "token": globalData.token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=> {
        if(res.statusCode == '200'){
          resolve(res.data.text)
        }else if(res.statusCode == '403'){
          reject(403)
        }
      },
      fail: function(res) {reject(res)},
      complete: function(res) {},
    })
  });
  return promise
}

function UploadImage(path){
  let promise = new Promise(function (resolve, reject){
    wx.uploadFile({
      url: globalData.api.uploadImage,
      filePath: path,
      formData:{
        description: "xxxxx"
      },
      header: {
        "token": globalData.token
      },
      name: 'image',
      success:(res)=>{
        if (res.statusCode == '200') {
          resolve(JSON.parse(res.data))
        } else if (res.statusCode == '403') {
          reject(403)
        }
      }
    })
  });
  return promise
}


export { ParseText, UploadImage }