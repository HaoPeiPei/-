// pages/sscx/xzhb/xzhb.js
//航班号正则判断规则
var flightNoReg = /^[0-9a-zA-Z]{2}[0-9]{3,4}$/;
//乘机人姓名正则判断规则
var nameReg = /^[\u4E00-\u9fA5]{2,20}$|^(?:(?:[A-Za-z]{2,53}\/[A-Za-z]{2,53})|(?:[A-Za-z]{1,49}\s[A-Za-z]{2,50}\/[A-Za-z]{2,50})|(?:[A-Za-z]{2,50}\/[A-Za-z]{2,50}\s[A-Za-z]{1,49}))$/;
//联系手机正则
var mobileReg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst.js");
var {addDate, getDateDiff, getNowFormatDate, getFormatDate} = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text_1: {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "选择航班",
      "right_icon": imgRoot+"/images/dh-b.png"
    },
    imgRoot: imgRoot,
    inCaTch: false,
    serviceId: "",
    serviceName: "",
    selectPasseners: [],
    disabled:true,
    flyDateShow: false,
    currentDate: '',
    minDate:'',
    maxDate:'',
    flight: {
      startCity: '',
      startCityName: '',
      flyDate: "",
      canBook: true,
    }
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
  //请选择使用日期选择
  flyDateChange(){
    if (!flightNoReg.test(this.data.flight.flightNo)) {
      this.setData({
        flypDateShow: false
      });
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    this.setData({
      flyDateShow: true
    });
  },
  //请选择使用日期确认
  flyDatePopconfirm(e) {
    var flyDate = getFormatDate(e.detail);
    var flight = this.data.flight;
    flight['flyDate'] = flyDate;
    this.setData({
      currentDate: e.detail,
      flyDateShow: false,
      flight
    });
    this.searchFlightInfo();
  },
  //请选择使用日期取消
  flyDateCancel(e){
    this.setData({
      flyDateShow: false,
    })
  },
  //选择航班页面添加乘机人跳转至乘机人列表页
  addPassengers: function() {
    wx.navigateTo({
      url: '../addPassengers/addPassengers?selectPasseners='+JSON.stringify(this.data.selectPasseners),
    })
  },
  //选择旅客页面选择乘机人
  onSelectPassener: function(e){
    var passenerid = e.currentTarget.dataset.passenerid;
    var selectPasseners = this.data.selectPasseners;
    var passener = selectPasseners.filter(v=>passenerid==v.id)[0] || {};
    if(JSON.stringify(passener) != '{}'){
      var selectPasseners = selectPasseners.filter(v=> v.id!=passener.id);
      this.setData({
        selectPasseners: selectPasseners
      });
    }
  },
  //选择航班页面验证填写航班号
  bindinput(e){
    var flightNo = e.detail.value;
    this.setData({
      flight: Object.assign(this.data.flight,{
        flightNo 
      })
    })
  },
  //选择航班页面验证填写航班号和起飞时间
  checkFlightInfo: function(){
    var flightNo = this.data.flight.flightNo;
    var flyDate = this.data.flight.flyDate;
    if (!flightNoReg.test(flightNo)) {
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    else if (flyDate == "") {
      wx.showToast({
        title: '请选择航班起飞时间',
        icon: 'none'
      });
      return false;
    }
    return true;
  },
  //选择航班页面起飞时间选择后查询机票
  bindqcDateChange: function(e) {
    var flight = this.data.flight;
    flight['flyDate'] = e.detail.value;
     this.setData({
      flight: flight
    });
    this.searchFlightInfo();
  },
  //搜索航班信息
  searchFlightInfo: function(){
    if(this.checkFlightInfo()){
      var that = this;
      var flight = that.data.flight;
      var flightNo = flight.flightNo;
      var depDate = flight.flyDate;
      var startCity = flight.startCity;
      this.setData({
        flight: Object.assign(flight,{
          oldFlightNo: flightNo
        })
      });
      var param = { action: "getStopCity", depDate: depDate, flightNo: flightNo, startCity: startCity, air_type: 2 };
      wx.showLoading({
        title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/airTicket.ashx', param , "POST",function(res){
        wx.hideLoading();
        if (res.Status == 1) {
            var resFlight = res.FlightInfos[0];
            var resFlight = Object.assign(flight,resFlight);
            var depTime = resFlight.DepTime;
            if(depTime != '' && depTime != null && depTime.length > 3){
              resFlight['flyDate'] = depTime.trim().substring(0,depTime.length-3);
            }
            that.setData({
              flight: resFlight
            });
        } else {
          wx.showToast({
            title: res.ErrorMsg,
            icon: 'none'
          });
          flight['canBook'] = false;
          that.setData({
            flight: flight
          });
        }
      });
    }

  },
  //选择航班页面确定操作提交航班信息，成功跳转订单支付页面
  submitFlightInfo(){
    if (this.checkFlightInfo()) {
      var flight = this.data.flight;
      var oldFlightNo = flight.oldFlightNo;
      var flightNo = flight.flightNo;
      var flyDate = flight.flyDate;
      var startCity = flight.startCity;
      var selectPasseners = this.data.selectPasseners;
      if (flightNo.toUpperCase() != oldFlightNo.toUpperCase()) {
        wx.showToast({
          title: '您输入的航班号发生变化,请重新选择起飞时间进行查询',
          icon: 'none'
        });
        return false;
      }
      else if (!flight.canBook) {
        wx.showToast({
          title: '航班起飞城市和定位城市不一致,请返回首页修改。',
          icon: 'none'
        });
        return false;
      }
      else if (selectPasseners.length == 0) {
        wx.showToast({
          title: '请选择乘机人',
          icon: 'none'
        });
        return false;
      } else {
          //时间差  当前时间-航班起飞时间
          var datediff = getDateDiff(getNowFormatDate(), flyDate, "minute");
          if (datediff <= 180) {
            wx.showToast({
              title: '抱歉,您选择的航班起飞时间距现在不足3小时,请通过电话进行预约服务！',
              icon: 'none'
            });
            return false;
          }
          var now = new Date(), hour = now.getHours();
          if (startCity != "SZX") {
              if (hour < 8 || hour >= 20) {
                wx.showToast({
                  title: '抱歉,为保证服务质量,请在08:00--20:00预定服务,请通过电话进行预约服务！',
                  icon: 'none'
                });
                return false;
              }
          }
          var bookInfo = {};
          bookInfo.FlightInfo = flight;
          bookInfo.ServiceId = this.data.serviceId;
          bookInfo.ServiceName = this.data.serviceName;
          bookInfo.PassengerInfo = selectPasseners;
          bookInfo.FlightNo = flightNo;
          wx.navigateTo({
            url: "../xdzf/xdzf?bookInfo=" + JSON.stringify(bookInfo)
          });
      }
    }
  },
  //根据cityCode返回城市名称
  getCityName: function(cityCode) {
    if (cityCode == "SZX") {
        return "深圳"
    }
    else if (cityCode == "PVG") {
        return "上海"
    }
    else if (cityCode == "CSX") {
        return "长沙"
    }
    else if (cityCode == "CZX") {
        return "常州"
    }
    else if (cityCode == "DLC") {
        return "大连"
    }
    else if (cityCode == "CAN") {
        return "广州"
    }
    else if (cityCode == "KWE") {
        return "贵阳"
    }
    else if (cityCode == "HGH") {
        return "杭州"
    }
    else if (cityCode == "HFE") {
        return "合肥"
    }
    else if (cityCode == "TNA") {
        return "济南"
    }
    else if (cityCode == "JZH") {
        return "九寨沟"
    }
    else if (cityCode == "LXA") {
        return "拉萨"
    }
    else if (cityCode == "LJG") {
        return "丽江"
    }
    else if (cityCode == "KHN") {
        return "南昌"
    }
    else if (cityCode == "NNG") {
        return "南宁"
    }
    else if (cityCode == "NGB") {
        return "宁波"
    }
    else if (cityCode == "TAO") {
        return "青岛"
    }
    else if (cityCode == "SJW") {
        return "石家庄"
    }
    else if (cityCode == "TYN") {
        return "太原"
    }
    else if (cityCode == "WNZ") {
        return "温州"
    }
    else if (cityCode == "URC") {
        return "乌鲁木齐"
    }
    else if (cityCode == "XIY") {
        return "西安"
    }
    else if (cityCode == "XMN") {
        return "厦门"
    }
    else if (cityCode == "XIC") {
        return "西昌"
    }
    else if (cityCode == "XUZ") {
        return "徐州"
    }
    else if (cityCode == "INC") {
        return "银川"
    }
    else if (cityCode == "CGO") {
        return "郑州"
    }
    else if (cityCode == "ZUH") {
        return "珠海"
    }
  },
  //初始化数据
  initData(options){
    var serviceId = options.id;
    var cityCode = options.cityCode;
    var serviceName = decodeURIComponent(options.serviceName);
    if (serviceId != null && cityCode != null && serviceName != null) {
      var flight = this.data.flight;
      flight['startCityName'] = this.getCityName(cityCode);
      var nowDate = new Date();
      var minDate = nowDate.getTime();
      var maxDateStr = (nowDate.getFullYear()+1)+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
      var maxDate = new Date(addDate(maxDateStr,0).replace(/-/g,  "/")).getTime();
      this.setData({
        currentDate: minDate,
        minDate,
        maxDate,
        flight,
        serviceId,
        serviceName
      });
    } else {
        wx.navigateTo({
          url: '../wycx'
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
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