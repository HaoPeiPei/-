// pages/jd/jd.js
var app = getApp();
var httpRequst = require("../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../images/back-b.png",
      "title_text": "机场酒店",
      "right_icon": "../images/dh-b.png",
    },
    cityCode: "SZX",
    hotels: [],
  },
  book:function(e){
    var auto= e.currentTarget.dataset.auto;
    wx.navigateTo({
      url: 'jd_xq/jd_xq?id='+auto,
    })
  },
  //初始化数据
  initData(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/hotel.ashx", {action: "getHotelByCityCode", airport_code: this.data.cityCode } , "POST",function(res){
      wx.hideLoading();
      if (res.Success) {
        var hotels = res.Data||[].map(function(item){
          var level = getLevel(item);
          return Object.assign(item, {level});
        });
        this.setData({
          hotels
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  //
  getLevel(item){
    return "../images/hotel_level" + item.Rank + ".png";
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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