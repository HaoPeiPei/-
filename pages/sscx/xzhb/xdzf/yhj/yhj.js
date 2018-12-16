var app = getApp();
var httpRequst = require("../../../../../utils/requst");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../../images/back-b.png",
      "title_text": "优惠券",
      "right_icon": "../../../../images/dh-b.png"
    },
    key: 0,
    isUsed: 0,
    coupons: [],
    conttent_text:
    [
      { backImg_url: "../../../../images/wycx_yhj.png", backImg_url_1: "../../../../images/wycx_yhj_1.png", yhxm: "无忧出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "30",},
      { backImg_url: "../../../../images/sscx_yhj.png", backImg_url_1: "../../../../images/sscx_yhj_1.png", yhxm: "舒适出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "50",},
      { backImg_url: "../../../../images/dbc_yhj.png", backImg_url_1: "../../../../images/dbc_yhj_1.png", yhxm: "代泊车", start_item: "2017.08.19", end_item: "2017.09.27", price: "80",}
    ],

  },
  bindBackChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  //切换优惠券使用状态
  usedSelect: function (e) {
    var isUsed = e.currentTarget.dataset.isused;
    this.setData({
      isUsed
    });
    this.loadCoupon();
  },
  bindLjsyChange: function (e) {
    var price = e.currentTarget.dataset.price;
    var conttent_text = this.data.conttent_text;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      price: price
    })
    wx.navigateBack({
      delta:1
    })
  },
  //加载所有优惠券
  loadCoupon(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var param = {
      action: "getservicebyid",
      id: prevPage.data.service.serviceId,
      memberId: app.globalData.memberId,
      isUsed: this.data.isUsed,
    };
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/service.ashx", param, "POST",function(res){
      wx.hideLoading();
      var  coupons = [];
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
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
        wx.navigateTo({
          url: '../../../sscx/sscx',
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
  //选择优惠券
  select(e){
    var serviceTypeName = e.currentTarget.dataset.servicetypename;
    var coupons = this.data.coupons.filter(v=>v.servicetype_name==serviceTypeName) || [];
    if(coupons.length > 0){
      var coupon = coupons[0];
      if (coupon.is_used == "0" && !coupon.isExpriy) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.caculatePrice();
        prevPage.setData({
          coupon
        });
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var yhi_gs = options.yhi_gs;
    console.log(yhi_gs)
    var _this = this;
    _this.setData({
      yhi_gs: yhi_gs
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