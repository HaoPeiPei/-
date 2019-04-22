// pages/grzx/grzx.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personal:
    [
      { 'src': imgRoot+'/images/yqm_icon_1.png', 'personalTitle': '邀请码', 'url':'/pages/grzx/yqm_details/yqm_details'},
      { 'src': imgRoot+'/images/yhj_icon_1.png', 'personalTitle': '优惠券', 'url': '/pages/grzx/yhj_details/yhj_details' },
      { 'src': imgRoot+'/images/zwkf_icon_1.png', 'personalTitle': '暂未开放', 'url': '' }
    ],
    imgRoot: imgRoot,
    login_state:'1', //0 未登录 1登录
    user_rights:"0",  //0 员工版 1用户版 
    inBind:false,
    user: {},
    userInfo: {}
  },
  bindEwmChange:function(){
    var inBind = this.data.inBind;
    this.setData({
      inBind: !inBind
    })
  },
  //加载用户信息
  loadUser(){
    var _this = this;
    var params = {
      "action": "get",
      "memberId": app.globalData.memberId
    }
    httpRequst.HttpRequst(true, '/weixin/miniprogram/ashx/preferential.ashx', params, 'POST', function (res) {
      if (res.Success) {
        _this.setData({
          user: JSON.parse(res.Data)
        })
      } else {
        //todo 跳转到登陆页面
        wx.navigateTo({
          url: '../logIndex/logIndex'
        });
      }
    });
  },
  //初始化参数
  initData(){
    this.loadUser();
    this.setData({
      userInfo: app.globalData.userInfo
    })
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
    this.initData();
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