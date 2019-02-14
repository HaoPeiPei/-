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
    invitationCode: '',
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  //发送验证码
  sendVerify(){
    if (wait == 120) {
      var params = {
        action: "exists", 
        mobile: this.data.mobile
      };
      wx.showLoading({
        title: '加载中',
      });
      httpRequst.HttpRequst(true, url, params,"POST",function(res){
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
    if (wait == 0) {
      this.setData({
        waitStyle: 'c-bg-f4393c',
        waitMsg: '发送验证码',
        wait: 120,
      });
    } else {
      this.setData({
        waitStyle: 'c-bg-ccc',
        waitMsg: '发送验证码(' + wait + ')',
        wait: wait--,
      });
      setTimeout(function () {
            time(o)
        },
      000);
    }
  },
  //注册
  formSubmit:function(e){
    var _this= this;
    var mobile = e.detail.value.mobile;
    var verifyCode = e.detail.value.verifyCode;
    var invitation = e.detail.value.invitation;
    if (!checkMobile(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none',
      });
      return false;
    }
    else if (!checkVerify(verifyCode)) {
      wx.showToast({
        title: '验证码应为6位数字!',
        icon: 'none',
      });
      return false;
    }
    else if (invitation != "" && !checkInvitCode(invitation)) {
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
      httpRequst.HttpRequst(true, "weixin/miniprogram/ashx/login.ashx", params,"POST",function(res){
        if (!checkMobile()) {
          layer.msg("请输入正确的手机号!");
          return false;
        }
        else if (!checkVerify()) {
            layer.msg("验证码应为6位数字!");
            return false;
        }
        else if ($.trim($(".invitation").val()) != "" && !checkInvitCode()) {
                layer.msg("请输入正确的邀请码!");
                return false;
        } else {
          wx.showLoading();
          $.ajax({
              url: "/weixin/jctnew/ashx/login.ashx",
              type: "post",
              data: {
                  action: "register",
                  mobile: $(".mobile").val(),
                  verifyCode: $(".verifyCode").val(),
                  invitCode: $(".invitation").val(),
                  openId: openId,
                  unionId: unionId
              },
              success: function(data) {
                  var obj = JSON.parse(data);
                  layer.close(load);
                  layer.alert(obj.Message, function (index) {
                      if (obj.Success) {
                          if (obj.Data == "2") {
                            wx.navigateTo({
                              url: '/grzx'
                            })
                              window.location = "../Preferential/WatchUs.aspx";
                          } else {
                              window.location = returnUrl;
                          }
                          //window.location = returnUrl;
                      } else {
                          window.location.reload();
                      }
                  });
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  layer.close(load);
              }
          });
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
    initData(options);
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