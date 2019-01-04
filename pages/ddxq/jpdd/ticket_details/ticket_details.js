// pages/ddxq/jpdd/ticket_details/ticket_details.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../../../utils/requst.js");
const { getMD, getWeek } = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "国内机票下单",
      "right_icon": "",
    },
    state:"",
    single_return:"",
    inBind_1:false,
    inBind_2:false,
    inBind_3:false,
    order: {},
    depDate:'',
    depWeek:'',
    arrDate:'',
    arrWeek:'',
    price: {}
  },
  bindBackChange: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 价格预览
  bianPriceChange:function(e){
    var inBind_1 = this.data.inBind_1;
    this.setData({
      inBind_1: !inBind_1
    });
  },
  catchBackChange1: function () {
    var inBind_1 = "";
    this.setData({
      inBind_1: inBind_1
    });
  },
  // 退改详情
  bianRetreatingChange:function(){
    var inBind_2 = this.data.inBind_2;
    this.setData({
      inBind_2: !inBind_2
    });
  },
  catchBackChange2: function () {
    var inBind_2 = "";
    this.setData({
      inBind_2: inBind_2
    });
  },
  bianReturnChange:function(){
    var inBind_3 = this.data.inBind_3;
    this.setData({
      inBind_3: !inBind_3
    });
  },
  catchBackChange3: function () {
    var inBind_3 = "";
    this.setData({
      inBind_3: inBind_3
    });
  },
  //加载订单详情
  loadOrderDetail(){
    var _this = this;
    var params = {
      orderId: this.data.orderId,
      action:"getorderbyid"
    }
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/airTicket.ashx', params, 'POST', function (res) {
      if(res.Success){
        var data = JSON.parse(res.Data);
        var flightInfos = data.airticketOrder.FlightInfos;
        for (let index = 0; index < flightInfos.length; index++) {
            const element = flightInfos[index];
            element['depDate'] = getMD(element.dep_date);
            element['depWeek'] = getWeek(element.dep_date);
            element['arrDate'] = getMD(element.arr_date);
            element['arrWeek'] = getWeek(element.arr_date);
        };
        var passeners = order.airticketOrder.Passengers;
        for (var j = 0; j < passeners.length; j++) {
          passeners[j]['TypeName'] = _this.getType(passeners[j]);
          passeners[j]["CertTypeName"] = _this.getCertType(passeners[j]);
          passeners[j]["CertNoCont"] = _this.getCertNo(passeners[j]);
        };
        _this.setData({
          order:data
        });
      }
    });
  },
  getType(item) {
    if (item.type == "0") {
        return "";
    }
    else if (item.type == "1") {
        return "(儿童)";
    } else {
        return "(婴儿)";
    }
  },
  getCertType(item) {
    if (item.type == "0") {
        if (item.cert_type == "1") {
            return "身份证";
        }
        else if (item.cert_type == "2") {
            return "护照";
        } else {
            return "其他";
        }
    } else {
        return "生日";
    }
  },
  getCertNo (item) {
    if (item.type == "0") {
        return item.cert_no;
    }else {
        return item.birthday;
    }
  },
  //计算价格明细
  caculatePirce(){
    var flightInfos = this.data.order.airticketOrder.FlightInfos;
    var price = this.data.price;
    var ticketAdultPrice = 0;       //成人票价
    var ticketChildPrice = 0;       //儿童票价
    var ticketBabyPrice = 0;        //婴儿票价
    var tax = 0;                    //税费
    var insurance_price = 0;//保险
    var refund = 0;                 //现返
    var delivery_price = order.airticketOrder.Order.delivery_price;//快递费
    var passengs = order.airticketOrder.Passengers;//机票乘机人表
    var servers = order.serviceOrders;//服务表
    var adultCount = 0;
    var childCount = 0;
    var babyCount = 0;
    var adultPriceArr = passengs.filter(v=>v.passenger_type==0);
    var tmpName = "", tmpCert_no = "", tmpBirthday="";
    for (var i = 0; i < adultPriceArr.length; i++) {
        refund += adultPriceArr[i].refund;
        ticketAdultPrice += adultPriceArr[i].sale_price;
        tax += adultPriceArr[i].fee + passengs[i].tax;
        insurance_price += adultPriceArr[i].insurance_count * 40;
        tmpCert_no = adultPriceArr[i].cert_no;
        tmpName = adultPriceArr[i].passenger_name;
        if (i + 1 < adultPriceArr.length && tmpCert_no == adultPriceArr[i + 1].cert_no && tmpName == adultPriceArr[i + 1].passenger_name)
        {
            refund += adultPriceArr[i+1].refund;
            price += adultPriceArr[i+1].sale_price;
            taxes += adultPriceArr[i+1].fee + passengs[i].tax;
        }
        break;
    }
    var childPriceArr = passengs.filter(v=>v.passenger_type==1);
    for (var i = 0; i < childPriceArr.length; i++) {
      ticketChildPrice += childPriceArr[i].sale_price;
      taxes += childPriceArr[i].fee + passengs[i].tax;
      insurance_price += childPriceArr[i].insurance_count * 40;
      tmpBirthday = childPriceArr[i].birthday;
      tmpName = childPriceArr[i].passenger_name;
      if (i + 1 < childPriceArr.length && tmpBirthday == childPriceArr[i + 1].birthday && tmpName == childPriceArr[i + 1].passenger_name) {
          childPrice += childPriceArr[i + 1].sale_price;
          taxes += childPriceArr[i + 1].fee + passengs[i].tax;
      }
      break;
    }

    adultCount = adult / order.airticketOrder.FlightInfos.length;;
    childCount = adult / order.airticketOrder.FlightInfos.length;;
    babyCount = adult / order.airticketOrder.FlightInfos.length;;
    var totalPrice = 0;
    var insuranceCount = this.data.buyInsurance * (adultCount + childCount + babyCount);
    var expressCount = this.data.buyExpress * (adultCount > 0 ? 1 : 0);
    var servicePrice = this.data.singleServicePrice * this.data.buySingleService + this.data.roundServicePrice * this.data.buyRoundService;
    var serviceCount = adultCount + childCount;
    totalPrice = ticketAdultPrice * adultCount +
        tax * adultCount + ticketChildPrice * childCount +
        ticketBabyPrice * babyCount +
        this.data.buyInsurance * (adultCount + childCount + babyCount) * this.data.insurancePrice +
        this.data.buySingleService * (adultCount + childCount) * this.data.singleServicePrice +
        this.data.buyRoundService * (adultCount + childCount) * this.data.roundServicePrice +
        this.data.buyExpress * this.data.expressPrice * (adultCount > 0 ? 1 : 0);
    
    this.setData({
        price: Object.assign({}, price, {
            totalPrice,
            ticketAdultPrice,
            adultCount,
            ticketChildPrice,
            childCount,
            ticketBabyPrice,
            expressCount,
            insuranceCount,
            babyCount,
            tax,
            refund,
            servicePrice,
            serviceCount
        })
    });
  },
  //初始化参数
  initData(options){
    var _this = this;
    var orderId = options.orderId;
    _this.setData({
      orderId: orderId,
    });
    this.loadOrderDetail();
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