// pages/grzx/yhj_details/yhj_details.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
      {
        "left_icon": "../../images/back-b.png",
        "title_text": "优惠卷",
        "right_icon": "",
      },
    isUsed: 0,
    yhi_gs: "",
    coupons: [],
    conttent_text:
      [
        { backImg_url: "../../images/wycx_yhj.png", backImg_url_1: "../../images/wycx_yhj_1.png", yhxm: "无忧出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "30", },
        { backImg_url: "../../images/sscx_yhj.png", backImg_url_1: "../../images/sscx_yhj_1.png", yhxm: "舒适出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "50", },
        { backImg_url: "../../images/dbc_yhj.png", backImg_url_1: "../../images/dbc_yhj_1.png", yhxm: "代泊车", start_item: "2017.08.19", end_item: "2017.09.27", price: "80", }
      ]
  },
  bindBackChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  bindTapChage: function (e) {
    var isUsed = e.currentTarget.dataset.isused;
    this.setData({
      isUsed: isUsed
    })
    this.loadCoupon();
  },
  //加载优惠券信息
  loadCoupon(){
    var _this = this;
    var params = {
      "action": "coupon",
      "openId": app.globalData.openId 
    }
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/preferential.ashx', params, 'POST', function (res) {
      if (res.Success) {
        if (res.Data.length > 0) {
          coupons = res.Data.map(item=>{
            var useType = this.getUseType(item);
            return Object.assign(item,{useType})
          });
        } 
        this.setData({
          coupons
        });
      } else {
        //todo 跳转到登陆页面
        wx.navigateTo({
          url: '../logIndex/logIndex'
        });
      }
    });
  },
  //获取优惠券使用状态
  getUseType(item){
    if (item.is_used == "0" && !item.isExpriy) {
      return "立即使用";
    }
    else if (item.is_used == "1") {
        return "已使用";
    } else if (item.isExpriy) {
        return "已过期";
    }
  },
  //初始化参数
  initData(){
    this.loadCoupon();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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