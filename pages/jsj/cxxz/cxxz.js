// pages/jsj/cxxz/cxxz.js
var app = getApp();
var httpRequst = require("../../../utils/requst");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../images/back-b.png",
      "title_text": "车型选择",
      "right_icon": "../../images/dh-b.png"
    },
    // 车型
    carModel:
    [
      { "imagUrl": "../../images/jingjixing.png", "tk_scopeOfUse": "锋范 伊兰特等同级车", "scopeOfUse": "经济型", "price": "43", "keyWord": ["经济", "实惠"] },
      { "imagUrl": "../../images/shangwuche.png", "tk_scopeOfUse": "别克GL8 奥德赛等同级车", "scopeOfUse": "商务型", "price": "46", "keyWord": ["舒适", "大空间"] },
      { "imagUrl": "../../images/haohuache.png", "tk_scopeOfUse": "奔驰 奥迪A6系列等同级车", "scopeOfUse": "豪华型", "price": "53", "keyWord": ["品味", "享受"] },
    ],
    rentCars: [],
    queryInfo: "",
    priceMark: '',
  },
  //返回
  bindBackChange: function (e) {
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
  //初始化数据
  initData(options){
    var queryInfo = decodeURIComponent(options.queryInfo);
    if(!!queryInfo){
      this.setData({
        queryInfo
      });
      this.loadRentCars();
    }
  },
  //获取车辆
  loadRentCars(){
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "query", 
      memberId: app.globalData.memberId,
      queryInfo: this.data.queryInfo
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/rentcar.ashx", param, "POST",res => {
      wx.hideLoading();
      var obj = res;
      if (obj.Success) {
          var rslt = JSON.parse(obj.Data);
          var priceMark = rslt.PriceMark;
          var rentCars = rslt.QueryResultList;
          rentCars = rentCars.map(function(item){
            var Img = that.getImg(item);
            var CarType = that.getCarType(item);
            var CarDesc = that.getCarDesc(item);
            var CarLabel = that.getCarLabel(item);
            var CarLabel1 = that.getCarLabel1(item);
            return Object.assign({}, item, {
              Img,
              CarType,
              CarDesc,
              CarLabel,
              CarLabel1,
            });
          });
          this.setData({
            priceMark,
            rentCars
          });
      } else {
        wx.showToast({
          title: obj.Message,
          icon: 'none'
        });
      };
    });
  },
  getImg(item){
    if (item.VehicleType == "1") {
      return "../../images/jingjixing.png";
    }
    else if (item.VehicleType == "2") {
        return "../../images/shangwuche.png";
    }
    else if (item.VehicleType == "3") {
        return "../../images/haohuache.png";
    }
  },
  getCarType(item) {
    if (item.VehicleType == "1") {
        return "经济型";
    }
    else if (item.VehicleType == "2") {
        return "商务型";
    }
    else if (item.VehicleType == "3") {
        return "豪华型";
    }
  },
  getCarDesc(item) {
    if (item.VehicleType == "1") {
        return "锋范 伊兰特等同级车";
    }
    else if (item.VehicleType == "2") {
        return "别克GL8 奥德赛等同级车";
    }
    else if (item.VehicleType == "3") {
        return "奔驰 奥迪A6系列等同级车";
    }
  },
  getCarLabel(item) {
    if (item.VehicleType == "1") {
        return "经济";
    }
    else if (item.VehicleType == "2") {
        return "舒适";
    }
    else if (item.VehicleType == "3") {
        return "品味";
    }
  },
  getCarLabel1(item) {
    if (item.VehicleType == "1") {
        return "实惠";
    }
    else if (item.VehicleType == "2") {
        return "大空间";
    }
    else if (item.VehicleType == "3") {
        return "享受";
    }
  },
  //预定
  book:function(e){
    var VehicleType = e.currentTarget.dataset.vehicletype;
    var Price = e.currentTarget.dataset.price;
    var AddServices = e.currentTarget.dataset.addservices;
    var bookModel = {};
    bookModel.BookInfo = JSON.parse(this.data.queryInfo);
    bookModel.PriceInfo = Object.assign({},{VehicleType, Price, AddServices});;
    bookModel.PriceMark = this.data.priceMark;
    wx.navigateTo({
      url: 'ddxq/ddxq?bookInfo='+encodeURIComponent(JSON.stringify(bookModel)),
    })
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