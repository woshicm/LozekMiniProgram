App({
  globalData: {
<<<<<<< HEAD
    /**
     * 設備參數
     */
    pixelRadio: wx.getSystemInfoSync().pixelRatio,
    token:'1',
    api: {
      login: 'http://111.230.24.245/login',
      // getDiarys : base + '/diarys',
      // getDiary : base + '/diary',
      parseText: 'http://111.230.24.245/parsetext'
    token:'',
    baseURL: 'http://localhost:8000/',
    api: {
      login: '',
      // getDiarys : base + '/diarys',
      // getDiary : base + '/diary',
      uploadImage: '',
      parseText: ''
    }
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 清除本地 token
    // wx.removeStorageSync("token")
    this.initAppData()
    this.checkToken()
  },
  initAppData: function(){
    this.globalData.api.login = this.globalData.baseURL + 'login'
    this.globalData.api.uploadImage = this.globalData.baseURL + 'upload'
    this.globalData.api.parseText = this.globalData.baseURL + 'parsetext'
  },
  login: function (callback){
    wx.login({
      success: (res)=> {
        wx.request({
          url: this.globalData.api.login,
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res)=>{
            wx.setStorageSync('token', res.data.token)
            callback()
          }
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  checkToken: function(){
    let token = wx.getStorageSync("token") || null
    wx.checkSession({
      success: (res)=> {
        if(token == null){
          this.login(()=>{
            this.globalData.token = wx.getStorageSync("token")
          }) 
        }else{
          this.globalData.token = wx.getStorageSync("token")
        }
      },
      fail: (res) => {
        this.login(() => {
          this.globalData.token = wx.getStorageSync("token")
        }) 
      },
      complete: (res)=> {
      },
    })
  },
  relogin: ()=> {
    let app = getApp()
    wx.login({
      success: (res) => {
        wx.request({
          url: app.globalData.api.login,
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res) => {
            wx.setStorageSync('token', res.data.token)
            app.globalData.token = wx.getStorageSync("token")
          }
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if(res.code){
            wx.request({
              url: '',
              data: {
                code: res.code,
              }
            })
          } else {
            console.log('登陸失敗！' + res.errMag)
          }
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
})