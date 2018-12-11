// pages/sscx/xzhb/xzhb.js
var flightNoReg = /^[0-9a-zA-Z]{2}[0-9]{3,4}$/;
var oldFlightNo = "";
var depDate = "";
var startCity = "SZX";
var serviceId = "";
var passengerModel = {};
var flightInfo;
var dialog;
var serviceName = "";
var app = getApp();
var httpRequst = require("../../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text_1: {
      "left_icon": "../../images/back-b.png",
      "title_text": "选择航班",
      "right_icon": "../../images/dh-b.png"
    },
    inCaTch: false,
    model: "",
    passeners: [],
    selectPasseners: [],
    editPassener: {}, //编辑或者新增的乘机人
    inBind_1: true,
    inBind_2: false,
    inBind_3:false,
    flightNo: '',
    disabled:true,
    certificate: ["身份证", "护照", "其他"],
    picker_index: 0,
    passengerModel:'',
    startDate:"",
    flight: {
      startCity: 'SZX',
      startCityName: '深圳',
      flyDate: "",
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
  bindBackChange: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  bindBackChange_2: function() {
    var inBind_1 = this.data.inBind_1;
    var inBind_2 = this.data.inBind_2;
    this.setData({
      inBind_1: !inBind_1,
      inBind_2: !inBind_2,
    });
  },
  bindBackChange_3: function () {
    var inBind_1 = this.data.inBind_1;
    var inBind_2 = this.data.inBind_2;
    var inBind_3 = this.data.inBind_3;
    this.setData({
      inBind_1: false,
      inBind_2: true,
      inBind_3: false,
    });
  },
  //验证
  Check: function() {

  },
  catchRemove: function() {
    var inCaTch = this.data.inCaTch
    this.setData({
      inCaTch: !inCaTch
    })
  },
  //选择旅客页面加载乘机人列表
  loadPassenerInfo: function(){
    var that = this;
    var memberId = app.globalData.memberId;
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', {action: "get", memberId: memberId}, "POST",function(res){
      var data = JSON.parse(res.Data);
      var passeners = that.data.passeners;
      that.setData({
        passeners: data,
      });
    }); 
  },
  //选择航班页面添加乘机人跳转至乘机人列表页
  bindNavChange: function() {
    var inBind_1 = this.data.inBind_1;
    var inBind_2 = this.data.inBind_2;
    this.setData({
      inBind_1: !inBind_1,
      inBind_2: !inBind_2,
    });
  },
  //选择旅客页面添加乘机人跳转至详情页
  addPassener:function(){
    var inBind_1 = this.data.inBind_1;
    var inBind_2 = this.data.inBind_2;
    var inBind_3 = this.data.inBind_3;
    this.setData({
      inBind_1: false,
      inBind_2: false,
      inBind_3: true,
      editPassener: {}
    });
  },
  //选择旅客页面编辑乘机人跳转至详情页
  editPassener: function(e) {
    var that = this;
    var passenerId = e.currentTarget.dataset.passenerid;
    var passeners = that.data.passeners;
    var editPassener = that.data.editPassener;
    var passener = {}; 
    for (let i = 0; i < passeners.length; i++) {
      if(passenerId == passeners[i].id){
        passener = passeners[i];
      }
    }
    this.setData({
      inBind_1: false,
      inBind_2: false,
      inBind_3: true,
      editPassener: passener
    });
  },
  //选择旅客页面选择乘机人
  onSelectPassener: function(e){
    var index = e.currentTarget.dataset.index;
    var passeners = this.data.passeners;
    var selectPasseners = this.data.selectPasseners;
    var newSelectPasseners = [];
    if(index!=="" && index != null){
      passeners[parseInt(index)].active = !passeners[parseInt(index)].active ; 
      if(passeners[parseInt(index)].active){
        newSelectPasseners = selectPasseners.concat(passeners[parseInt(index)]);
      }
      this.setData({
        passeners: passeners,
        selectPasseners: newSelectPasseners
      });
    }
  },
  bindDatePicker: function() {
    var flightNo = this.data.flightNo;
    if (this.flightNoReg()) {
      console.log(1);
    } else {
      console.log(0);
    }
  },
  //选择航班页面验证填写航班号
  flightNoReg: function(e) {
    var flightNo = e.detail.value;
    var flight = this.data.flight;
    if (!(flightNoReg.test(flightNo))){
      wx.showToast({
        title: '请输入正确的航班号',
      });
      return false
    }else{
      var flight = this.data.flight;
      flight['flightNo'] = flightNo;
      this.setData({
        flight: flight,
        disabled: false
      });
    }
  }, 
  //选择航班页面初始化起飞时间的弹框
  initDatePicker: function() {
    var nowDate = new Date();
    var flight = this.data.flight;
    flight['startDate'] = new Date(nowDate.getFullYear() , nowDate.getMonth(), nowDate.getDate());
    flight['endDate'] = new Date(nowDate.getFullYear()+1 , nowDate.getMonth(), nowDate.getDate());
    this.setData({
      flight: flight
    });
  },
  //选择航班页面验证填写航班号和起飞时间
  checkFlightInfo: function(){
    var flightNo = this.data.flight.flightNo;
    var flyDate = this.data.flight.flyDate;
    if (!flightNoReg.test(flightNo)) {
      wx.showToast({
        title: '请输入正确的航班号',
      });
      return false;
    }
    else if (flyDate == "") {
      wx.showToast({
        title: '请选择航班起飞时间',
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
      var param = { action: "getStopCity", depDate: depDate, flightNo: flightNo, startCity: startCity, air_type: 2 }
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/airTicket.ashx', param , "POST",function(res){
        if (res.Status == 1) {
            var resFlight = res.FlightInfos[0];
            resFlight['oldFlightNo'] = flightNo;
            resFlight['flyDate'] = resFlight.DepTime.trimEnd(":00");
            that.setData({
              flight: resFlight
            });
        } else {
          wx.showToast({
            title: res.ErrorMsg,
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
        });
        return false;
      }
      else if (!canBook) {
        wx.showToast({
          title: '航班起飞城市和定位城市不一致,请返回首页修改。',
        });
        return false;
      }
      else if (selectPasseners.length == 0) {
        wx.showToast({
          title: '请选择乘机人',
        });
        return false;
      } else {
          //时间差  当前时间-航班起飞时间
          var datediff = GetDateDiff(getNowFormatDate(), flyDate, "minute");
          if (datediff <= 180) {
            wx.showToast({
              title: '抱歉,您选择的航班起飞时间距现在不足3小时,请通过电话进行预约服务！',
            });
            return false;
          }
          var now = new Date(), hour = now.getHours();
          if (startCity != "SZX") {
              if (hour < 8 || hour >= 20) {
                wx.showToast({
                  title: '抱歉,为保证服务质量,请在08:00--20:00预定服务,请通过电话进行预约服务！',
                });
                return false;
              }
          }
          var bookInfo = {};
          bookInfo.FlightInfo = flight;
          bookInfo.ServiceId = serviceId;
          bookInfo.ServiceName = serviceName;
          bookInfo.PassengerInfo = selectPasseners;
          bookInfo.FlightNo = flightNo;
          window.location = "../payOrder/serviceOrder.aspx?bookInfo=" + encodeURIComponent(JSON.stringify(bookInfo));
      }
  }
  },
  //新增或者编辑乘机人页面选择证件类型弹框
  bindPickerChange: function (e) {
    var index = e.detail.value;
    this.setData({
      picker_index: index
    })
  },
  // bindKeyInput: function (e) {
  //  var val = e.detail.value;
  //   console.log(val);
  //   this.setData({
  //     passengerModel: passengerModel,
  //     values: this.data.model
  //   })
  // },
  //新增或者编辑乘机人页面点击确认操作
  rgs:function(e){
    var formId = e.detail.formId;
    var val = e.detail.value;
    var param = { 
      action: val.action, 
      psgId: val.psgId, 
      memberId: app.globalData.memberId, 
      psg_name: val.name, 
      cert_no: val.cert_no, 
      cert_type: parseInt(val.cert_type) +1, 
      phone_number: val.tel, 
    }
    this.savePassener(param);
  },
  //保存乘机人信息
  savePassener: function(param) {
    var that = this;
    var memberId = app.globalData.memberId;
    if (memberId != null && memberId != "") {
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', param , "POST",function(res){
        if (res.Success) {
          that.loadPassenerInfo();
          var inBind_1 = that.data.inBind_1;
          var inBind_2 = that.data.inBind_2;
          var inBind_3 = that.data.inBind_3;
          that.setData({
            inBind_1: false,
            inBind_2: true,
            inBind_3: false,
          });
        } else {

        }
      });
    }
  },
  //删除乘机人信息
  deletePassener: function(e){
    var that = this;
    var passenerId = e.currentTarget.dataset.passenerid;
    var memberId = app.globalData.memberId;
    if (memberId != null && memberId != "") {
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', { action: "del", memberId: memberId, psgId: passenerId } , "POST",function(res){
        if (res.Success) {
          that.loadPassenerInfo();
          var inBind_1 = that.data.inBind_1;
          var inBind_2 = that.data.inBind_2;
          var inBind_3 = that.data.inBind_3;
          that.setData({
            inBind_1: false,
            inBind_2: true,
            inBind_3: false,
          });
        } else {

        }
      });
    }
  },
  catchAdd:function(){
    //var passengerModel = this.data.passengerModel;
    console.log(passengerModel.name);
    if (passengerModel.name != ''){
      
      console.log(passengerModel.length);
    }else{
      wx.showToast({
        title: '请按照登机所持证件填写中文或英文姓名',
        icon: 'none',
        duration: 2000
      })
    }
    
    //if (passengerModel.length()){}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var flight = this.data.flight;
    flight['startCityName'] = this.getCityName(flight.startCity);
    this.setData({
      flight: flight
    })
    this.loadPassenerInfo();
    this.initDatePicker();
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