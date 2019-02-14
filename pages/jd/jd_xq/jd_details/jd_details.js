// pages/jd/jd_xq/jd_details/jd_details.js
var httpRequst = require("../../../../utils/requst");
var WxParse = require('../../../../wxParse/wxParse.js');
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "酒店详情",
      "right_icon": "",
    },
    hotel_facilities:
    [
      { fac_icon: imgRoot+"/images/tcc_icon.png", fac_name:"停车场"},
      { fac_icon: imgRoot+"/images/wiff_icon.png", fac_name: "WLFI" },
      { fac_icon: imgRoot+"/images/ct_icon.png", fac_name: "餐厅" },
      { fac_icon: imgRoot+"/images/js_icon.png", fac_name: "健身" },
    ],
    imgRoot: imgRoot,
    hotelInfo: {},
  },
  //初始化数据
  initData(options){
    this.loadHotelInfo(options.hotelId);
  },
  //加载酒店详情
  loadHotelInfo(hotelId){
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelInfo", hotelId: hotelId } , "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        var hotelInfo = JSON.parse(res.Data);
        var Hotel_Service = WxParse.wxParse('Hotel_Service', 'html', hotelInfo.Hotel_Service, that, 5);
        var Hotel_Content = WxParse.wxParse('Hotel_Content', 'html', hotelInfo.Hotel_Content, that, 5);
        var Hotel_Policy = WxParse.wxParse('Hotel_Policy', 'html', hotelInfo.Hotel_Policy, that, 5);
        var Traffic = WxParse.wxParse('Traffic', 'html', hotelInfo.Traffic, that, 5);
        that.setData({
          hotelInfo: hotelInfo,
          Hotel_Service: Hotel_Service,
          Hotel_Content: Hotel_Content,
          Hotel_Policy: Hotel_Policy,
          Traffic: Traffic,
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  bindBackChange:function(){
    wx.navigateBack({
      delta:1
    })
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