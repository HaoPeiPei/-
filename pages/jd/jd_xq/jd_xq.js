// pages/jd/jd_xq/jd_xq.js
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
    hotelRooms:
    [
      { room_imgURL:"../../images/hhdrj_img.png", type_room: "豪华单人间", room_area: "26", room_floor: "2~8", room_price:"264"},
      { room_imgURL: "../../images/hhsrj_img.png", type_room: "豪华双人间", room_area: "26", room_floor: "2~8", room_price: "253" }, 
      { room_imgURL: "../../images/bzsrj_img.png", type_room: "标准双人间", room_area: "26", room_floor: "2~8", room_price: "214" }, 
    ],
    hotelId: '',
    hotelInfo: {},
    hotelImgs: '',
    hotelRooms: [],
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  bindHotelDetails:function(){
    wx.navigateTo({
      url: 'jd_details/jd_details?hotelInfo'=JSON.stringify(hotelInfo),
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
      url: "jd_payment/jd_payment?id="+selected.auto+"&hotelName="+encodeURIComponent(this.data.hotelInfo.Hotel_Name),
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
  },
  //载入酒店轮播图片
  loadHotelImg(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelByCityCode", hotelId: this.data.hotelId } , "POST",function(res){
      wx.hideLoading();
      if (res.Success) {
        var hotelImgs = res.Data;
        var imgUrls = [];
        for (let index = 0; index < hotelImgs.length; index++) {
          if(hotelImgs[index].Room_ID == "0"){
            imgUrls.push(hotelImgs[index].PicUrl)
          }
        }
        this.setData({
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
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelRoom", hotelId: this.data.hotelId } , "POST",function(res){
      wx.hideLoading();
      if (res.Success) {
        var hotelRooms = res.Data||[].map(function(item){
          return Object.assign({}, item, {
            RoomImg: getRoomImg(item),
          });
        })
        this.setData({
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
          hotelInfo: res.Data
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
    return hotelImg.filter(v=>v.Room_ID == item.auto)[0]||"/upload/hotel-default.png";
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