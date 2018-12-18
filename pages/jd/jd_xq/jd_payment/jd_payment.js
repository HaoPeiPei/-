// pages/jd/jd_xq/jd_payment/jd_payment.js
var httpRequst = require("../../../../utils/requst");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "深圳机场大酒店",
      "right_icon": "../../../images/dh-b.png",
    },
    start_date: "",
    end_date: "",
    number_rooms:[1,2,3,4,5,6,7,8,9,10],
    indexs:1,
    inBind:false,
    roomId: 0,
    hotelName: '',
    hotelRoom: {},
    bookInfo: {},
  },
  bindDateChange_1:function(e){
    var values_1 = e.detail.value;
    this.setData({
      values_1: values_1,
    })
  },
  bindDateChange_2: function (e) {
    var values_2 = e.detail.value;
    this.setData({
      values_2: values_2
    })
  },
  bindLengChange:function(e){
    var indexs = e.currentTarget.dataset.indexs;
    this.setData({
      indexs: indexs
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
    var roomId = options.roomId;
    var hotelName = options.hotelName;
    this.setData({
      roomId: roomId,
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