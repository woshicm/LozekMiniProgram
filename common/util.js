let globalData = getApp().globalData

/*获取当前页url*/
function GetCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function GetCurrentPageUrlWithArgs() {
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

/*上传图片日记*/
function UploadImage(data) {
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: globalData.api.uploadImage,
      filePath: data['imageURL'],
      formData: {
        'location': data['location'] || 'No Location',
        'actions': JSON.stringify(data['actions']),
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
      },
      complete: (res) => {
        // FreshDiaryDataStorage()
      },
    })
  });
  return promise
}

// 上传文字日记里的图片
function UploadTextImage(data, id) {
  console.log('UploadTextImage log : get parma of id is :' + id)
  let promise = new Promise(function (resolve, reject) {
    Promise.all(data.map((image) => {
      wx.uploadFile({
        url: globalData.api.uploadImage,
        filePath: image.url,
        formData: {
          'id': id
        },
        header: {
          "token": globalData.token
        },
        name: 'image',
        success: (res) => {
          if (res.statusCode == '200') {
            resolve(res.data)
          } else if (res.statusCode == '403') {
            reject(403)
          }
        },
        complete: (res) => {
        }
      })
    }))
      .then((res) => {
        console.log(' upload all images res :', res)
        resolve(res)
      }).catch((err) => {

      })
  });
  return promise
}

function GetDiary(id) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.getDiary,
      data: {
        'id': id || 0
      },
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

function UploadTextDiary(data) {
  if (data['images'].length != 0) {
    data['has_image'] = 1
  } else {
    data['has_image'] = 0
  }
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
          // 开始上传附加图片，如果有的话
          if (data['images'].length != 0) {
            UploadTextImage(data['images'], res.data.id)
              .then((res) => {
                resolve(res.data)
              })
              .catch(() => {
              })
          } else {
            resolve(res.data)
          }
        } else if (res.statusCode == '403') {
          reject(403)
        }
      },
      fail: function (res) { reject(res) },
      complete: function (res) {
        // FreshDiaryDataStorage()
      },
    })
  });
  return promise
}

function UploadFilteredImage(data) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.saveFilteredDiary,
      data: data,
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
      complete: function (res) {
        // FreshDiaryDataStorage()
      },
    })
  });
  return promise
}

function UploadImageDiary(data) {


  if (data.imageURL.startsWith('http://tmp/') || data.imageURL.startsWith('wxfile://tmp')) {
    // 无滤镜效果保存
    return UploadImage(data)
  } else {
    // 有滤镜效果保存
    console.log(data)
    data['remote'] = 1
    return UploadFilteredImage(data)
  }
}

function SaveDiary(data) {
  if (data['type'] == 1) {
    return UploadImageDiary(data)
  } else {
    return UploadTextDiary(data)
  }
}


//获取当前时间信息
function GetCurrentTime() {
  var now = new Date();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  var dd = now.getDate();
  var days_en = new Array();
  var days_cn = new Array();
  var hh = now.getHours();
  var min = now.getMinutes();
  var ss = now.getSeconds();
  days_en[0] = "Sun";
  days_en[1] = "Mon";
  days_en[2] = "Tue";
  days_en[3] = "Wed";
  days_en[4] = "Thur";
  days_en[5] = "Fri";
  days_en[6] = "Sat";
  days_cn[0] = "星期日";
  days_cn[1] = "星期一";
  days_cn[2] = "星期二";
  days_cn[3] = "星期三";
  days_cn[4] = "星期四";
  days_cn[5] = "星期五";
  days_cn[6] = "星期六";
  var day_en = days_en[now.getDay()];
  var day_cn = days_cn[now.getDay()]
  var array = { yy, mm, dd, day_en, day_cn, hh, min, ss };
  return array;
}

//删除图片
function DeleteDiary(deleteDiaryId) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.deleteDiary,
      header: {
        "token": globalData.token
      },
      data: {
        'id': deleteDiaryId,
      },
      method: 'GET',
      success: (res) => {
        if (res.statusCode == '200') {
          GetDiary()
            .then((res) => {
              wx.setStorage({
                key: 'diaryData',
                data: res.diary,
              })
            })
            .catch(() => {
              console.log("until.js的DeleteDiary的GetDiary异常")
              DeleteDiary(deleteDiaryId)
            })
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

function GetImageInfo(src) {
  let promise = new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: src,
      success: (res) => {
        var item = {
          url: src,
          height: res.height,
          width: res.width,
        }
        resolve(item)
      },
      fail: (res) => { reject(res) },
    })
  })
  return promise
}

//刷新数据成功后更新本地缓存
// function FreshDiaryDataStorage() {
//   GetDiary()
//     .then((res) => {
//       wx.setStorage({
//         key: 'diaryData',
//         data: res.diary,
//       })
//     })
//     .catch(() => {
//       console.log("util.js.FreshDiaryDataStorage:获取后台最新数据失败")
//       GetDiary()
//     })
// }

/**
 * 获取天气接口
 */
function getWeather(location) {
  // console.log(globalData.api.getWeather)
  // let promise = new Promise(function (resolve, reject) {
  wx.request({
    url: globalData.api.getWeather,
    header: {
      "token": globalData.token
    },
    data: {
      'location': location,
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == '200') {
        // resolve(res.data.data)
        globalData.weather = res.data.data
      } else if (res.statusCode == '403') {
        reject(403)
      }
    },
    fail: function (res) { },
    complete: function (res) { },
  })
  // });
  // return promise
}
/**
 * 查词接口
 */
function getWord(word) {
  let promise = new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '正在搜索中',
      icon: 'none',
    })
    wx.request({
      url: globalData.api.getWord,
      header: {
        "token": globalData.token
      },
      data: {
        'word': word,
      },
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode == '200') {
          resolve(res.data.data)
        } else if (res.statusCode == '403') {
          wx.showToast({
            title: '搜索失败',
            icon: 'none',
          })
          reject(403)
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '搜索失败',
          icon: 'none',
        })
        reject(res)
      },
      complete: function (res) { },
    })
  });
  return promise
}

/**
 * 获取坐标信息
 */
function getLocationInfo(location) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.getLocationInfo,
      header: {
        "token": globalData.token
      },
      data: location,
      method: 'GET',
      success: (res) => {
        if (res.statusCode == '200') {
          resolve(res.data.data)
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

//获取用户权限
//scope.userLocation,scope.userInfo
function GetUserAuthorize(scope, name, content) {
  var that = this
  wx.getSetting({
    success: (res) => {
      if (!res.authSetting[scope]) {
        wx.authorize({
          scope: scope,
        })
      } else {
        switch (scope) {
          // case 'scope.userInfo': wx.getUserInfo({
          //   success: (e) => {
          //     globalData.userInfoCity = e.detail.userInfo.city
          //     // console.log(globalData.userInfo.City)
          //     console.log('asdsa:' + e.detail.userInfo)
          //   }
          // })
          //   break
          case 'scope.userLocation': wx.getLocation({
            success: (res) => {
              // that.setData({
              //   location: res.address
              // })
              globalData.userCurrentCityLatitude = res.latitude
              globalData.userCurrentCityLongitude = res.longitude
            },
          })
            break
          default: break
        }
      }
    }
  })
}

/**
 * 获取文字模版
 */
function GetTemplates(){
  let templates = [
    "<div style=' align-items: center; color: {color}; transform: scale({fontSize},{fontSize});width: 126px; height: 84px; padding: 0px; text-align: center;'><div style='font-size: 39px; letter-spacing: 3px; height: 60%;'>{temp}</div><div style='letter-spacing: 2px; height: 20%; font-size: 12px; margin:0px;'>{sourceText}</div><div style='font-size: 8px; margin:0px;padding: 0px;height: 20%'>Let time stop at this moment</div></div>"
  ]
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: globalData.api.getTemplate,
      header: {
        "token": globalData.token
      },
      data: location,
      method: 'GET',
      success: (res) => {
        if (res.statusCode == '200') {
          resolve(res.data.data)
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

//隐藏右上角分享
function HideShareMenu() {
  wx.hideShareMenu({
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

// 从本地模版库里生成对应模板
function GetTextModule(sourceText, color, fontSize, id) {
  let time = "";
  let location = "";
  let template = deeepCopy(globalData.templates[id]);
  console.log('模板')
  console.log(template);
  if(template.systemVariable.hasTime){
    let currentTime = GetCurrentTime();
    time = (currentTime.hh < 10 ? "0" : "") + currentTime.hh + ":" + (currentTime.min < 10 ? "0" : "") + currentTime.min;
    template.nodes = template.nodes.replace('{lozek-time}', time);
    template.systemVariable.time = time;
  }
  if (template.systemVariable.hasLocation){
    location = GetLocationInfo(globalData.userCurrentCityLatitude, userCurrentCityLongitude);
    template.nodes = template.nodes.replace('{lozek-location}', time);
  }

  sourceText = sourceText == '' ? template.systemVariable.defaultValue : sourceText
  template.nodes = template.nodes.replace('{color}', color).replace(new RegExp('{fontSize}', 'g'), fontSize).replace('{sourceText}', sourceText)

  template.id = id
  template.time = time
  template.userVariable.color = color
  template.userVariable.fontSize = fontSize
  return template;
}

function deeepCopy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = (typeof v === "object") ? deeepCopy(v) : v;
  }
  return output;
}

function Copy(o){
  return deeepCopy(o)
}

export { ParseText, UploadImage, GetCurrentPageUrl, GetCurrentPageUrlWithArgs, GetDiary, SaveDiary, GetCurrentTime, DeleteDiary, GetImageInfo, getWeather, getWord, GetUserAuthorize, getLocationInfo, GetTemplates, HideShareMenu, GetTextModule, Copy }
