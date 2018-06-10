import { CacheInit} from "./common/cache.js";

App({
  globalData: {
    /**
     * 設備參數
     */
    pixelRatio: wx.getSystemInfoSync().pixelRatio,
    windowHeight: wx.getSystemInfoSync().windowHeight,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    token: '1',
    // baseURL: 'http://localhost:8000/',
    // baseURL: 'https://111.230.24.245/',
    baseURL: 'https://www.louzek.xyz/',
    getShareDiaryURL:'https://www.louzek.xyz:443/',
    api: {
      login: '',
      // getDiarys: base + '/diarys',
      saveDiary: '',
      getDiary: '',
      uploadImage: '',
      parseText: '',
      deleteDiary: '',
      getShareDiary: '',
      getFilter: '',
      saveFilteredDiary: '',
      getWeather: '',
      getWord: '',
      getLocationInfo: '',
      getTemplate: ''
    },
    windowWidth: '',
    windowHeight: '',
    /**
     * 用戶參數
     */
    userCurrentCityLatitude: '',
    userCurrentCityLongitude: '',
    weather: "",
    // 文字模板
    templates: [],
  },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 清除本地 token
    // wx.removeStorageSync("token")
    this.initAppData()
    CacheInit()
  },

  initAppData: function () {
    this.globalData.api.login = this.globalData.baseURL + 'login'
    this.globalData.api.uploadImage = this.globalData.baseURL + 'upload'
    this.globalData.api.parseText = this.globalData.baseURL + 'parsetext'
    this.globalData.api.getDiary = this.globalData.baseURL + 'diary'
    this.globalData.api.saveDiary = this.globalData.baseURL + 'diary'
    this.globalData.api.deleteDiary = this.globalData.baseURL + 'delete_diary'
    this.globalData.api.getFilter = this.globalData.baseURL + 'filter'
    this.globalData.api.getShareDiary = this.globalData.getShareDiaryURL + 'image'
    this.globalData.api.saveFilteredDiary = this.globalData.baseURL + 'upload_with_filter'
    this.globalData.api.getWeather = this.globalData.baseURL + 'get_weather'
    this.globalData.api.getWord = this.globalData.baseURL + 'get_word'
    this.globalData.api.getTemplate = this.globalData.baseURL + 'template'
    this.globalData.api.getLocationInfo = this.globalData.baseURL + 'get_location_info'
    this.globalData.windowWidth = wx.getSystemInfoSync().windowWidth;
    this.globalData.windowHeight = wx.getSystemInfoSync().windowHeight;
  }
})
