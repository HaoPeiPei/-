//valet.js
var app = getApp();
var imgRoot = app.globalData.imgRoot;
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../../utils/requst.js");
Page({
  data:{
    header_text: {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "充值",
      "right_icon": imgRoot+"/images/dh-b.png"
    },
    imgRoot: wwwRoot+"/weixin/jctnew/",
    rechargeAmount: 0
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
  //选择充值金额
  selectRechargeAmount(e){
    var rechargeAmount = e.currentTarget.dataset.rechargeamount;
    console.log(rechargeAmount);
    this.setData({
      rechargeAmount
    });
  },
  //立即充值
  promptlyRecharge(){
    if (this.data.rechargeAmount > 0) {
      this.createPayPara();
    } else {
        layer.msg('请选择充值金额!');
    }
  },
  //生成微信支付参数
  createPayPara() {
    var that = this;
    var param = {
      action: "createwxpaypara",
      memberId: app.globalData.memberId,
      amount: this.data.rechargeAmount
    }
    httpRequst.HttpRequst(true, 'weixin/miniprogram/ashx/wallet.ashx', param , "POST",res =>{
      if (res.Success) {
        var parameObj = JSON.parse(res.Data);
        var orderId = res.Message;
        that.jsApiCall(parameObj, orderId);
      } else {
        wx.showToast({
          title: '创建支付参数失败,请联系客服',
          icon: 'none'
        });
      }
    });
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
              content: "您的充值还未完成支付，请确认是否取消支付?",
              success(res) {
                  if (res.confirm) {
                      wx.showToast({
                        title: "支付已取消",
                        icon: none
                      })
                  } else if (res.cancel) {
                      that.jsApiCall(params, orderId);
                  }
              }
            });
          }else {
            wx.showModal({
              title: "温馨提示", 
              content: "您的充值还未完成支付，请确认是否取消支付?",
              success(res) {
                  if (res.confirm) {
                    wx.showToast({
                      title: "支付已取消",
                      icon: none
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
          content: "您的充值还未完成支付，请确认是否取消支付?",
          success(res) {
              if (res.confirm) {
                wx.showToast({
                  title: "支付已取消",
                  icon: none
                })
              } else if (res.cancel) {
                that.jsApiCall(params, orderId);
              }
          }
        });
      }
    })
  },
  //支付的订单
  payOrder(orderId){
    var param = { 
      action: "recharge", 
      orderId: orderId, 
      memberId: app.globalData.memberId,
    }
    httpRequst.HttpRequst(true, 'weixin/jctnew/ashx/wallet.ashx', param, "POST", res => {
        if (res.Success) {
            wx.showToast({
                title: res.Message || '支付成功',
                icon: 'none'
            });
            wx.navigateTo({
              url: '../index',
            })
        } else {
            wx.showToast({
                title: res.Message || "充值发生异常,请联系客服",
                icon: 'none'
            });
        }
    });
},
  onLoad:function(options){
    // 生命周期函数--监听页面加载
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  }
})