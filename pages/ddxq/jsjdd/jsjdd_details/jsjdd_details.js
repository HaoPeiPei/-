var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../../utils/requst.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "订单详情",
      "right_icon": imgRoot+"/images/dh-b.png",
    },
    imgRoot: imgRoot,
    state: '',
    coupon: '',
    order:'',
    orderId:''
  },
  //返回
  catchBackChange: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  //拨打电话
  telephone(e){
    var phoneNumber = e.currentTarget.dataset.phonenumber;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },
  //加载订单详情
  loadOrderDetail(){
    var _this = this;
    var memberId = app.globalData.memberId;
    var params = {
      memberId: memberId,
      orderId: this.data.orderId,
      action:"getorder"
    }
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/rentcar.ashx', params, 'POST', function (res) {
      if(res.Success){
        var data = JSON.parse(res.Data);
        _this.setData({
          order:data
        });
      }
    });
  },
  //初始化书数据
  initData(options){
    var _this = this;
    var orderId = options.orderId;
    _this.setData({
      orderId: orderId
    });
    this.loadOrderDetail();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
    
  },
  //生成微信支付参数
  createPayPara() {
    var that = this;
    var orderId= this.data.orderId;
    if (orderId != null && orderId != "") {
      wx.showLoading({
          title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/miniprogram/ashx/rentcar.ashx', { action: "createwxpaypara", orderId: this.data.orderId } , "POST",function(res){
          wx.hideLoading()
          if (res.Success) {
              var parameObj = JSON.parse(res.Data);
              that.jsApiCall(parameObj, orderId);
          } else {
            setTimeout(()=>{
              wx.showToast({
                  title: '创建支付参数失败,请联系客服',
                  icon: 'none'
              });
            })
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
              wx.showToast({
                title: '支付失败!',
                icon: 'none'
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
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/rentcar.ashx', { action: "pay", orderId: orderId, status: "1" }, "POST",function(res){
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
  bindCancelOrder:function(){
    var orderId = this.data.orderId;
    wx.showModal({
      title: '温馨提示',
      content: '您确定取消未完成支付的订单吗?',
      success: function (res) {
        if (res.confirm) {
          var memberId = app.globalData.memberId;
          var action = "cancel";
          var url = "/weixin/jctnew/ashx/rentcar.ashx"
          var params={
            memberId: memberId,
            action: action,
            orderId: orderId
          }
          httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
            console.log(res);
            if (res.Success) {
              var data = JSON.parse(res.Data);
              wx.navigateTo({
                url: '../jsjdd',
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
  bindReturnIndex:function(){
   
    wx.reLaunch({
      url: '../../../index/index'
    })
  },
  //申请退款
  bindApplyRefund:function(){
    var orderId = this.data.orderId;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要申请退款?审核通过后退款金额将会在1至3个工作日退还至您账户。',
      success: function (res) {
        if (res.confirm) {
          var memberId = app.globalData.memberId;
          var action = "refund";
          var url = "/weixin/jctnew/ashx/rentcar.ashx"
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
                url: '../jsjdd',
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