let globalData = getApp().globalData

/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}




function ParseText(text) {
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
      success: (res) => {
        if (res.statusCode == '200') {
          resolve(res.data.text)
        } else if (res.statusCode == '403') {
          reject(403)
        }
      },
      fail: function (res) { reject(res) },
      complete: function (res) { },
    })
  });
  return promise
}

/*上传图片*/
function UploadImage(path) {
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: globalData.api.uploadImage,
      filePath: path,
      formData: {
        description: "xxxxx"
      },
      header: {
        "token": globalData.token
      },
      name: 'image',
      success: (res) => {
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


function getDiary() {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.getDiary,
      header: {
        "token": globalData.token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (res.statusCode == '200') {
          resolve(res.data)
        } else if (res.statusCode == '403') {
          reject(403)
        }
      },
      fail: function (res) { reject(res) },
    })
  });
  return promise
}

function uploadTextDiary(data) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.saveDiary,
      data: data,
      header: {
        "token": globalData.token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (res.statusCode == '200') {
          resolve(res.data.status)
        } else if (res.statusCode == '403') {
          reject(403)
        }
      },
      fail: function (res) { reject(res) },
      complete: function (res) { },
    })
  });
  return promise
}

function uploadImageDiary(url){
  return UploadImage(url)
}

function SaveDiary(data){
  console.log(data['type'] == 1)
  if(data['type']==1){
    return uploadImageDiary(data['imageURL'])
  }else{
    return uploadTextDiary(data)
  }
}

export { ParseText, UploadImage, getCurrentPageUrl, getCurrentPageUrlWithArgs, getDiary, SaveDiary }
