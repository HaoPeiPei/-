// pages/login/login.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../utils/requst");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials:true,
            success: function (res) {
              that.getUserInfo();
              wx.switchTab({
                url: '../index/index',
              })
            },
            fail:function(){
              console.log("失败");
            }
          })
        }
      }
    })
  },
  bindGetUserInfo:function (e) {
    var that = this;
    console.log("userInfo:"+e.detail.userInfo);
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    wx.login({
      success:function(res){
        var code = res.code;
        that.getUserInfo();
        /* wx.request({
          url: "https://www.51jct.cn/weixin/ashx/user.ashx",
          data:
          {
            code:code,
            iv:iv,
            encryptedData: encryptedData,
            action: "getUserInfo"
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success:function(user_res){
            var data = JSON.parse(user_res.data.Data);
            console.log(data.openId)
          }
        }) */
      }
    })
  },
  //获取用户信息
  getUserInfo: function(){
    var that = this;
    wx.request({
      url: app.globalData.wwwRoot +'/weixin/jctnew/ashx/user.ashx?action=getUserInfo&openId='+app.globalData.openId,
      method: "get",
      success: res => {
        console.log(res);
        /* let statusCode = res.statusCode
        if (200 === statusCode) {
          that.globalData.openId == res.data.openid;
        } else {
          console.log('获取用户信息失败')
        } */
      }
    })
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