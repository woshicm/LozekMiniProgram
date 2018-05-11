var app = getApp()

Page({
  data: {
    today: {},
    //時間軸
    diaryData: [{
      aDay: [{
      }],
      date:[2018,5,8,'Wed']
    }
    ],

    //導航抽屜
    userInfo: {},
    check: false,   //是否触发滑动操作
    state: 0,    //0:初始状态 1:菜单弹出中状态 2:菜单弹入状态中 3:菜单弹出状态
    firstTouchX: 0,  //首次触摸X坐标值
    touchCheckX: 40,  //触发滑动的触摸X
    moveX: 0,   // 滑动操作横向的移动距离
    maxMoveX: wx.getSystemInfoSync().windowWidth - 120, //抽屉菜单最大移动距离
    lastTranlateX: 0,  //上次动画效果的平移距离，用于校准left值
    startTime: 0,
    endTime: 0,
  },
  //導航抽屜
  drawerMenuMoveData: {
  },
  onMainPageTouchstart: function (e) {
    var data = this.data;
    var clientX = e.touches[0].clientX;
    data.startTime = e.timeStamp;
    //初识状态
    if (data.state === 0) {
      if (clientX <= data.touchCheckX) {
        data.check = true;
        data.state = 1;
        data.firstTouchX = clientX;
      }
    }
    //菜单弹出状态
    else if (data.state === 3) {
      if (clientX >= 0) {
        data.check = true;
        data.state = 2;
        data.firstTouchX = clientX;
      }
    }
  },
  onMainPageTouchmove: function (e) {
    var data = this.data;
    var pixelRatio = wx.getSystemInfoSync().pixelRatio;
    if (data.check) {
      var mainPageLeft = 0, drawerMenuLeft = 0;
      var moveX = e.touches[0].clientX - data.firstTouchX;
      if (data.state === 1) {
        //处理边界状态
        if (moveX < 0) {
          moveX = 0;
        }
        if (moveX > data.maxMoveX) {
          moveX = data.maxMoveX;
        }
        if (moveX >= 0 && moveX <= data.maxMoveX) {
          data.moveX = moveX;
          moveX = moveX - data.lastTranlateX;
          //px转为rpx
          moveX = moveX * pixelRatio;
          mainPageLeft = moveX;
          drawerMenuLeft = -580 + moveX;
        }
      }
      else if (data.state === 2) {
        //处理边界状态
        if (moveX > 0) {
          moveX = 0;
        }
        if (moveX < -data.maxMoveX) {
          moveX = -data.maxMoveX;
        }
        if (moveX <= 0 && moveX >= -data.maxMoveX) {
          data.moveX = moveX;
          moveX = moveX - data.lastTranlateX;
          //px转为rpx
          moveX = moveX * pixelRatio;
          var maxMoveX = data.maxMoveX * pixelRatio;
          mainPageLeft = maxMoveX + moveX;
          drawerMenuLeft = maxMoveX - 580 + moveX;
        }
      }
      this.setData({
        mainPageLeft: mainPageLeft,
        drawerMenuLeft: drawerMenuLeft
      });
    }
  },
  onMainPageTouchend: function (e) {
    var data = this.data;
    if (!data.check) {
      return;
    }
    data.endTime = e.timeStamp;
    data.check = false;
    data.firstTouchX = 0;
    var moveX = data.moveX;
    data.moveX = 0;
    var animation = wx.createAnimation({
      duration: 250,
      timingFunction: 'ease'});
    var translateX = 0;
    var mainPageLeft = 0;
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    if (data.state === 1) {
      if (moveX === 0 || moveX === data.maxMoveX) {
        data.state = (moveX === 0) ? 0 : 3;
        return;
      }
      mainPageLeft = moveX;
      //滑动距离是否超过窗口宽度一半
      if (mainPageLeft > (windowWidth / 3) || data.endTime - data.startTime < 200) {
        translateX = data.maxMoveX - moveX;
        data.state = 3;
      }
      else {
        translateX = -moveX;
        data.state = 0;
      }
    }
    else if (data.state === 2) {
      if (moveX === 0 || moveX === -data.maxMoveX) {
        data.state = (moveX === 0) ? 3 : 0;
        return;
      }
      //滑动距离是否超过窗口宽度一半
      mainPageLeft = data.maxMoveX + moveX
      if (mainPageLeft > (windowWidth / 3)) {
        translateX = -moveX;
        data.state = 3;
      }
      else {
        translateX = -mainPageLeft;
        data.state = 0;
      }
    }
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },
  onMainPageTap: function (e) {
    var data = this.drawerMenuMoveData;
    if (data.state !== 3) {
      return;
    }
    data.state = 0;
    var translateX = -data.maxMoveX;
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    var animation = wx.createAnimation({ duration: 100 });
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },
  onPortraitTap: function(e){
    var data = this.drawerMenuMoveData;
    if(data.state !== 0){
      return;
    }
    var data = this.data;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });
    var translateX = data.maxMoveX;
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    data.state = 3;
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },
  onMainPageTap: function (e) {
    var data = this.data;
    if (data.state !== 3) {
      return;
    }
    data.state = 0;
    var translateX = -data.maxMoveX;
    translateX += data.lastTranlateX;
    data.lastTranlateX = translateX;
    var animation = wx.createAnimation({ duration: 100 });
    animation.translateX(translateX).step();
    this.setData({
      animationData: animation.export()
    });
  },

  //自定義函數部分
  getTodayDate: function () {
    var now = new Date();
    var yy = now.getFullYear();
    var mm = now.getMonth() + 1;
    var dd = now.getDate();
    var day = new Array();
    day[0] = "星期日";
    day[1] = "星期一";
    day[2] = "星期二";
    day[3] = "星期三";
    day[4] = "星期四";
    day[5] = "星期五";
    day[6] = "星期六";
    var array = [yy, mm, dd, day[now.getDay()]];
    return array;
  },

  onLoad:  function(options) {
    var today = this.getTodayDate();
    // console.log(today);
    this.setData({
      today: today,
    });
    // console.log(this);
  },
  
})