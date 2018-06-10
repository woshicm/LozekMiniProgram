let app = getApp()

function CacheInit(){
  wx.getStorage({
    key: 'cacheData',
    success: function(res) {
      console.log('cache has been create')
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
        let cacheData = res.data
        let imagrUrl = url.split('&')[0]
        if (imagrUrl in cacheData){
          // console.log('inininininininin')
          resolve(cacheData[imagrUrl])
        }else{
          // console.log('no in')
          cacheImage(imagrUrl)
          .then((res)=>{
            resolve(res)
          })
          .catch((err)=>{
            console.log(err)
          })
        }
      },
      fail: (err)=>{
        reject(err)
      }
    })
  })
  return promise
}

function addRecorderToCacheData(net_url,local_url){
  wx.getStorage({
    key: 'cacheData',
    success: function(res) {
      let cacheData = res.data
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
    wx.downloadFile({
      url: net_url,
      header: {

      },
      success: function(res) {
        console.log('cache new image ' + net_url + ' to :' + res.tempFilePath)
        addRecorderToCacheData(net_url, res.tempFilePath)
        resolve(res.tempFilePath)
      },
      fail: function(err) {
        console.log(err)
      },
      complete: function(res) {},
    })
  })
  return promise
}

function TryCacheData(diarys){
    for (let diary of diarys) {
      for (let i = 0; i < diary.diary.image.length; i++) {
        if (diary.diary.image[i].imageURL.startsWith('https://www') || diary.diary.image[i].imageURL.includes('image?name')) {
          // console.log('origin :' + diary.diary.image[i].imageURL)
          checkURLCache(diary.diary.image[i].imageURL)
            .then((res) => {
              // console.log('cache image:' + res)
              diary.diary.image[i].imageURL = res
            })
            .catch((err) => {
              console.log('sdfsfsdffuck')
            })
        }
      }
    }
}
export { CacheInit, TryCacheData}