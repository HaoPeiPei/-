// pages/dpc/dpc_qcxx/dpc_qcxx.js
var app = getApp();
var httpRequst = require("../../../utils/requst");
var { addDate, getDateDiff, compareDate, returnDate, formatTimestamp, getFormatDate } = require("../../../utils/util.js");
var flightNoReg = /^[0-9a-zA-Z]{2}[0-9]{3,4}$/;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../images/back-b.png",
      "title_text": "选择航班",
      "right_icon": "../../images/dh-b.png",
    },
    airPort: 'SZX',
    date: '',
    time: '',
    xinx: 'qcxx',
    val: "",
    flightNo: "",
    oldGoFlightNo: "",
    go_flightNo: "",
    depDate: "",
    depTime: "",
    oldBackFlightNo: "",
    back_flightNo: "",
    arrDate: "",
    arrTime: "",
    carPlate: "",
    carType: "",
    carColor: "",
    contactor: "",
    contactTel: "",
    price: 0,
    currentDate: '',
    minDate: "",
    maxDate: "",
    depDatecurrentDate:'',
    depTimecurrentDate:'',
    depDateShow: false,
    depTimeShow: false,
    arrDatecurrentDate:'',
    arrTimecurrentDate:'',
    arrDateShow: false,
    arrTimeShow: false,
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
  //初始化数据
  initData(){
    var nowDate = new Date();
    var minDate = nowDate.getTime();
    var maxDateStr = (nowDate.getFullYear()+1)+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
    var maxDate = new Date(addDate(maxDateStr,0).replace(/-/g,  "/")).getTime();
    this.setData({
      minDate,
      maxDate,
      depDatecurrentDate: minDate,
      depTimecurrentDate: minDate,
      arrDatecurrentDate: minDate,
      arrTimecurrentDate: minDate,
     });
  },
  bindBackChange:function(){
    if(this.data.xinx == 'qcxx'){
      wx.navigateBack({
        delta:1
      })
    }else if(this.data.xinx == 'hcxx'){
      wx.setData({
        xinx: 'qcxx'
      });
    }else if(this.data.xinx == 'clxx'){
      wx.setData({
        xinx: 'hcxx'
      });
    }
  },
  inputBlur(e){
    var type = e.currentTarget.dataset.type;
    if(type =='qc'){
      this.setData({
        go_flightNo: e.detail.value
      });
    }else if(type =='hc'){
      this.setData({
        back_flightNo: e.detail.value
      });
    }
    if (!flightNoReg.test(e.detail.value)) {
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }; 
  },
  bindinput(e){
    var id = e.currentTarget.id;
    this.setData({
      [id]: e.detail.value
    });
  },
  //去程日期选择
  depDateChange(){
    if (!flightNoReg.test(this.data.go_flightNo)) {
      this.setData({
        depDateShow: false
      });
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    this.setData({
      depDateShow: true
    });
  },
  //去程日期确认
  depDatePopconfirm(e) {
    var depDate = getFormatDate(e.detail);
    this.setData({
      depDate: depDate,
      depDatecurrentDate: e.detail,
      depDateShow: false,
    });
    this.search(1);
  },
  //去程日期取消
  depDateCancel(e){
    this.setData({
      depDateShow: false,
    })
  },
  //去程接车时间选择
  depTimeChange(e) {
    if (!flightNoReg.test(this.data.go_flightNo)){ 
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      this.setData({
        depTimeShow: false
      });
      return false;
    }
    if (this.data.depDate == "") {
      this.setData({
        depTimeShow: false
      });
      wx.showToast({
        title: '请输入回程日期',
        icon: 'none'
      });
      return false;
    }
    this.setData({
      depTimeShow: true
    });
  },
  //去程接车时间确认
  depTimePopconfirm:function(e) {
    var depTime = formatTimestamp(e.detail);
    var min = getDateDiff(depTime, this.data.depDate, "minute");
    if (min < 45) {
      this.setData({
        depTime: depTime.substring(0,depTime.length-3),
        depTimecurrentDate: e.detail,
        depTimeShow: true,
      });
      wx.showToast({
        title: "您的接车时间至少要比起飞时间提前45分钟!",
        icon: 'none'
      })
      return false;
    }
    this.setData({
      depTime: depTime.substring(0,depTime.length-3),
      depTimecurrentDate: e.detail,
      depTimeShow: false,
    })
  },
  //去程接车时间取消
  depTimeCancel(e){
    this.setData({
      depTimeShow: false,
    })
  },
  //回程日期选择
  arrDateChange:function(e){
    if (!flightNoReg.test(this.data.back_flightNo)) {
      this.setData({
        arrDateShow: false
      });
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    this.setData({
      arrDateShow: true
    });
  },
  //回程日期确认
  arrDatePopconfirm:function(e){
    var arrDate = getFormatDate(e.detail);
    this.setData({
      arrDate: arrDate,
      arrDatecurrentDate: e.detail,
      arrDateShow: false,
    });
    var durate = getDateDiff(this.data.depDate, arrDate, "minute");
    if (durate <= 0) {
      wx.showToast({
        title: '您的选择的回程日期不能小于去程日期',
        icon: 'none'
      });
      return false;
    }
    this.search(2);
  },
  //回程日期取消
  arrDateCancel(e){
    this.setData({
      arrDateShow: false,
    })
  },
  //回程还车时间选择
  arrTimeChange:function(e){
    if (!flightNoReg.test(this.data.back_flightNo)){ 
      this.setData({
        arrTimeShow: false
      });
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    if (this.data.arrDate == "") {
      this.setData({
        arrTimeShow: false
      });
      wx.showToast({
        title: '请输入回程日期',
        icon: 'none'
      });
      return false;
    }
    this.setData({
      arrTimeShow: true
    });
  },
  //回程还车时间确认
  arrTimePopconfirm:function(e) {
    var arrTime = formatTimestamp(e.detail);
    var min = getDateDiff(arrTime, this.data.arrDate, "minute");
    if (min > -15) {
      this.setData({
        arrTime: arrTime.substring(0,arrTime.length-3),
        arrTimecurrentDate: e.detail,
        arrTimeShow: true,
      });
      wx.showToast({
        title: '您的接车时间至少要比到达时间晚15分钟!',
        icon: 'none'
      });
      return false;
    }
    this.setData({
      arrTime: arrTime.substring(0,arrTime.length-3),
      arrTimecurrentDate: e.detail,
      arrTimeShow: false,
    })
  },
  //回程还车时间取消
  arrTimeCancel(e){
    this.setData({
      arrTimeShow: false,
    })
  },
  bindZfchage:function(){
    if(this.checkCl){
      this.createOrder();
    }
  },
  bindXybchage:function(){
    var xinx = this.data.xinx;
    if(xinx == "qcxx"){
      if(this.checkQc()){
        xinx = "hcxx";
        var title_text = '预约泊车';
      }
    }else if(xinx == "hcxx"){
      if(this.checkHc()){
        xinx = "clxx";
        this.caculatePrice();
      }
    }
    this.setData({
      header_text: Object.assign({}, this.data.header_text,{
        title_text: title_text
      }),
      xinx: xinx,
    });
  },
  //检查回程信息
  checkQc() {
    if (!flightNoReg.test(this.data.go_flightNo)) {
      wx.showToast({
        title: "请填写正确的航班号",
        icon: 'none'
      })
      return false;
    }
    if (this.data.depDate == "") {
      wx.showToast({
        title: "请选择去程日期",
        icon: 'none'
      })
      return false;
    }
    if (this.data.oldGoFlightNo != "" && this.data.go_flightNo.toUpperCase() != this.data.oldGoFlightNo.toUpperCase()) {
      wx.showToast({
        title: "您输入的航班号发生变化,请重新选择起飞时间进行查询",
        icon: 'none'
      })
      return false;
    }
    if (this.data.depTime == "") {
      wx.showToast({
        title: "请选择接车时间",
        icon: 'none'
      })
      return false;
    }
    var min = getDateDiff(this.data.depTime, this.data.depDate, "minute");
    if (min < 45) {
      wx.showToast({
        title: "您的接车时间至少要比起飞时间提前45分钟!",
        icon: 'none'
      })
      return false;
    }
    this.setData({
      oldGoFlightNo: this.data.go_flightNo
    });
    return true;
  },
  //检查回程信息
  checkHc() {
    if (!flightNoReg.test(this.data.back_flightNo)) {
      wx.showToast({
        title: "请输入正确的航班号",
        icon: 'none'
      })
      return false;
    }
    if (this.data.arrDate == "") {
      wx.showToast({
        title: "请选择回程日期",
        icon: 'none'
      })
      return false;
    }
    if (this.data.oldBackFlightNo != "" && this.data.back_flightNo.toUpperCase() != this.data.oldBackFlightNo.toUpperCase()) {
      wx.showToast({
        title: "您输入的航班号发生变化,请重新选择起飞时间进行查询!、",
        icon: 'none'
      })
      return false;
    }
    if (this.data.arrTime == "") {
      wx.showToast({
        title: "请选择接车时",
        icon: 'none'
      })
      return false;
    }
    var durate = getDateDiff(this.data.depDate, this.data.arrDate, "minute");
    var min = getDateDiff(this.data.arrTime, this.data.arrDate, "minute");
    if (durate <= 0) {
      wx.showToast({
        title: "您的选择的回程时间不能小于去程时间!",
        icon: 'none'
      })
      return false;
    }
    if (min > -15) {
      wx.showToast({
        title: "您的接车时间至少要比到达时间晚15分钟!",
        icon: 'none'
      })
      return false;
    };
    this.setData({
      oldBackFlightNo: this.data.back_flightNo
    });
    return true;
  },
  //检查车辆信息
  checkCl() {
    var carnoReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    if (!carnoReg.test(this.data.carPlate.toUpperCase())) {
      wx.showToast({
        title: "请输入正确的车牌号",
        icon: 'none'
      });
      return false;
    }
    if (this.data.carType == "") {
      wx.showToast({
        title: "请输入您的爱车型号",
        icon: 'none'
      });
      return false;
    }
    if (this.data.carColor == "") {
      wx.showToast({
        title: "请输入您的爱车颜色",
        icon: 'none'
      });
      return false;
    }
    if (this.data.contactor == "") {
      wx.showToast({
        title: "请填写联系人",
        icon: 'none'
      });
      return false;
    }
    if (this.data.contactTel == "") {
      wx.showToast({
        title: "请填写联系电话",
        icon: 'none'
      });
      return false;
    }
    else {
        var myreg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
        if (!myreg.test(this.data.contactTel)) {
          wx.showToast({
            title: "请输入有效的手机号码",
            icon: 'none'
          });
          return false;
        }
    }
    return true;
  },
  //搜索机票
  search(tripType){
    var flightNo = "", flyDate = "";
    if (tripType == 1) {
        flightNo = this.data.go_flightNo;
        flyDate = this.data.depDate;
    } else {
        flightNo = this.data.back_flightNo;
        flyDate = this.data.arrDate;
    }
    wx.showLoading({
      title: '数据加载中...',
    });
    if (this.checkSearch(tripType)) {
      var param = {
        action: "getStopCity", 
        depDate: flyDate, 
        flightNo: flightNo, 
        startCity: 'SZX', 
        air_type: tripType == 2 ? 1 : 2
      }
      httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/airTicket.ashx", param, "POST",res => {
        wx.hideLoading();
        var obj = res;
        if (obj.Status == 1) {
          if (tripType == 1) {
            var depTime = obj.FlightInfos[0].DepTime;
            this.setData({
              depDate: depTime.substring(0,depTime.length-3),
              oldGoFlightNo: this.data.go_flightNo
            });
          } else {
            var arrTime = obj.FlightInfos[0].ArrTime;
            this.setData({
              arrDate: arrTime.substring(0,arrTime.length-3),
              oldBackFlightNo: this.data.back_flightNo
            });
          }
        } else {
          wx.showToast({
            title: obj.ErrorMsg,
            icon: 'none'
          });
        };
      });
    }
  },
  checkSearch(tripType) {
    var flightNo = "", flyDate = "";
    if (tripType == 1) {
        flightNo = this.data.go_flightNo;
        flyDate = this.data.depDate;
    } else {
        flightNo = this.data.back_flightNo;
        flyDate = this.data.arrDate;
    }
    if (!flightNoReg.test(flightNo)) {
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    else if (flyDate == "") {
      wx.showToast({
        title: '请选择去程日期',
        icon: 'none'
      });
      return false;
    }
    return true;
  },
  //计算价格
  caculatePrice() {
    var depTime = this.data.depTime;
    var arrTime = this.data.arrTime;
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "getprice", 
      depTime: depTime, 
      arrTime: arrTime
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/valet.ashx", param, "POST",res => {
      wx.hideLoading();
      var obj = res;
      if (obj.Success) {
          if (parseInt(obj.Data) > 0) {
            var price = obj.Data;
            this.setData({
              price
            });
          }
      } else {
        wx.navigateTo({
          url: '../dpc/dpc',
        });
      };
    });
  },
  //创建订单
  createOrder() {
    if (this.checkQc() && this.checkHc() && this.checkCl()) {
      var flyInfo = this.data.airPort + "@" + this.data.go_flightNo.toUpperCase() + "@" + this.data.depDate + "@" + this.data.depTime;
      var backInfo = this.data.back_flightNo.toUpperCase() + "@" + this.data.arrDate + "@" + this.data.arrTime;
      var useInfos = app.globalData.memberId + "@" + this.data.contactor + "@" + this.data.contactTel;
      var carInfo = this.data.carPlate.toUpperCase() + "@" + this.data.carType.toUpperCase() + "@" + this.data.carColor.toUpperCase();
      var price = this.data.price;
      wx.showLoading({
        title: '数据加载中...',
      });
      var param = { 
        action: "create", 
        flyInfo: flyInfo, 
        backInfo: backInfo, 
        useInfos: useInfos, 
        carInfo: carInfo, 
        price: price 
      }
      httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/valet.ashx", param, "POST",res => {
        wx.hideLoading();
        var obj = res;
        if (obj.Success) {
          wx.navigateTo({
            url: "../dpc_qzf/dpc_qzf?orderId=" + obj.Data,
          });
        } else {
          layer.msg(obj.ErrorMsg);
          return false;
        };
      });
    };
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