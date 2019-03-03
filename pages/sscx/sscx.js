// pages/sscx/sscx.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../utils/requst.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "imgUrls": [imgRoot+"/images/worryFree.png"],
      "left_icon": imgRoot+"/images/back-1.png",
      "title_text": "舒适出行",
      "right_icon": imgRoot+"/images/dh.png"
    },
    setMealPage:
    [
      { "setMeal_icon": imgRoot+"/images/yldjp_icon.png", "setMeal_title": "预留登机牌", "setMeal_cont": "提前办理登机牌，不排队安心登机"},
      { "setMeal_icon": imgRoot+"/images/sscj_icon.png", "setMeal_title": "舒适乘机", "setMeal_cont": "优选喜欢座位(保障经济舱前三排)"},
      { "setMeal_icon": imgRoot+"/images/xlfw_icon.png", "setMeal_title": "行李服务", "setMeal_cont": "专人协助办理行李打包,托运服务" },
      { "setMeal_icon": imgRoot+"/images/dpcfw_icon.png", "setMeal_title": "电瓶车服务", "setMeal_cont": "电瓶车从安检口送至登机口服务" },
      { "setMeal_icon": imgRoot+"/images/hkbz_icon.png", "setMeal_title": "航空保障", "setMeal_cont": "赠送价值70万元的航空y意外险一份" },
      { "setMeal_icon": imgRoot+"/images/yhydfw_icon.png", "setMeal_title": "迎候引导服务", "setMeal_cont": "专人出发厅迎候" },
    ],
    purchaseNotice:
    [
      { "title_text": "使用方法", "content_text":"深圳宝安国际机场四楼C岛岛尾西部航空柜台凭有效证件享受服务"},
      { "title_text": "服务时间", "content_text": "5:30--22:30;如航班延误，则至最后一班飞机起飞" },
      { "title_text": "行李托运", "content_text": "超重行李费用自理，如有贵重、易碎等物品需本人签署免责协议(工作人员恕不代办)" },
    ],
    imgRoot: imgRoot,
    inBind:true,
    id:'',
    key:""
  },
  //返回
  catchBackChange: function () {
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
  bindChageTk:function(e){
    var key = e.currentTarget.dataset.key
    var inBind = this.data.inBind
    this.setData({
      key: key,
      inBind: !inBind,
    })
  },
  catchDh:function(e){
    var key = e.currentTarget.dataset.key
    var inBind = this.data.inBind
    this.setData({
      key: key,
      inBind: !inBind
    })
  },
  bindChageBack:function(){
    var inBind = this.data.inBind
    this.setData({
      inBind: !inBind
    })
  },
  catchLjyy:function(){
    var _this = this;
    var id = _this.data.id;
    var url = "/weixin/jctnew/ashx/service.ashx";
    var memberId = app.globalData.memberId;
    if(memberId == ""){
      _this.toLogin();
    }else{
      var params = { action: "getservicebyid", id: id, memberId: memberId }; 
      httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
        if(res.Success){
          var obj = JSON.parse(res.Data);
          wx.navigateTo({
            url: 'xzhb/xzhb?id=' + obj.id + '&cityCode=' + obj.airport_code + '&serviceName=' + encodeURIComponent(obj.service_name),
          })
        }
      });
    }
  },
  //载入轮播图片
  loadServiceImg:function(id){
    var _this = this;
    var header_text = _this.data.header_text;
    var url = "/weixin/jctnew/ashx/service.ashx";
    var memberId = app.globalData.memberId;
    var params = { action: "getserviceimg", id: id, memberId: memberId };
    httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
      var obj = JSON.parse(res.Data);
      var img_url = [];
      for(var i =0 ;i<obj.length;i++){
        img_url.push(wwwRoot+obj[i].img_url);
      }
      var str = "header_text.imgUrls"
      _this.setData({
        [str]:img_url
      });
    });
  },
  //载入服务
  loadService:function(id){
    var _this = this;
    var url = "/weixin/jctnew/ashx/service.ashx";
    var memberId = app.globalData.memberId;
    var params = {action: "getservicebyid", id: id, memberId: memberId};
    httpRequst.HttpRequst(true, url, params, 'POST', function (res) {
      var obj = JSON.parse(res.Data);
      _this.setData({
        obj:obj
      });
    });
  },
  //初始化参数
  initData(options){
    var id = options.id;
    this.setData({
      id:id
    });
    this.loadServiceImg(id);
    this.loadService(id);
  },
  //检查memberID,无去登陆页面
  toLogin(){
    if(app.globalData.memberId == ''){
      wx.navigateTo({
        url: '../logIndex/logIndex',
      })
    }
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