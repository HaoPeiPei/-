// pages/grzx/yhj_details/yhj_details.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
      {
        "left_icon": imgRoot+"/images/back-b.png",
        "title_text": "优惠卷",
        "right_icon": imgRoot+"/images/dh-b.png",
      },
    imgRoot: imgRoot,  
    isUsed: 0,
    yhi_gs: "",
    coupons: [],
    couponTip: '',
    conttent_text:
      [
        { backImg_url: imgRoot+"/images/wycx_yhj.png", backImg_url_1: imgRoot+"/images/wycx_yhj_1.png", yhxm: "无忧出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "30", },
        { backImg_url: imgRoot+"/images/sscx_yhj.png", backImg_url_1: imgRoot+"/images/sscx_yhj_1.png", yhxm: "舒适出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "50", },
        { backImg_url: imgRoot+"/images/dbc_yhj.png", backImg_url_1: imgRoot+"/images/dbc_yhj_1.png", yhxm: "代泊车", start_item: "2017.08.19", end_item: "2017.09.27", price: "80", }
      ]
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
    var isUsed = this.data.isUsed;
    var params = {
      "action": "coupon",
      "isUsed": this.data.isUsed,
      "openId": app.globalData.openId 
    }
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/preferential.ashx', params, 'POST', function (res) {
      if (res.Success) {
        if (res.Data == "") {
          var couponTip = '';
          if (isUsed == 1) {
            couponTip = "没有已使用的优惠券";
          } else {
            couponTip = "没有可用的优惠券";
          }
          _this.setData({
            couponTip,
            coupons: []
          });
      }else{
        var obj = JSON.parse(res.Data);
        if (obj.length > 0) {
          var  coupons = obj.map(item=>{
            var useType = _this.getUseType(item);
            return Object.assign(item,{useType})
          });
          _this.setData({
            coupons
          });
        } 
      } 
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