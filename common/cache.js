let app = getApp()

function CacheInit(){
  wx.getStorage({
    key: 'cacheData',
    success: function(res) {
      console.log('cache has been create at :')
      console.log(res.data)
    },
    fail: (res)=> {
      console.log("can't find cache data, next will create it")
      createCache()
    },
    complete: function(res) {},
  })
}

function createCache(){
  let cache = {}
  wx.setStorage({
    key: 'cacheData',
    data: cache,
  })
}

// async function TryGetCache(net_url) {
//   let url = await checkURLCache(net_url);
//   return url
// }

function checkURLCache(url){
  let promise = new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'cacheData',
      success: (res)=> {
        cacheData = res.data
        if(url in cacheData){
          resolve(cacheData[url])
        }else{
          cacheImage(url)
          .then((res)=>{
            resolve(res)
          })
        }
      },
      fail: ()=>{
        resolve(url)
      }
    })
  })
  return promise
}

function addRecorderToCacheData(net_url,local_url){
  wx.getStorage({
    key: 'cacheData',
    success: function(res) {
      cacheData = res.data
      cacheData[net_url] = local_url
      wx.setStorage({
        key: 'cacheData',
        data: cacheData,
      })
    },
  })
}

function cacheImage(net_url){
  let promise = new Promise((resolve,reject)=>{
    wx.saveFile({
      tempFilePath: net_url,
      success: (res)=>{
        console.log('cache new image ' + net_url  +' to :' + res.savedFilePath)
        addRecorderToCacheData(net_url,res.savedFilePath)
        resolve(res.savedFilePath)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  })
  return promise
}
export { CacheInit}