// pages/ddxq/fwdd/fwdd.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../../utils/requst.js");
Page({

  /**
   * 页面的初始数据     
   */
  data: {
    header_text: {
      "left_icon": "../../images/back-b.png",
      "title_text": "订单管理",
      "right_icon": "",
    },
    key: 0,
    orderList_1:[], //放置返回数据的数组
    isFromOrder: true, //用于判断orderList数组是不是空数组，默认为true，空的数组
    pageindex: 1, //设置加载的第几次，默认是第一次。
    pagesize: 5, //设置返回数据的个数
    status: '', //设置的条件
    memberId: '',
    action: 'orderPage',
    url: '/weixin/miniprogram/ashx/service.ashx',
  },
  loadingOrderList: function () {
    var _this = this;
    var url = _this.data.url;
    var pageindex = _this.data.pageindex;
    var pagesize = _this.data.pagesize;
    var status = _this.data.status;
    var memberId = app.globalData.memberId;
    var params = {
      "pageindex": pageindex,
      "pagesize": pagesize,
      "status": status,
      "memberId": memberId,
      "action": "orderPage"
    };
    httpRequst.HttpRequst(true, url, params, 'POST', function (res) {

      console.log(res);
      if (res.Data == '0') {
        wx.showLoading({
          title: '没有更多数据了...',
        });
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      } else if (res.Data == '-1') {
        wx.showLoading({
          title: '没有订单数据了...',
        });
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      } else {
        var messages = JSON.parse(res.Message);
        var orderList_1 = new Array();
        wx.showLoading({
          title: '加载数据中...',
        });
        for (var i = 0; i < messages.length; i++) {
          orderList_1.push(messages[i]);
        }
         console.log("orderList_1:" + orderList_1);
        _this.setData({
          orderList_1: _this.data.orderList_1.concat(orderList_1)
        });
        console.log("orderList_1"+_this.data.orderList_1);
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    });
  },
  bindBackChange: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  bindNavChange: function (e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      orderList_1: [],//清空数据
      status: status
    })
    this.loadingOrderList();
  },
  bianGetChange: function (e) {
    var orderId = e.currentTarget.dataset.id;
    var service_type_code = e.currentTarget.dataset.code;
    console.log(orderId);
    if (service_type_code =="GBT"){
      wx.navigateTo({
        url: 'gbt_orderDetails/gbt_orderDetails?orderId=' + orderId,
      })
    }else{
      wx.navigateTo({
        url: 'fwdd_details/fwdd_details?orderId=' + orderId,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var memberId = app.globalData.memberId;
    console.log(memberId);
    var url = 'weixin/miniprogram/ashx/service.ashx';
    var action = 'orderPage';
    var orderId = '201806071000001';
    var params = {
      memberId: memberId,
      action: action,
      orderId: orderId
    };
    console.log("memberId:" + memberId);
    httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
      //console.log(res);
      if (res.Success) {
        _this.loadingOrderList();
      } else {
        wx.navigateTo({
          url: '../../logIndex/logIndex?key=1',
        })
      }
    });
  },
  searchScrollLower: function () {  //上拉加载                         
    //console.log("上啦");
    var _this = this;
    var pageindex = _this.data.pageindex;
    _this.setData({
      pageindex: ++pageindex
    });
    //console.log("pageindex:" + pageindex);
    _this.loadingOrderList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})