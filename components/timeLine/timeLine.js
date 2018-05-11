Component({
  properties: {
    isToday: {
      type: Boolean,
    },
    date: {
      type: String,
    },
    day: {
      type: String,
    }
  },

  data: {},

  attached: function(){
    var dateColor = '';
    var dayColor = '';
    var imageURL = '/images/image-Dot.svg';
    if (this.isToday) {
      dateColor = 'color: #f8bc71;';
      dayColor = 'color: #f7ce99;';
      imageURL = './images/image-todayDot.svg'
    }
    this.setData({
      dateColor: dateColor,
      dayColor: dayColor,
      imageURL: imageURL,
    }) 
  },

  method:{}
})