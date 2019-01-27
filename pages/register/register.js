// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      left_icon: "../images/back-b.png",
      title_text: "注册",
      right_icon: "",
    },
    wait: 120,
    waitStyle: 'c-bg-ccc',
    waitMsg: '发送验证码',
    mobile: '',
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:2
    })
  },
  //发送验证码
  verify(){
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
    var password = e.detail.value.password;
    var params = {
      action: 'register',
      mobile: this.data.mobile,
      password: this.data.password,
      verifyCode: this.data.verifyCode,
      invitCode: this.data.invitCode,
      openId: this.data.openId,
      unionid: this.data.unionid,
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