App({
  globalData: {
    token:'1',
    api: {
      login: 'http://111.230.24.245/login',
      parseText: 'http://111.23.24.245/parsetext'
    }
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 清除本地 token
    // wx.removeStorageSync("token")
    this.checkToken()
  },
  login: function(){
    wx.login({
      success: function(res) {
        wx.request({
          url: 'http://localhost:8000/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res)=>{
            // console.log(res.data)
            wx.setStorageSync('token', res.data)
          }
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  checkToken: function(){
    let token = wx.getStorageSync("token") || null
    if(token != null){
      wx.checkSession({
        success: function (res) {
          // console.log(res)
        },
        fail: (res) => {
          console.log(res.errMsg)
          this.login()
        },
        complete: function (res) {
          console.log("token valid")
        },
      })
    }else{
      this.login()
    }
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