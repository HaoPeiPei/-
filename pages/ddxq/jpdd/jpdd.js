// pages/ddxq/dbcdd/dbcdd.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text: {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "订单管理",
      "right_icon": "",
    },
    imgRoot: imgRoot, 
    single_return: 0,
    ErrCode: "",
    orderList_1: [], //放置返回数据的数组
    pageindex: 1, //设置加载的第几次，默认是第一次。
    pagesize: 5, //设置返回数据的个数
    status: '', //设置的条件
    memberId: '',
    action: 'orderPage',
    url: '/weixin/jctnew/ashx/airTicket.ashx',
  },
  catchBackChange: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  bindNavChange: function (e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      orderList_1: [],//清空数据
      pageindex: 1,
      status: status
    })
    this.loadingOrderList();
  },
  bianGetChange: function (e) {
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId);
    wx.navigateTo({
      url: 'ticket_details/ticket_details?orderId=' + orderId,
    })
  },
  //初始化参数
  initData(){
    this.loadingOrderList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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
      "userid": memberId,
      "action": "orderPage"
    };
    httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
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
        _this.setData({
          orderList_1: orderList_1
        });
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    });
  },
  searchScrollLower: function () {  //上拉加载    
    var _this = this;
    var pageindex = _this.data.pageindex;
    _this.setData({
      pageindex: ++pageindex
    });
    _this.loadingOrderList();
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