// pages/jd/jd_xq/jd_xq.js
var app = getApp();
var httpRequst = require("../../../utils/requst");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "imgUrls": ["../../images/hotel_bg.png", "../../images/worryFree.png"],
      "left_icon": "../../images/back-f.png",
      "title_text": "",
      "right_icon": "../../images/dh-f.png"
    },
    hotelId: '',
    hotelInfo: {},
    hotelImg: [],
    hotelRooms: [],
    imgRoot: app.globalData.imgRoot,
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  bindHotelDetails:function(){
    wx.navigateTo({
      url:"jd_details/jd_details?hotelInfo="+JSON.stringify(this.data.hotelInfo)
    })
  },
  bianPayment:function(e){
    var auto = e.currentTarget.dataset.auto;
    var hotelRooms = this.data.hotelRooms;
    var selected = this.data.hotelRooms.filter(v=>v.auto == auto)[0];
    if(selected.Status == '0'){
      return
    }
    wx.navigateTo({
      url:"jd_payment/jd_payment?id="+selected.auto+"&hotelName="+encodeURIComponent(this.data.hotelInfo.Hotel_Name)
    })
  },
  //初始化数据
  initData(options){
    var hotelId = options.id;
    this.setData({
      hotelId
    });
    this.loadHotelImg();
    this.loadHotelInfo();
    this.loadHotelRooms();
  },
  //载入酒店轮播图片
  loadHotelImg(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelImg", hotelId: this.data.hotelId } , "POST",res=>{
      wx.hideLoading();
      if (res.Success) {
        var hotelImg = JSON.parse(res.Data);
        var imgUrls = [];
        for (let index = 0; index < hotelImg.length; index++) {
          if(hotelImg[index].Room_ID == "0"){
            imgUrls.push(app.globalData.imgRoot+hotelImg[index].PicUrl)
          }
        }
        this.setData({
          hotelImg,
          header_text: Object.assign({},this.data.header_text,{
            imgUrls
          })
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  //加载酒店房间
  loadHotelRooms(){
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelRoom", hotelId: this.data.hotelId } , "POST",res=>{
      wx.hideLoading();
      if (res.Success) {
        var hotelRooms = JSON.parse(res.Data);
        hotelRooms = hotelRooms.map(function(item){
          return Object.assign({}, item, {
            PicUrl: that.getRoomImg(item),
            Class: that.getClass(item),
          });
        })
        that.setData({
          hotelRooms
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  //加载酒店详情
  loadHotelInfo(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelInfo", hotelId: this.data.hotelId } , "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        this.setData({
          hotelInfo: JSON.parse(res.Data)
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  getRoomImg(item){
    var room = this.data.hotelImg.filter(v=>v.Room_ID == item.auto)[0];
    return app.globalData.imgRoot+(room.PicUrl||"/upload/hotel-default.png");
  },
  getClass(item){
    if (item.Status == "0") {
      return "btn c-bg-ccc c-fff c-align font-size-15";
  } else {
      return "btn c-bg-f4393c c-fff c-align font-size-15";
  }
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