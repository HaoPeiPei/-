// pages/gbt/gbtDetails/gbtDetails.js
var app = getApp();
var httpRequst = require("../../../utils/requst.js");
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "imgUrls": ["../../images/vipHall_1.png", "../../images/valet_bg.png", "../../images/vipHall_1.png"],
      "left_icon": "../../images/back-b.png",
      "title_text": "", "right_icon": "../../images/dh-b.png"
    },
    equipment:
    [
      { icon_url: "../../images/jbxxs_icon.png", icon_title: "嘉宾休息室" },
      { icon_url: "../../images/xc_icon.png", icon_title: "小吃" },
      { icon_url: "../../images/hbxsq_icon.png", icon_title: "航班显示器" },
      { icon_url: "../../images/ds_icon.png", icon_title: "电视" },
      { icon_url: "../../images/gbtxdj_icon.png", icon_title: "广播提醒登机" },
      { icon_url: "../../images/csyl_icon.png", icon_title: "茶水/饮料" },
      { icon_url: "../../images/tsj_icon.png", icon_title: "台式机" },
      { icon_url: "../../images/bgzz_icon.png", icon_title: "报刊杂志" },
    ],
    service_info: "",
    buy_info: "",
    refund_info: "",
    purchase_notice:
    [
      "使用方式：购买之后，可直接前往深圳机场T3航站楼C岛岛尾西部航空柜台凭二维码领取VIP贵宾厅使用卷，抵达指定休息室出示贵宾厅使用卷即可。",
      "登机提示：南航、深航、国航的航班无提醒登机提醒"
    ],
    serviceId: '',
    service: {},
  },
  //立即预约
  catchLjyy:function(){
    wx.navigateTo({
      url: 'qrdd/qrdd?id='+service.id,
    })
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  //初始化页面数据
  initData(options){
    var serviceId = options.id;
    this.setData({
      serviceId: serviceId
    });
    this.loadServiceImg(serviceId);
    this.loadService(serviceId);
  },
  //载入服务轮播图片
  loadServiceImg(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(true, "/weixin/jctnew/ashx/service.ashx", {action: "getserviceimg", id: this.data.serviceId } , "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        var data = JSON.parse(res.Data);
        var imgUrls = data.map(function(item){
          var imgUrl = app.globalData.imgRoot+item.img_url
          return imgUrl
        });
        this.setData({
          header_text: Object.assign({},this.data.header_text,{
            imgUrls
          })
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  },
  //载入服务
  loadService(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/service.ashx", {action: "getservicebyid", id: this.data.serviceId } , "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        var service = {};
        var service = JSON.parse(res.Data);
        var service_info = service["service_info"];
        var buy_info = service["buy_info"];
        var refund_info = service["refund_info"];
        this.setData({
          header_text: Object.assign({},this.data.header_text,{
          }),
          service: service,
          service_info: WxParse.wxParse('service_info', 'html', service_info, this, 5),
          buy_info: WxParse.wxParse('buy_info', 'html', buy_info, this, 5),
          refund_info: WxParse.wxParse('refund_info', 'html', refund_info, this, 5),
        });
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
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