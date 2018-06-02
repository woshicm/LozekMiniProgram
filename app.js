App({
  globalData: {
    /**
     * 設備參數
     */
    pixelRatio: wx.getSystemInfoSync().pixelRatio,
    token: '1',
    // baseURL: 'http://localhost:8000/',
    // baseURL: 'https://111.230.24.245/',
    baseURL: 'https://www.louzek.xyz/',
    getShareDiaryURL:'https://www.louzek.xyz:443/',
    api: {
      login: '',
      // getDiarys : base + '/diarys',
      saveDiary: '',
      getDiary: '',
      uploadImage: '',
      parseText: '',
      deleteDiary: '',
      getShareDiary: '',
    },
    windowWidth: '',
    windowHeight: '',
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

  initAppData: function () {
    this.globalData.api.login = this.globalData.baseURL + 'login'
    this.globalData.api.uploadImage = this.globalData.baseURL + 'upload'
    this.globalData.api.parseText = this.globalData.baseURL + 'parsetext'
    this.globalData.api.getDiary = this.globalData.baseURL + 'diary'
    this.globalData.api.saveDiary = this.globalData.baseURL + 'diary'
    this.globalData.api.deleteDiary = this.globalData.baseURL + 'delete_diary'
    this.globalData.api.getShareDiary = this.globalData.getShareDiaryURL + 'image'
    this.globalData.windowWidth = wx.getSystemInfoSync().windowWidth;
    this.globalData.windowHeight = wx.getSystemInfoSync().windowHeight;
  },

  login: function (callback) {
    wx.login({
      success: (res) => {
        wx.request({
          url: this.globalData.api.login,
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res) => {
            wx.setStorageSync('token', res.data.token)
            callback()
          }
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  checkToken: function () {
    let token = wx.getStorageSync("token") || null
    wx.checkSession({
      success: (res) => {
        if (token == null) {
          this.login(() => {
            this.globalData.token = wx.getStorageSync("token")
          })
        } else {
          // Check whether the token has expired.
          if (!this.tokenIsExpired())
            this.globalData.token = wx.getStorageSync("token")
          else
            this.login(() => {
              this.globalData.token = wx.getStorageSync("token")
            })
        }
      },
      fail: (res) => {
        this.login(() => {
          this.globalData.token = wx.getStorageSync("token")
        })
      },
      complete: (res) => {
      },
    })
  },
  relogin: (callback) => {
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
            callback()
          }
        })
      },
      fail: function (res) {
        console.log("login error: " + res)
      },
      complete: function (res) { },
    })
  },
  tokenIsExpired() {
    return true
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
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