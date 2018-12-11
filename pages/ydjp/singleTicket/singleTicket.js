// pages/ydjp/ticket/ticket.js
var app = getApp();
var httpRequst = require("../../../utils/requst.js");
var {returnDate, getWeek, dateAddValue, getMD, getNowFormatDate, getDateDiff} = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
      sCityName: '',
      sCity: '',
      eCityName: '',
      eCity: '',
      sName: '',
      sDate: '',
      sWeek: '',
      eDate: '',
      prevDate: '',
      nowDate: '',
      nextDate: '',
      timeType : 0,
      timeActive: true,
      priceType: 0,
      priceActive: false,
      filterModalShow: false,
      filterActive: false,
      flightInfos: [],
      displayFlightInfos: [],
      carriers: [],
    },
    //初始化数据
    initData(options){
      var strAir = options.strAir;
      if (strAir != null) {
        var searchArr = strAir.split("@");
        var sCityName = searchArr[0];
        var sCity = searchArr[1];
        var eCityName = searchArr[2];
        var eCity = searchArr[3];
        var sDate = searchArr[4];
        var eDate = searchArr[5];
        var prevDate = getMD(dateAddValue(returnDate(sDate), -1));
        var nowDate = getMD(dateAddValue(returnDate(sDate), 0));
        var nowWeek = getWeek(sDate);
        var nextDate = getMD(dateAddValue(returnDate(sDate), 1));
        this.setData({
          sCityName,
          sCity,
          eCityName,
          eCity,
          sDate,
          eDate,
          prevDate,
          nowDate,
          nowWeek,
          nextDate,
        });
        this.search();
      } else {
          wx.navigateBack({
            delta: 1
          })
      }
    },
    //获取乘机人列表
    search(){
      var that = this;
      var openid = 'oZDU-wVTjVXuwwKYWsD4f1RuOXYc';
      if (openid != null && openid != "") {
        wx.showLoading({
          title: '数据加载中...',
        });
        var param = {
          action: "av", 
          scity: this.data.sCity, 
          ecity: this.data.eCity, 
          sdate: this.data.sDate, 
          openId: openid
        }
        httpRequst.HttpRequst(true, "/weixin/jctnew/ashx/airTicket.ashx", param , "POST",function(res){
          wx.hideLoading();
          if (res.Status == 1) {
            var flightInfos = res.FlightInfos.filter(function(item){
              if(item.CabInfos.length>0){
                var Discount = item.CabInfos[0].Discount;
                var FlightLowestPrice = parseInt(item.CabInfos[0].SalePrice) - parseInt(item.CabInfos[0].Promotion);
                var FlightNoIcon = item.FlightNo.substring(0, 2);
                return Object.assign(item,{Discount,FlightLowestPrice,FlightNoIcon});
              }
            });
            that.setData({
              flightInfos: flightInfos,
              displayFlightInfos: flightInfos
            });
            that.filterByCarrier(res.FlightInfos);
            that.orderByTime(0);
          } else {
              /* $("#flyData").html("<div class='jp-data'>\
                  <p class='cl_darkGray' style='margin:0px;text-align:center;padding:1rem'>没有找到符合条件的结果</p>\
              </div>"); */
          }
        });
      }
    },
    //前一天搜索
    preSearch(){
      var sDate = this.data.sDate;
      var date = dateAddValue(returnDate(sDate), -1);
      if (getDateDiff(getNowFormatDate(), date, "day") < 0) {
        wx.showToast({
          title: '出发日期不能小于当前日期',
          icon: 'none',
        })
        return false;
      };
      var prevDate = getMD(dateAddValue(returnDate(date), -1));
      var nowDate = getMD(dateAddValue(returnDate(date), 0));
      var nowWeek = getWeek(date);
      var nextDate = getMD(dateAddValue(returnDate(date), 1));
      this.setData({
        sDate: date, 
        prevDate,
        nowDate,
        nowWeek,
        nextDate,
      })
      this.search();
    },
    //后一天搜索
    nextSearch(){
      var sDate = this.data.sDate;
      var date = dateAddValue(returnDate(sDate), 1);
      var prevDate = getMD(dateAddValue(returnDate(date), -1));
      var nowDate = getMD(dateAddValue(returnDate(date), 0));
      var nowWeek = getWeek(date);
      var nextDate = getMD(dateAddValue(returnDate(date), 1));
      this.setData({
        sDate: date, 
        prevDate,
        nowDate,
        nowWeek,
        nextDate,
      })
      this.search();
    },
    //航空公司过滤
    filterByCarrier(carriers){
      var obj = {};
      carriers = carriers.reduce((cur,next) => {
          obj[next.CarrierName] ? "" : obj[next.CarrierName] = true && cur.push(next);
          return cur;
      },[]);
      this.setData({
        carriers
      });
    },
    //航空公司选中
    selectFilterCarrier(e){
      var carrierName = e.currentTarget.dataset.carriername;
      var carriers = this.data.carriers;
      var carrier = carriers.filter(v=>carrierName==v.CarrierName)[0] || {};
      if(JSON.stringify(carrier) != '{}'){
        carrier['active'] = !carrier['active'];
        this.setData({
          carriers
        });
      }
    },
    //按时间排序
    orderByTime(type){
      var displayFlightInfos = this.data.displayFlightInfos;
      if (type == 0) {
        //按时间升序
        displayFlightInfos = displayFlightInfos.sort(function(a,b){
          var aDate = returnDate((a.ArrDate+ ' '+a.BeginTime+':00')).getTime();
          var bDate = returnDate((b.ArrDate+ ' '+b.BeginTime+':00')).getTime();
          return aDate - bDate;
        });
      } else {
          //按时间倒序
          displayFlightInfos = displayFlightInfos.sort(function(a,b){
            var aDate = returnDate((a.ArrDate+ ' '+a.BeginTime+':00')).getTime();
            var bDate = returnDate((b.ArrDate+ ' '+b.BeginTime+':00')).getTime();
            return bDate - aDate ;
          });
      }
      this.setData({
        displayFlightInfos
      });
    },
    //底部时间排序操作
    onOrderByTime(e){
      var timeType = e.currentTarget.dataset.timetype;
      if(timeType == 0){
        this.orderByTime(1);
        timeType = 1;
      }else if(timeType == 1){
        this.orderByTime(0);
        timeType = 0;
      }
      this.setData({
        priceActive: false,
        timeActive: true,
        timeType
      });
    },
    //价格排序
    orderByPrice(type){
      var displayFlightInfos = this.data.displayFlightInfos;
      if (type == 0) {
        //按时间升序
        displayFlightInfos = displayFlightInfos.sort(function(a,b){
          var aPrice = parseInt(a.CabInfos[0].SalePrice) - parseInt(a.CabInfos[0].Promotion);
          var bPrice = parseInt(b.CabInfos[0].SalePrice) - parseInt(b.CabInfos[0].Promotion);
          return aPrice - bPrice;
        });
      } else {
          //按时间倒序
          displayFlightInfos = displayFlightInfos.sort(function(a,b){
            var aPrice = parseInt(a.CabInfos[0].SalePrice) - parseInt(a.CabInfos[0].Promotion);
            var bPrice = parseInt(b.CabInfos[0].SalePrice) - parseInt(b.CabInfos[0].Promotion);
            return bPrice - aPrice;
          });
      }
      this.setData({
        displayFlightInfos
      });
    },
    //底部价格排序操作
    onOrderByPrice(e){
      var priceType = e.currentTarget.dataset.pricetype;
      if(priceType == 0){
        this.orderByPrice(1);
        priceType = 1;
      }else if(priceType == 1){
        this.orderByPrice(0);
        priceType = 0;
      }
      this.setData({
        timeActive: false,
        priceActive: true,
        priceType
      });
    },
    //隐藏筛选弹框
    hideFilterModal(){
      this.setData({
        filterModalShow: false,
        filterActive: false
      });
    },
    //显示筛选弹框
    showFilterModal(){
      this.setData({
        filterModalShow: true,
        filterActive: true
      });
    },
    //筛选弹框取消
    cancelFilterModal(){
      this.setData({
        filterModalShow: false,
        filterActive: false
      });
    },
    //筛选弹框确认
    confirmFilterModal(){
      var flightInfos = this.data.flightInfos;
      var displayFlightInfos = [];
      var carriers = this.data.carriers;
      var selectCarrierNames = carriers.filter(v=>v.active).map(v=>v.CarrierName);
      if(selectCarrierNames.length > 0){
        for (var j = 0; j < flightInfos.length; j++) {
          if(selectCarrierNames.indexOf(flightInfos[j]['CarrierName']) != -1){
            displayFlightInfos.push(flightInfos[j])
          }
        }
      };
      this.setData({
        displayFlightInfos: displayFlightInfos,
        filterModalShow: false,
        filterActive: true
      });
    },
    //筛选弹框清空筛选
    removeAllFilterModal(){
      var carriers = this.data.carriers;
      carriers = carriers.map(function(item){
        item['active'] = false;
        return carriers;
      });
      this.setData({
        carriers
      });
    },
    //查看详情
    viewDetail(e){
      var carriers = this.data.flightInfos;
      var flightNo =  e.currentTarget.dataset.flightno;
      var beginTime =  e.currentTarget.dataset.begintime;
      var depDate =  e.currentTarget.dataset.depdate;
      var carrier = carriers.filter(function(item){
        if(item.FlightNo==flightNo&&item.BeginTime==beginTime&&item.DepDate==depDate){
          return item
        }
      })[0];
      wx.navigateTo({
        url: '../selectAir/selectAir?carrier='+JSON.stringify(carrier)
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