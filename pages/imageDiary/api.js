let globalData  = getApp().globalData

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
          resolve(JSON.parse(res.data).status)
        } else if (res.statusCode == '403') {
          reject(403)
        }
      }
    })
  });
  return promise
}


export { ParseText, UploadImage }