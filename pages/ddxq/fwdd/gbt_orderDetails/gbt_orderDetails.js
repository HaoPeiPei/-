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
        "right_icon": "",
      },
    state: '',
    coupon: '',
    OrderMain: '',
    orderId: '',
    OrderFlightInfos: '',
    OrderPassengerInfos: '',
    ind: ''
  },
  bindBackChange: function () {
    wx.navigateBack({
      delta: 1,
    })
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
          var url = "weixin/miniprogram/ashx/rentcar.ashx"
          var params = {
            memberId: memberId,
            action: action,
            orderId: orderId
          }
          httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
            console.log(res);
            if (res.Success) {
              var data = JSON.parse(res.Data);
              wx.navigateTo({
                url: '../fwdd',
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
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
          var url = "weixin/miniprogram/ashx/rentcar.ashx"
          var params = {
            memberId: memberId,
            action: action,
            orderId: orderId
          }
          httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
            console.log(res);
            if (res.Success) {
              var data = JSON.parse(res.Data);
              wx.navigateTo({
                url: '../fwdd',
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
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