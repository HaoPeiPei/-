// pages/logIndex/logIndex.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
        left_icon: imgRoot+"/images/back-f.png",
        title_text:"登陆",
        right_icon:"",
        background_url: imgRoot+"/images/login_bg.png"
    },
    imgRoot: imgRoot,
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  formSubmit:function(e){
    var _this= this;
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    if(this.check(mobile, password)){
      var params = {
        mobile: mobile,
        password: password,
        action: 'login',
        openId: app.globalData.openId,
        unionid: app.globalData.unionid
      };
      wx.showLoading();
      httpRequst.HttpRequst(true, "/weixin/jctnew/ashx/login.ashx", params,"POST",function(res){
        wx.hideLoading();
        if(res.Success > 0){
          wx.navigateBack({
            delta: 1
          })
        };
      }); 
    }
  },
  //验证
  check(mobile, password) {
    if (!mobileReg.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      });
      return false;
    }
    if (password == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
      });
      return false;
    }
    return true;
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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