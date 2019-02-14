// pages/jd/jd_xq/jd_payment/jd_payment.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../../utils/requst");
var { addDate, getDateDiff, compareDate, returnDate } = require("../../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "深圳机场大酒店",
      "right_icon": imgRoot+"/images/dh-b.png",
    },
    imgRoot: imgRoot,
    start_date: "",
    end_date: "",
    number_rooms:[1,2,3,4,5,6,7,8,9,10],
    indexs:1,
    inBind:false,
    roomId: 0,
    hotelName: '',
    hotelRoom: {},
    bookInfo: {},
    selectPasseners: [{
      name: ''
    }],
    passener: {},
    totalPrice: 0,
    contactor: "",
    contactTel: "",
  },
  bindDateChange_1:function(e){
    var start_date = e.detail.value;
    this.setData({
      start_date
    })
  },
  bindDateChange_2: function (e) {
    var end_date = e.detail.value;
    this.setData({
      end_date
    })
  },
  bindLengChange:function(e){
    var inBind = this.data.inBind;
    var indexs = e.currentTarget.dataset.indexs;
    //如果选择的行人多于已选择的人数，就添加空值,反之就删除
    var selectCount = this.data.selectPasseners.length;
    var selectPasseners = this.data.selectPasseners;
    if (parseInt(indexs) > selectCount) {
        var i = selectCount;
        while (i < parseInt(indexs)) {
          selectPasseners.push(this.data.passener);
          i++;
        }
    } else if (selectCount > parseInt(indexs)) {
        var i = parseInt(numCount);
        while (i < selectCount) {
          selectPasseners.pop();
            i++;
        }
    }
    this.calPrice();
    this.setData({
      inBind: !inBind,
      indexs,
      selectPasseners,
    })
  },
  //计算价格
  calPrice() {
    var day_Count = getDateDiff(this.data.start_date, this.data.end_date, "day");
    var name_Count = this.data.selectPasseners.length;//人数
    var s_Price = this.data.hotelRoom.Price;
    var totalPrice = parseInt(name_Count) * parseInt(s_Price) * day_Count;
    this.setData({
      totalPrice
    });
  },
  //输入联系人，手机号
  bindinput(e){
    var id = e.currentTarget.id;
    this.setData({
      [id]: e.detail.value
    })
  },
  bindListChange:function(){
    var inBind = this.data.inBind;
    this.setData({
      inBind: !inBind
    })
  },
  //初始化数据
  initData(options){
    var roomId = options.id;
    var hotelName = decodeURIComponent(options.hotelName);
    var nowDate = new Date();
    var start_date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
    var end_date = addDate(start_date,1);
    this.setData({
      roomId: roomId,
      start_date: start_date,
      end_date: end_date,
      header_text: Object.assign(this.data.header_text,{
        title_text: hotelName,
      })
    });
    this.loadHotelRoom();
  },
  //加载酒店房间
  loadHotelRoom(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelRoomByID", id: this.data.roomId } , "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        var roomInfo = JSON.parse(res.Data);
        var bookInfo = Object.assign(this.data.bookInfo,{
          auto: roomInfo.auto,
          Hotel_ID: roomInfo.Hotel_ID,
        })
        this.setData({
          hotelRoom: roomInfo,
          bookInfo,
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  //添加入住人
  addPassengers(){
    wx.navigateTo({
      url: '../../addPassengers/addPassengers?selectPasseners='+JSON.stringify(this.data.selectPasseners),
    })
  },
  //预定
  book(){
    var start_date = this.data.start_date;
    var end_date = this.data.end_date;
    var contactor = this.data.contactor;
    var contactTel = this.data.contactTel;
    if (start_date == "") {
      wx.showToast({
        title: "请填写入店日期",
        icon: "none",
      });
      return false;
    }
    if (end_date == "") {
      wx.showToast({
        title: "请填写离店日期",
        icon: "none",
      });
      return false;
    }
    if (compareDate(returnDate(start_date), returnDate(end_date)) >= 0) {
      wx.showToast({
        title: "入店日期不能大于或等于离店日期！",
        icon: "none",
      });
      return false;
    }
    if (contactor == "") {
      wx.showToast({
        title: "请填写联系人",
        icon: "none",
      });
      return false;
    }
    if (contactTel == "") {
      wx.showToast({
        title: "请填写手机号码",
        icon: "none",
      });
      return false;
    }
    else {
        var myreg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
        if (!myreg.test(contactTel)) {
          wx.showToast({
            title: '请输入有效的手机号码！',
            icon: "none",
          });
          return false;
        }
    }
    var parssInfo = selectPasseners;
    for (var i = 0; i < parssInfo.length; i++) {
        if (parssInfo[i].name.length == 0) {
          wx.showToast({
            title: "请填写入住人！",
            icon: "none",
          });
          return false;
        }
        if (parssInfo[i].name.replace(/\//g, '').length > 28) {
          wx.showToast({
            title: "入住人长度大于28！",
            icon: "none",
          });
          return false;
        }
        if (parssInfo[i].name.indexOf(',') >= 0) {
          wx.showToast({
            title: "入住人不能包含,字符(逗号)！",
            icon: "none",
          });
          return false;
        }
    }
    this.setData({
      bookInfo: Object.assign({},this.data.bookInfo,{
        start_date,
        end_date,
        contactor,
        contactTel,
        userID,
        passenger: parssInfo,
      })
    });
    this.saveHotelOrder();
  },
  //保存酒店订单
  saveHotelOrder(){
    var param = {
      action: "saveHotelOrder", 
      hotelModel: JSON.stringify(this.data.bookInfo)
    }
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", param , "POST",res => {
      wx.hideLoading();
      var obj = JSON.parse(data);
      if (obj.Success) {
        window.location = "../payOrder/hotelOrder.aspx?orderID=" + obj.Data; //订单号
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})