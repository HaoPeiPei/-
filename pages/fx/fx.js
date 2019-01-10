// pages/fx/fx.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discover: {},
    wwwRoot: wwwRoot,
    fx:
    [
      { 'src': '../images/1.png', 'fxTitle': '注册有礼', 'fxContent': '邀好友注册,各赢大奖'}
    ]
  },
  //加载发现数据
  loadDiscover(){
    var _this = this;
    var params = {
      "action": "get"
    }
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/discover.ashx', params, 'POST', function (res) {
      if (res.Success) {
        _this.setData({
          discover: JSON.parse(res.Data)
        });
      } else {
          wx.navigateBack({
            delta: 1
          })
      }
    });
  },
  //初始化页面数据
  initData(){
    this.loadDiscover();
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