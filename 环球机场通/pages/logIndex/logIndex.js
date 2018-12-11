// pages/logIndex/logIndex.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
        left_icon:"../images/back-f.png",
        title_text:"登陆",
        right_icon:"",
        background_url:"../images/login_bg.png"
    },
    key:'',
    
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:2
    })
  },
  formSubmit:function(e){
    var _this= this;
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    var url = "weixin/miniprogram/ashx/login.ashx";
    var action = "login";
    var unionid = "ojVAM1Bh4TS4VV_buGp7Io0_gSgU";
    var params = {
      mobile: mobile,
      password: password,
      action: action,
      unionid: unionid
    };
    httpRequst.HttpRequst(true, url, params,"POST",function(res){
      var Data = JSON.parse(res.Data);
      app.globalData.memberId = Data.id;
      console.log(res);
      var key = _this.data.key;
      if (key == 1) {
           wx.navigateTo({
             url: '../ddxq/fwdd/fwdd'
           })
      } else if (key == 2){
           wx.navigateTo({
             url: '../ddxq/jsjdd/jsjdd'
           })
      } else if (key == 3) {
        wx.navigateTo({
          url: '../ddxq/jpdd/jpdd'
        })
      } else if (key == 4) {
        wx.navigateTo({
          url: '../ddxq/dbcdd/dbcdd'
        })
      } else if (key == 5) {
        var id = _this.data.wycx_id;
        console.log("logo_id:" + id);
        wx.navigateTo({
          url: '../wycx/wycx?id='+id
        })
      }
    }); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var key = options.key;
    var wycx_id = options.id;
    console.log(wycx_id);
   _this.setData({
     key: key,
     wycx_id: wycx_id
   });
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