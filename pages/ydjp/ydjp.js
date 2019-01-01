// pages/ydjp/ydjp.js
var app = getApp();
var {getWeek, getChineseFormatDate, compareDate, addDate, returnDate} = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../images/back-f.png",
      "title_text": "国内机票",
      "right_icon": "../images/dh-f.png",
      "background_url": "../images/worryFree.png"
    },
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
      url: 'dwcs/dwcs?ticketType='+ticketType,
    });
  },
  //选择时间
  bindqcDateChange(e){
    var dataStr = e.detail.value;
    var date = getChineseFormatDate(dataStr);
    var week = getWeek(dataStr);
    var name = e.currentTarget.dataset.name;
    if(name == 'depDate'){
      this.setData({
        depDateStr: dataStr,
        depDate: date,
        depWeek: week,
      });
    }else if(name == 'arrDate'){
      this.setData({
        arrDateStr: dataStr,
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
  //验证
  check(){
    if (this.data.depCityName == '') {
      wx.showToast({
        title: '出发城市不能为空!',
        icon: 'none'
      });
      return false;
    }
    if (this.data.depCityCode == '') {
        wx.showToast({
          title: '出发城市不能为空!',
          icon: 'none'
        });
        return false;
    }
    if (this.data.arrCityName == '') {
      wx.showToast({
        title: '目的城市不能为空!',
        icon: 'none'
      });
      return false;
    }
    if (this.data.arrCityCode == '') {
      wx.showToast({
        title: '目的城市不能为空!',
        icon: 'none'
      });
      return false;
    }
    if (this.data.depCityCode ==this.data.arrCityCode) {
      wx.showToast({
        title: '出发城市,目的城市不能相同!',
        icon: 'none'
      });
      return false;
    }
    if (this.data.ticketType== 1) {
      var depDateStr = this.data.depDateStr;
      var arrDateStr = this.data.arrDateStr;
      if (compareDate(returnDate(depDateStr), returnDate(arrDateStr)) >= 0) {
        wx.showToast({
          title: '回程日期不能小于去程日期!',
          icon: 'none'
        });
        return false;
      }

    }
    return true;
  },
  //去搜索机票
  goTicket(){
    if(!this.check()){
      return
    };
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
    if(ticketType == 0){
        wx.navigateTo({
          url: "/pages/ydjp/singleTicket/singleTicket?ticketType="+ticketType+"&strAir=" + sCityName + "@" + sCity + "@" + eCityName + "@" + eCity + "@" + sDate + "@" + eDate
        })
    }else if(ticketType == 1){
      var ticketType = 0;
      wx.navigateTo({
        url: "/pages/ydjp/multiTicket/multiTicket?ticketType="+ticketType+"&strAir=" + sCityName + "@" + sCity + "@" + eCityName + "@" + eCity + "@" + sDate + "@" + eDate
      })
    }
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