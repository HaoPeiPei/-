var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../../../utils/requst.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
      {
        "left_icon": "../../../images/back-b.png",
        "title_text": "订单详情",
        "right_icon": "../../../images/dh-b.png",
      },
    state: '',
    coupon: '',
    OrderMain: '',
    orderId: '',
    OrderFlightInfos: '',
    OrderPassengerInfos: '',
    ind: ''
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options.orderId);
    var Order = _this.data.Order;
    var orderId = options.orderId;
    _this.setData({
      orderId: orderId
    });
    var url = "/weixin/jctnew/ashx/service.ashx";
    var params = {
      orderId: orderId,
      action: "getorderbyid"
    }
    httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
      console.log(res);
      if (res.Success) {
        var data = JSON.parse(res.Data);
        var ind = data.OrderFlightInfos.length;
        _this.setData({
          OrderMain: data.OrderMain,
          OrderFlightInfos: data.OrderFlightInfos[0],
          OrderPassengerInfos: data.OrderPassengerInfos,
          ind: ind
        });
      }
    });
  },
  //生成微信支付参数
  createPayPara() {
  var that = this;
  if (this.data.orderId != null && this.data.orderId != "") {
      wx.showLoading({
          title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/service.ashx', { action: "createwxpaypara", orderId: orderId } , "POST",function(res){
          wx.hideLoading()
          if (res.Success) {
              var parameObj = JSON.parse(res.Data);
              that.jsApiCall(parameObj, orderId);
          } else {
              wx.showToast({
                  title: '创建支付参数失败,请联系客服',
                  icon: 'none'
              });
          }
      });
  }
},
//调用微信JS api 支付
jsApiCall(params, orderId) {
  var that = this;
  wx.requestPayment(
      {
      'timeStamp': params.timeStamp,
      'nonceStr': params.nonceStr,
      'package': params.package,
      'signType': params.signType,
      'paySign': params.paySign ,
      'success':function(res){
          if (res.err_msg == "get_brand_wcpay_request:ok") {
              that.payOrder(orderId);
          }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
              wx.showModal({
                  title: "温馨提示", 
                  content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                  success(res) {
                    if (res.confirm) {
                    } else if (res.cancel) {
                      that.jsApiCall(params, orderId);
                    }
                  }
              });
          }else {
              wx.showToast({
                  title: '支付失败!',
                  icon: 'none'
              });
          }
      },
      'fail':function(res){
          wx.showToast({
              title: '支付失败!',
              icon: 'none'
          });
      }
  });
},
//支付的订单
payOrder(orderId){
  var that = this;
    wx.showLoading({
        title: '数据加载中...',
    });
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/service.ashx', { action: "pay", orderId: orderId, status: "1" }, "POST",function(res){
        wx.hideLoading()
        if (res.Success) {
            wx.showToast({
                title: res.Message || '支付成功',
                icon: 'none'
            });
        } else {
            wx.showToast({
                title: res.Message,
                icon: 'none'
            });
        }
    });
  },
  //取消订单
  bindCancelOrder: function () {
    var orderId = this.data.orderId;
    wx.showModal({
      title: '温馨提示',
      content: '您确定取消未完成支付的订单吗?',
      success: function (res) {
        if (res.confirm) {
          var memberId = app.globalData.memberId;
          var action = "cancelorder";
          var url = "/weixin/jctnew/ashx/service.ashx"
          var params = {
            memberId: memberId,
            action: action,
            orderId: orderId
          }
          httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
            if (res.Success) {
              wx.navigateTo({
                url: '../fwdd',
              })
            }else {
              wx.showToast({
                title: res.Message,
                icon: 'none'
              })
            }
          });
        } 
      }
    })
  },
  //再来一单
  bindReturnIndex: function () {
    wx.reLaunch({
      url: '../../../index/index'
    })
  },
  //申请退款
  bindApplyRefund: function () {
    var orderId = this.data.orderId;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要申请退款?审核通过后退款金额将会在1至3个工作日退还至您账户。',
      success: function (res) {
        if (res.confirm) {
          var memberId = app.globalData.memberId;
          var action = "refund";
          var url = "/weixin/jctnew/ashx/service.ashx"
          var params = {
            memberId: memberId,
            action: action,
            orderId: orderId
          }
          httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
            if (res.Success) {
              wx.navigateTo({
                url: '../fwdd',
              })
            }else {
              wx.showToast({
                title: res.Message,
                icon: 'none'
              })
            }
          });
        } 
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