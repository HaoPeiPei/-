// pages/ydjp/ydjp.js
var app = getApp();
var httpRequst = require("../../utils/requst.js");
var {getWeek, getChineseFormatDate, getFormatDate, addDate} = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketType: 0,
    depDate:'',
    depDateStr:'',
    depWeek:'',
    arrDate:'',
    arrDateStr:'',
    arrWeek:'',
    depCityName:'深圳',
    depCityCode:'SZX',
    arrCityName:'北京',
    arrCityCode:'BJS',
  },
  //初始化
  initData(){
    var nowDate = new Date();
    var depDateStr = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
    var depDate = getChineseFormatDate(depDateStr);
    var depWeek = getWeek(depDateStr);
    var arrDateStr = addDate(depDateStr,1);
    var arrDate = getChineseFormatDate(arrDateStr) ;
    var arrWeek = getWeek(arrDateStr);
    this.setData({
      depDate: depDate,
      depDateStr: depDateStr,
      depWeek: depWeek,
      arrDate: arrDate,
      arrDateStr: arrDateStr,
      arrWeek: arrWeek,
    });
  },
  //切换单程或者往返
  changeTicketType(e){
    var ticketType = e.currentTarget.dataset.tickettype;
    this.setData({
      ticketType: ticketType
    });
  }, 
  //选择城市
  selectCity(e){
    var ticketType = e.currentTarget.dataset.tickettype;
    wx.navigateTo({
      url: '../dwcs/dwcs',
    })
  },
  //选择时间
  bindqcDateChange(e){
    var dataStr = e.detail.value;
    var date = getChineseFormatDate(dataStr);
    var week = getWeek(dataStr);
    var name = e.currentTarget.dataset.name;
    if(name == 'depDate'){
      this.setData({
        depDate: date,
        depWeek: week,
      });
    }else if(name == 'arrDate'){
      this.setData({
        arrDate: date,
        arrWeek: week,
      });
    }
  },
  //城市互换
  cityExchange(){
    var depCityName = this.data.depCityName;
    var arrCityName = this.data.arrCityName;
    this.setData({
      depCityName: arrCityName,
      arrCityName: depCityName
    });
  },
  //去搜索机票
  goTicket(){
    var sCityName = this.data.depCityName;
    var sCity = this.data.depCityCode;
    var eCityName = this.data.arrCityName;
    var eCity = this.data.arrCityCode;
    var sDate = this.data.depDateStr;
    var eDate = this.data.arrDateStr;
    var ticketType = this.data.ticketType;
    wx.setStorageSync('sCity', sCity);
    wx.setStorageSync('eCity', eCity);
    wx.setStorageSync('sCityName', sCityName);
    wx.setStorageSync('eCityName', eCityName);
    wx.setStorageSync('flyDate', sDate);
    if(ticketType != 0){
      wx.setStorageSync('flyBackDate', eDate);
    }
    wx.setStorageSync("ticketType", ticketType);//存储数据 
    wx.navigateTo({
      url: "/pages/ydjp/singleTicket/singleTicket?strAir=" + sCityName + "@" + sCity + "@" + eCityName + "@" + eCity + "@" + sDate + "@" + eDate
    })
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