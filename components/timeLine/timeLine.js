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
    timeLineHeight: {
      type: String,
      value: '',
    },
    timeLineTop: {
      type: String,
      value: '',
    },
  },

  data: {
    show: false,
    imageURL: '/images/image-Dot.svg',
  },

  attached: function(){
    if (this.data.isLast) {
      var date = this.data.date;
      var today = this.getTodayDate();
      var dateColor = '';
      var dayColor = '';
      var imageURL = '/images/image-Dot.svg';
      var show = false;
      if(today[0] === date[0] && today[1] === date[1] && today[2] === date[2]){
        dateColor = 'color: #f8bc71;';
        dayColor = 'color: #f7ce99;';
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