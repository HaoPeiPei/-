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
      ticketType: 0,
      timeType : 0,
      timeActive: true,
      priceType: 0,
      priceActive: false,
      filterModalShow: false,
      filterActive: false,
      selectAirlShow: false,
      singleTicketShow: true,
      waitShow: false,
      noDateShow: false,
      carrier: {},
      flightInfos: [],
      displayFlightInfos: [],
      carriers: [],
    },
    //初始化数据
    initData(options){
      var strAir = options.strAir;
      var ticketType = options.ticketType;
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
          ticketType
        });
        this.search();
      } else {
          wx.navigateBack({
            delta: 1
          })
      }
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
    //隐藏航班详情显示搜索页面
    hideSelectAir(){
      this.setData({
        selectAirlShow: false,
        singleTicketShow: true,
      });
    },
    //获取乘机人列表
    search(){
      var that = this;
      var openid = 'oZDU-wVTjVXuwwKYWsD4f1RuOXYc';
      if (openid != null && openid != "") {
        this.setData({
          waitShow: true,
          noDateShow: false
        })
        var param = {
          action: "av", 
          scity: this.data.sCity, 
          ecity: this.data.eCity, 
          sdate: this.data.sDate, 
          openId: openid
        }
        httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/airTicket.ashx", param , "POST",function(res){
          if (res.Status == 1) {
            var flightInfos = res.FlightInfos.filter(function(item){
              if(item.CabInfos.length > 0){
                var CabInfos = item.CabInfos.map(function(cabInfo){
                  var FlightLowestPrice = parseInt(cabInfo.SalePrice) - parseInt(cabInfo.Promotion);
                  return Object.assign(cabInfo,{FlightLowestPrice});
                });
              };
              var Discount = item.CabInfos[0].Discount;
              var FlightNoIcon = item.FlightNo.substring(0, 2);
              return Object.assign(item,{CabInfos,Discount,FlightNoIcon});
            });
            that.setData({
              flightInfos: flightInfos,
              displayFlightInfos: flightInfos,
              waitShow: false,
            });
            that.filterByCarrier(res.FlightInfos);
            that.orderByTime(0);
          } else {
            that.setData({
              noDateShow: true,
              waitShow: false,
             });
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
      debugger
      var carriers = this.data.flightInfos;
      var flightNo =  e.currentTarget.dataset.flightno;
      var beginTime =  e.currentTarget.dataset.begintime;
      var depDate =  e.currentTarget.dataset.depdate;
      var carrier = carriers.filter(function(item){
        if(item.FlightNo==flightNo&&item.BeginTime==beginTime&&item.DepDate==depDate){
          return item
        }
      })[0];

      this.setData({
        singleTicketShow: false,
        selectAirlShow: true,
        carrier: carrier,
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
      httpRequst.HttpRequst(
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