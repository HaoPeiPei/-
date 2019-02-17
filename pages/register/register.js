// pages/register/register.js
//联系手机正则
var mobileReg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
//验证码正则
var regVerify = /^\d{6}$/;
//邀请码正则
var invitCodeReg = /^[0-9|a-z|A-Z]{3,8}$/;
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../utils/requst");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      left_icon: imgRoot+"/images/back-b.png",
      title_text: "注册",
      right_icon: "",
    },
    imgRoot: imgRoot,
    wait: 120,
    waitStyle: 'c-bg-ccc',
    waitMsg: '发送验证码',
    mobile: '',
    verifyCode: '',
    invitationCode: '',
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  //发送验证码
  sendVerify(){
    if (this.data.wait == 120) {
      var params = {
        action: "exists", 
        mobile: this.data.mobile
      };
      wx.showLoading({
        title: '加载中',
      });
      httpRequst.HttpRequst(true, "/weixin/miniprogram/ashx/login.ashx", params,"POST",function(res){
        debugger
        wx.hideLoading()
        wx.showToast({
          title: res.Message
        });
        if (res.Success) {
            time(0);
        }
      });
    }
  },
  //倒计时
  time(o) {
    var that = this;
    if (wait == 0) {
      that.setData({
        waitStyle: 'c-bg-f4393c',
        waitMsg: '发送验证码',
        wait: 120,
      });
    } else {
      that.setData({
        waitStyle: 'c-bg-ccc',
        waitMsg: '发送验证码(' + wait + ')',
        wait: wait--,
      });
      setTimeout(function () {
        that.time(o)
      },1000);
    }
  },
  //注册
  formSubmit:function(e){
    var _this= this;
    var mobile = e.detail.value.mobile;
    var verifyCode = e.detail.value.verifyCode;
    var invitation = '1234';
    //var invitation = e.detail.value.invitation;
    if (!this.checkMobile(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none',
      });
      return false;
    }
    else if (!this.checkVerify(verifyCode)) {
      wx.showToast({
        title: '验证码应为6位数字!',
        icon: 'none',
      });
      return false;
    }
    else if (invitation != "" && !this.checkInvitCode(invitation)) {
      wx.showToast({
        title: '请输入正确的邀请码!',
        icon: 'none',
      });
      return false;
    } else {
      var params = {
        action: 'register',
        mobile: mobile,
        verifyCode: verifyCode,
        invitation: invitation,
        openId: app.globalData.openId,
        unionid: app.globalData.unionid,
      };
      httpRequst.HttpRequst(true, "/weixin/miniprogram/ashx/login.ashx", params,"POST",function(res){
        if(res.Success){
          wx.navigateBack({
            delta: 1, 
          })
        }
      }); 
    }
  },
  checkMobile(mobile) {
    return mobileReg.test(mobile) ? true : false;
  },
  checkVerify(verifyCode) {
    return regVerify.test(verifyCode) ? true : false;
  },
  checkInvitCode(invitation) {
    return invitCodeReg.test(invitation) ? true : false;
  },
  //输入验证码，手机号
  bindinput(e){
    var id = e.currentTarget.id;
    this.setData({
      [id]: e.detail.value
    })
  },
  //初始化页面参数
  initData(options){
    var invitationCode = options.invitationCode;
    this.setData({
      invitationCode
    });
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