let globalData = getApp().globalData

/*获取滤镜效果*/
function GetFliter(data) {
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: globalData.api.getFilter,
      filePath: data['imageURL'],
      formData: {
        'type': data['type'] || 1
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

export { GetFliter }