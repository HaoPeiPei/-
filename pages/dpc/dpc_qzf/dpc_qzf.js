// pages/dpc/dpc_qzf/dpc_qzf.js
var app = getApp();
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst");
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
    ddxq:
    [
      { "title": "接车时间", "dataStart": "2017-09-13 19:30:00"},
      { "title": "取车时间", "dataStart": "2017-09-18 21:30:00"},
      { "title": "汇合地点", "dataStart": "深圳宝安机场T3航站楼出发5号门" },
      { "title": "泊车天数", "dataStart": "5天" },
      { "title": "联系人", "dataStart": "周琦"},
      { "title": "联系电话", "dataStart": "159 8876 2000"},
    ],
    clxx:
    [
      { "title": "爱车车牌", "dataVehicle": "粤B33027" },
      { "title": "爱车型号", "dataVehicle": "奥迪A6" },
      { "title": "爱车颜色", "dataVehicle": "黑色" },
    ],
    imgRoot: imgRoot,
    ddxqsStart:[],
    arrayTitle:[],
    arrays:[],
    orderId: "",
    order: {},
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
  //初始化参数
  initData(options){
    var orderId = options.orderId;
    if(orderId == ''){
      wx.showToast({
        title: '未获取到订单号'
      });
    }else{
      this.setData({
        orderId
      });
      this.loadOrder();
    }
  },
  //加载订单
  loadOrder(){
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "getorder", 
      orderId: this.data.orderId, 
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/valet.ashx", param, "POST",res => {
      wx.hideLoading();
      var obj = res;
      if (obj.Success) {
        var order = JSON.parse(obj.Data);
        that.setData({
          order: Object.assign(that.data.order,order,{
            order_status: that.formatOrderStatus(order.order_status)
          })
        });
      }
      else {
        wx.showToast({
          title: obj.ErrorMsg,
          icon: 'none'
        });
        return false;
      }
    });
  },
  //格式化订单状态
  formatOrderStatus(orderStatus) {
    if (orderStatus == "0") {
        return "待支付";
    } else if (orderStatus == "1") {
        return "已支付";
    } else if (orderStatus == "2") {
        return "已预订";
    } else if (orderStatus == "3") {
        return "申请退款";
    } else if (orderStatus == "4") {
        return "退款中";
    } else if (orderStatus == "5") {
        return "已退款";
    } else if (orderStatus == "6") {
        return "已拒绝";
    } else if (orderStatus == "7") {
        return "已取消";
    } else {
        return "其他";
    }
  },
  //取消订单
  cancelOrder(orderId) {
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "cancel", 
      orderId: this.data.orderId, 
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/valet.ashx", param, "POST",res => {
      wx.hideLoading();
      var obj = res;
      if (obj.Success) {
        wx.showToast({
          title: "取消订单成功",
          icon: 'none'
        });
        wx.navigateTo({
          url: "../../ddxq/dbcdd/dbcdd",         //跳转订单管理
        });
      }
      else {
        wx.showToast({
          title: "取消订单失败请联系客服",
          icon: 'none'
        });
        return false;
      }
    });
  },
  //立即支付
  bindZfChange(){
    var price = this.data.order.pay_amount_due;
    var orderId = this.data.orderId;
    if (parseInt(price) > 0) {
        this.createPayPara(orderId);
    } else {
        this.payOrder(orderId);
    }
  },
  //支付订单 
  payOrder(orderId){
    var that = this;
    if (orderId != null && orderId != "") {
        wx.showLoading({
            title: '数据加载中...',
        });
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/valet.ashx', { action: "createwxpaypara", orderId: orderId, openId: app.globalData.openId  } , "POST",function(res){
            wx.hideLoading()
            if (res.Success) {
              wx.showToast({
                title: '支付成功',
                icon: 'none'
            });
            wx.navigateTo({
              url: '../../ddxq/dbcdd/dbcdd'
            });
            } else {
                wx.showToast({
                    title: res.Messagge,
                    icon: 'none'
                });
            }
        });
    }
  },
  //生成微信支付参数
  createPayPara(orderId) {
    var that = this;
    if (orderId != null && orderId != "") {
        wx.showLoading({
            title: '数据加载中...',
        });
        httpRequst.HttpRequst(true, '/weixin/miniprogram/ashx/valet.ashx', { action: "createwxpaypara", orderId: orderId } , "POST",function(res){
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
              },1000);
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
                      wx.navigateTo({
                        url: '../../ddxq/dbcdd/dbcdd'
                      })
                    } else if (res.cancel) {
                      that.jsApiCall(params, orderId);
                    }
                  }
              });
            }else {
              wx.showModal({
                title: "温馨提示", 
                content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../../ddxq/dbcdd/dbcdd'
                    })
                  } else if (res.cancel) {
                    that.jsApiCall(params, orderId);
                  }
                }
            });
            }
        },
        'fail':function(res){
          wx.showModal({
            title: "温馨提示", 
            content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../ddxq/dbcdd/dbcdd'
                })
              } else if (res.cancel) {
                that.jsApiCall(params, orderId);
              }
            }
        });
        }
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