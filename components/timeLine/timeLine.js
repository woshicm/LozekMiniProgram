Component({
  properties: {
    isLast: {
      type: Boolean,
    },
    dash: {
      type: Boolean,
    },
    date: {
      type: Array,
    },
    status: {
      type: String,
      value: 'both',
    }
  },

  data: {
    show: false,
    imageURL: '/images/image-Dot.svg',
  },

  attached: function(){
    var timeLineHeight = 415;
    var todayTop = 280;
    var todayEraseHeight = 320;
    if(this.data.status == 'image_only'){
      timeLineHeight = 310;
      todayTop = 150;
      todayEraseHeight = 210;
    }
    else if(this.data.status == 'text_only'){
      timeLineHeight = 160;
      todayTop = 30;
      todayEraseHeight = 60;
    }
    if (this.data.isLast) {
      var date = this.data.date;
      var today = this.getTodayDate();
      var dateColor = '';
      var dayColor = '';
      var imageURL = '/images/image-Dot.svg';
      var show = false;
      if(today[0] === date[0] && today[1] === date[1] && today[2] === date[2]){
        dateColor = '#fb8c00';
        dayColor = '#f7d2a5';
        imageURL = '/images/image-todayDot.svg'
      } 
      else{
        show = true;
      }
      this.setData({
        dateColor: dateColor,
        dayColor: dayColor,
        show: show,
        imageURL: imageURL,
        today: today,
      })
    }
    this.setData({
      timeLineHeight: timeLineHeight,
      todayTop: todayTop,
      todayEraseHeight: todayEraseHeight,
    })
  },

  methods:{
    getTodayDate: function () {
      var now = new Date();
      var yy = now.getFullYear();
      var mm = now.getMonth() + 1;
      var dd = now.getDate();
      var day = new Array();
      day[0] = "Sun";
      day[1] = "Mon";
      day[2] = "Tue";
      day[3] = "Wed";
      day[4] = "Thur";
      day[5] = "Fri";
      day[6] = "Sat";
      var array = [yy, mm, dd, day[now.getDay()]];
      return array;
    },
  }
})