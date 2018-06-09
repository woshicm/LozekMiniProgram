let app = getApp()

function CheckURLCache(url){
  
}

function CacheImage(net_url){
  let promise = new Promise((resolve,reject)=>{
    wx.saveFile({
      tempFilePath: net_url,
      success: (res)=>{
        console.log('cache new image ' + net_url  +' to :' + res.savedFilePath)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  })
}
export {}