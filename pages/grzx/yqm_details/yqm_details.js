// pages/grzx/yqm_details/yqm_details.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-f.png",
      "title_text": "我的邀请码",
      "right_icon": imgRoot+"/images/dh-b.png",
    },
    imgRoot: imgRoot,
    user: {},
    userInfo: {}
  },
  //返回
  catchBackChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
   //拨打电话
   telephone(e){
    var phoneNumber = e.currentTarget.dataset.phonenumber;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },
  bindNavChange: function () {
    wx.navigateTo({
      url: 'yqm_hdgz/yqm_hdgz',
    })
  },
  bindRegisterChange:function(){
    
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
        /* var user = JSON.parse(res.Data)
        var title = user.UserInfoJson.nickname + "为您推荐了环球机场通,速来领取200元出行大礼包吧!";
        var shareImg = user.UserInfoJson.headimgurl; 
        _this.setData({
          user: Object.assign(user, {
            title,
            shareImg,
          })
        })*/
        _this.setData({
          user: JSON.parse(res.Data)
        })
      } else {
        //todo 跳转到登陆页面
        wx.navigateTo({
          url: '/pages/logIndex/logIndex'
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