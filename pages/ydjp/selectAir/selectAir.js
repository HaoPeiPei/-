// pages/ydjp/selectAir/selectAir.js
var { HttpRequst } = require("../../../utils/requst.js");
var {returnDate, getWeek, dateAddValue, getMD, getNowFormatDate, getDateDiff} = require("../../../utils/util.js");
var WxParse = require('../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      carrier: {},
      depDate: '',
      depWeek: '',
      arrDate: '',
      arrWeek: '',
      endorseModalShow: false,
      endorseModalContent: '',
    },
    //初始化数据
    initDate(options){
      var carrier = JSON.parse(options.carrier);
      var cabInfos = carrier.CabInfos|| [];
      cabInfos = cabInfos.filter(function(item){
        if(JSON.stringify(item) != '{}'){
          var FlightLowestPrice = parseInt(item.SalePrice) - parseInt(item.Promotion);
          return item[FlightLowestPrice] = FlightLowestPrice;}
      });
      carrier = Object.assign({},carrier,{
        CabInfos: cabInfos
      });
      var depDate = getMD(carrier.DepDate);
      var depWeek = getWeek(carrier.DepDate);
      var arrDate = getMD(carrier.ArrDate);
      var arrWeek = getWeek(carrier.ArrDate);
      this.setData({
        carrier,
        depDate,
        depWeek,
        arrDate,
        arrWeek,
      });
    },
    //显示退改详情
    showEndorseModal(e){
      var that = this;
      var _class = e.currentTarget.dataset.class;
      var carrier = this.data.carrier;
      that.setData({
        endorseModalShow: true
      });
      HttpRequst(
        true,
        '/weixin/jctnew/ashx/airTicket.ashx',
        {
          "sdate": carrier.DepDate,
          "carrier": carrier.Carrier,
          "cab": _class,
          "action": "endorse"
        },
        "POST",
        res=> {
          var endorseModalContent = '';
          if (res.Success) {
            endorseModalContent ="<p>" + res.Data.replace(/\r\n/g, '</p><p>') + "</p>";
          }
          else {
            endorseModalContent ="<p>暂无此舱位退改签信息,请致电客服进行了解</p>";
          };
          that.setData({
            endorseModalContent: WxParse.wxParse('endorseModalContent', 'html', endorseModalContent, that, 5)
          })
        }); 
    },
    //隐藏退改详情
    hideEndorseModal(e){
      this.setData({
        endorseModalShow: false
      });
    },
    //预定
    book(e){
      var carrier = this.data.carrier;
      var flyTime = carrier.DepDate + " " + carrier.BeginTime + ":00";
      var currNow = getNowFormatDate();
      var datediff = getDateDiff(currNow, flyTime, "minute");
      if (datediff <= 120) { //从深圳出发的在一个小时内预约无忧出行，得电话联系，其它城市需要3小时
        wx.showToast({
          title: '抱歉,您选择的航班起飞时间距现在不足2小时,请通过电话进行预订!客服电话:400-700-7355',
          icon: 'none',
        })
        return false;
      }
      var selectedFlightInfo = Object.assign({},carrier);             //保存当前选择的航班信息
      var _class = e.currentTarget.dataset.class;
      var cabInfos = carrier.CabInfos;
      var cabInfo = {};
      for (let index = 0; index < cabInfos.length; index++) {
       if( _class == cabInfos[index].Class){
        cabInfo = cabInfos[index]
       }
      }
      selectedFlightInfo.CabInfos = cabInfo;           //保存当前选择的舱位信息
      /* if (typeof (bookInfo.FlightInfos) === "undefined") {
          bookInfo.FlightInfos = [];
      }
      if ($("#hd_airType").val() == "0" && bookInfo.FlightInfos.length > 0) {
          bookInfo.FlightInfos.pop();
      }
      else if ($("#hd_airType").val() == "1" && bookInfo.FlightInfos.length > 1) {
          bookInfo.FlightInfos.pop();
      } */
      var bookInfo = {};
      bookInfo.FlightInfos = [];
      bookInfo.FlightInfos.push(selectedFlightInfo);
      wx.navigateTo({
        url: '../airTicketOrder/airTicketOrder?bookInfo='+JSON.stringify(bookInfo)
      });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.initDate(options);
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