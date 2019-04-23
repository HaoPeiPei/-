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
              let encryptedData = res.encryptedData;
              let iv = res.iv;
              let userInfo = res.userInfo;
              app.globalData.userInfo= userInfo;
              that.getOpenId(encryptedData, iv);
            },
            fail:function(){
              console.log("失败");
            }
          });
        }
      }
    })
  },
  //点击授权
  bindGetUserInfo:function (e) {
    var that = this;
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    let userInfo = e.detail.userInfo;
    app.globalData.userInfo= userInfo;
    that.getOpenId(encryptedData, iv);
  },
  //获取openid
  getOpenId: function(encryptedData, iv) {
    var that = this;  
    wx.login({
      success:function(res){
        var code = res.code;
        wx.request({
          url: app.globalData.wwwRoot +"/weixin/miniprogram/ashx/user.ashx",
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
          success:function(res){
            if(res.statusCode == 200 && res.data.Success){
              var data = JSON.parse(res.data.Data);
              app.globalData.unionid= data.unionId;
              app.globalData.openId= data.openId;
              that.getUserInfo()
            }
          }
        })
      }
    })
  },
  //获取用户信息
  getUserInfo: function(){
    var that = this;
    wx.request({
      url: app.globalData.wwwRoot +'/weixin/jctnew/ashx/user.ashx?action=getUserInfo&UnionId='+app.globalData.unionid,
      method: "get",
      success: res => {
        if(res.statusCode == 200 && res.data.Success){
          var resDate = JSON.parse(res.data.Data);
          app.globalData.memberId = resDate.id;
          app.globalData.unionid= resDate.UnionId;
          //app.globalData.openId= resDate.openid;
          app.globalData.user = resDate;
        }
        wx.switchTab({
          url: '/pages/index/index',
        })
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