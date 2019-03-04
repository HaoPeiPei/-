
// pages/ydjp/airTicketOrder/airTicketOrder.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var orderConfirmeTimer; // 确认订单计时器
var countDownTimer; //倒计时计时器
var httpRequst = require("../../../utils/requst.js");
var Hub = require("../../../utils/miniProgramSignalr.js");
var WxParse = require('../../../wxParse/wxParse.js');
var { getWeek, getMD, getNowFormatDate, getDateDiff, isCardNo, htmlspecialchars_decode} = require("../../../utils/util.js");
//乘机人姓名正则判断规则
var nameReg = /^[\u4E00-\u9fA5]{2,20}$|^(?:(?:[A-Za-z]{2,53}\/[A-Za-z]{2,53})|(?:[A-Za-z]{1,49}\s[A-Za-z]{2,50}\/[A-Za-z]{2,50})|(?:[A-Za-z]{2,50}\/[A-Za-z]{2,50}\s[A-Za-z]{1,49}))$/;
//联系手机正则
var mobileReg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
import areaList from "../../../utils/area";
Page({
    data:{
        imgRoot: imgRoot,
        airTicketOrderShow: true,
        endorseModalShow: false,
        priceDetailShow: false,
        selectPassengerShow: false,
        passengerDetailShow: false,
        hintModalShow: false,
        worryFreeModalShow: false,
        jsAlertModalShow: false,
        mulLineModalShow: false,
        buyInsurance: 1,
        buySingleService: 0,
        buyRoundService: 0,
        buyExpress: 0,
        expressPrice: 15,
        insurancePrice: 40,
        singleServicePrice: 0,
        singleServiceSalePrice: 0,
        singleServiceId: 0,
        singleCityCode: "",
        roundServicePrice:  0,
        roundServiceId: 0,
        roundCityCode: "",
        roundServiceSalePrice: 0,
        price: {
            totalPrice: 0
        },
        singlePosition: "随机",
        singleArea: "左侧前方",
        roundPosition: "随机",
        roundArea: "左侧前方",
        linkName: "",
        linkPhone: "",
        linkRegion: "",
        linkAddress: "",
        contactor: '',
        contactTel: '',
        ticketPrice: {},
        passenger: {},
        passeners: [],
        flightInfos: [],
        selectPasseners: [],
        comeEndorseTitle: '',
        backEndorseTitle: '',
        endorseModalContent: '',
        endorseType: 0,
        ser: {},
        negotiateResponese: {},
        messageHub: null,
        worryFreeType: 0,
        pasCerPicker: {
            data: ["身份证", "护照", "其他"],
            index: 0,
        },
        service_info: "",
        buy_info: "",
        refund_info: "",
        areaList: areaList,
        linkRegionShow: false,
        payType: 1, //支付方式 1:微信、
        currentTime: 60
    },
    //返回
    catchBackChange: function () {
        clearInterval(orderConfirmeTimer);
        clearInterval(countDownTimer);
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
    initDate(options){
        var carrier = JSON.parse(options.bookInfo);
        if(JSON.stringify(carrier) != "{}"){
            var flightInfos = carrier.FlightInfos;
            for (let index = 0; index < flightInfos.length; index++) {
                const element = flightInfos[index];
                element['depDate'] = getMD(element.DepDate);
                element['depWeek'] = getWeek(element.DepDate);
                element['arrDate'] = getMD(element.ArrDate);
                element['arrWeek'] = getWeek(element.ArrDate);
                element['aduOilTax'] = (parseInt(element.AduOil) + parseInt(element.Tax));
            };
            this.setData({
                flightInfos,
                contactor: app.globalData.user.realName,
                contactTel: app.globalData.user.mobile,
            });
            this.loadService();
            this.caculatePirce();
        }

    },
    //加载服务
    loadService(){
        var flightInfos = this.data.flightInfos;
        //单程
        if (flightInfos.length == 1) {
            this.loadSingleTrip();
        } else if (flightInfos.length > 1) {
            this.loadSingleTrip();
            this.loadRoundTrip();
        }
    },
    loadSingleTrip(){
        var flightInfos = this.data.flightInfos;
        var param ={
            action: "getwyservice", 
            airportCode: flightInfos[0].DepCity
        }
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/service.ashx', param, "POST",res=>{
            if(res.Success == 1){
                var model = JSON.parse(res.Data);
                var singleServicePrice = model[0].price - 50;
                var singleServiceId = model[0].id;
                var singleCityCode = flightInfos[0].DepCity;
                var singleServiceSalePrice = model[0].sell_price;
                this.setData({
                    singleServicePrice,
                    singleServiceId,
                    singleCityCode,
                    singleServiceSalePrice
                });
            }
        });
    },
    loadRoundTrip(){
        var flightInfos = this.data.flightInfos;
        var param ={
            action: "getwyservice", 
            airportCode: flightInfos[1].DepCity
        }
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/service.ashx', param, "POST", res=>{
            if(res.Success == 1){
                var model = JSON.parse(res.Data);
                var roundServicePrice = model[0].price - 50;
                var roundServiceId = model[0].id;
                var roundCityCode = flightInfos[1].DepCity;
                var roundServiceSalePrice = model[0].sell_price;
                this.setData({
                    roundServicePrice,
                    roundServiceId,
                    roundCityCode,
                    roundServiceSalePrice
                });
            }
        });
    },
    getChildOrBabyPrice(fullPrice,type){
        if (fullPrice != "" && parseInt(fullPrice) > 0){
            if (type == 1)
            {
                //儿童
                return Math.round(fullPrice * 0.5 / 10) * 10;
            }
            else if (type == 0) {
                //婴儿
                return Math.round(fullPrice * 0.1 / 10) * 10;
            }
            else {
                return 0;
            }
        }
        return 0;
    },
    getPassengerTypeCount(type){
        var selectPasseners = this.data.selectPasseners;
        var count = 0;
        selectPasseners.forEach(function (val, index) {
            if (val.type == type)
            {
                count++;
            }
        });
        return count;
    },
    //输入联系人，手机号
    bindinput(e){
        var id = e.currentTarget.id;
        this.setData({
        [id]: e.detail.value
        })
    },
    //计算价格明细
    caculatePirce(){
        var flightInfos = this.data.flightInfos;
        var price = this.data.price;
        var ticketAdultPrice = 0;       //成人票价
        var ticketChildPrice = 0;       //儿童票价
        var ticketBabyPrice = 0;        //婴儿票价
        //var servicePrice = 58;          //无忧出行服务打包机票价格
        var tax = 0;                    //税费
        var refund = 0;                 //现返
        for (var i = 0; i < flightInfos.length; i++) {
            ticketAdultPrice += parseInt(flightInfos[i].CabInfos.SalePrice) -
                parseInt(flightInfos[i].CabInfos.Promotion);
            tax += parseInt(flightInfos[i].AduOil) + parseInt(flightInfos[i].Tax);
            ticketChildPrice += this.getChildOrBabyPrice(flightInfos[i].FullPrice, 1);
            ticketBabyPrice += this.getChildOrBabyPrice(flightInfos[i].FullPrice, 0);
        }
        var adultCount = 0;
        var childCount = 0;
        var babyCount = 0;
        adultCount = this.getPassengerTypeCount(0);
        childCount = this.getPassengerTypeCount(1);
        babyCount = this.getPassengerTypeCount(2);
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
    //显示往返机票详情
    showMulLineModal(){
        this.setData({
            mulLineModalShow: true
        });
    },
    //显示退改详情
    showEndorse(carrier, sType){
        var that = this;
        httpRequst.HttpRequst(
          true,
          '/weixin/jctnew/ashx/airTicket.ashx',
          {
            "sdate": carrier.DepDate,
            "carrier": carrier.Carrier,
            "cab": carrier.CabInfos.Class,
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
            });
        }); 
    },
    //显示单程退改详情
    showSingleEndorse(){
        this.setData({
            endorseModalShow: true,
            comeEndorseTitle: '退改签详情',
        });
        if (this.data.endorseModalContent == "") {
            this.showEndorse(this.data.flightInfos[0], "0");
        }
    },
    //显示往返退改详情
    showMultiEndorse(){
        this.setData({
            endorseType: 0,
            endorseModalShow: true,
            comeEndorseTitle: '去程退改签',
            backEndorseTitle: '回程退改签',
        });
        if (this.data.endorseModalContent == "") {
            this.showEndorse(this.data.flightInfos[0], "0");
        }
    },
    //切换去回程改签详情
    endorseTypeChange(e){
        var endorseType = e.currentTarget.dataset.endorsetype;
        this.setData({
            endorseType: endorseType,
            endorseModalShow: true,
            comeEndorseTitle: '去程退改签',
            backEndorseTitle: '回程退改签',
        });
        if(endorseType == 0){
            if(this.data.endorseModalContent == ''){
                this.showEndorse(this.data.flightInfos[0], "0");
            }
        }else if(endorseType == 1){
            if(this.data.endorseModalContent == ''){
                this.showEndorse(this.data.flightInfos[1], "1");
            }
        }
    },
    //显示订购无忧出行须知
    showWorryFree(e){
        var that = this;
        var worryFreeType = e.currentTarget.dataset.worryfreetype;
        var id = this.data.singleServiceId;
        var region = this.data.singleCityCode;
        if (worryFreeType == "1") {
            id = this.data.roundServiceId;
            region = this.data.roundCityCode;
        };
        httpRequst.HttpRequst(
            true,
            '/weixin/jctnew/ashx/airTicket.ashx',
            {
                "id": id,
                "cityCode": region,
                "action": "getAddProductDetail"
            },
            "POST",
            res=> {
                if(!res){
                    return
                }
                var service_info = htmlspecialchars_decode(res.service_info);
                var buy_info = htmlspecialchars_decode(res.buy_info);
                var refund_info = htmlspecialchars_decode(res.refund_info);
                that.setData({
                    ser: res,
                    service_info: WxParse.wxParse('service_info', 'html', service_info, that, 5),
                    buy_info: WxParse.wxParse('buy_info', 'html', buy_info, that, 5),
                    refund_info: WxParse.wxParse('refund_info', 'html', refund_info, that, 5),
                    worryFreeModalShow: true
                });
          }); 
    },
    //显示航班意外险
    showHintModal(e){
        this.setData({
            hintModalShow: true,
        });
    },
    //切换订购无忧出行须知详情
    worryFreeTypeChange(e){
        var worryFreeType = e.currentTarget.dataset.worryfreetype;
        this.setData({
            worryFreeType: worryFreeType,
            worryFreeModalShow: true
        });
    },
    //隐藏保险提示信息
    hideHintModal(e){
        this.setData({
            hintModalShow: false,
        });
    },
    //隐藏往返机票信息
    hideMulLineModal(e){
        this.setData({
            mulLineModalShow: false,
        });
    },
    //隐藏订购无忧出行须知
    hideWorryFreeModal(e){
        this.setData({
            worryFreeModalShow: false,
        });
    },
    //隐藏订购无忧出行须知
    hideWorryFreeModal(e){
        this.setData({
            worryFreeModalShow: false,
        });
    },
    //隐藏退改详情
    hideEndorseModal(e){
        this.setData({
            endorseModalShow: false,
        });
    },
    //切换航班意外险
    insuranceSelect(e){
        var buyInsurance = (e.currentTarget.dataset.buyinsurance == 1 ? 0: 1);
        this.setData({
            buyInsurance
        });
        this.caculatePirce();
    },
    //切换航班意外险
    expressSelect(e){
        var buyExpress = (e.currentTarget.dataset.buyexpress == 1 ? 0: 1);
        this.setData({
            buyExpress
        });
        this.caculatePirce();
    },
    //切换无忧服务
    serviceSelect(e){
        var serviceType = e.currentTarget.dataset.servicetype;
        var servicevalue = (e.currentTarget.dataset.servicevalue == 1 ? 0: 1);
        if(serviceType == 'singleService'){
            this.setData({
                buySingleService: servicevalue
            });
        }else if(serviceType == 'roundService'){
            this.setData({
                buyRoundService: servicevalue
            });
        }
        this.caculatePirce();
    },
    //选择区域
    selectArea(e){
        var serviceType = e.currentTarget.dataset.servicetype;
        this.setData({
            serviceType
        });
        var position = '';
        var area = '';
        if(serviceType == 'singleService'){
            position = this.data.singlePosition;
            area = this.data.singleArea;
        }else if(serviceType == 'roundService'){
            position = this.data.roundPosition;
            area = this.data.roundarea;
        }
        wx.navigateTo({
            url: '../region/region?position='+position+'&area='+area+'&serviceType='+serviceType,
        })
    },
    //省市区选择
    linkRegionChange(){
        this.setData({
            linkRegionShow: true
        });
    },
    //取消省市区选择
    linkRegionCancel(){
        this.setData({
            linkRegionShow: false
        });
    },
    //省市区选择确定
    linkRegionConfirm(e){
        var detail = e.detail.detail;
        this.setData({
            linkRegion: detail.province + ' ' + detail.city + ' ' + detail.county,
            linkRegionShow: false
        });
    },
    //显示价格明细
    showPriceDetail(e){
        var priceDetailShow = e.currentTarget.dataset.pricedetailshow;
        this.setData({
            priceDetailShow: !priceDetailShow
        });
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
        var newSelectPasseners = [];
        if(JSON.stringify(passener) != '{}'){
            var selectPasseners = selectPasseners.filter(v=> v.id!=passener.id);
            this.setData({
                selectPasseners: selectPasseners
            });
        };
       this.caculatePirce(); 
    },
    //验证
    check(){
        var selectPasseners = this.data.selectPasseners;
        var flightInfos = this.data.flightInfos;
        var contactor = this.data.contactor;
        var contactTel = this.data.contactTel;
        var buyExpress = this.data.buyExpress;
        var linkName = this.data.linkName;
        var linkPhone = this.data.linkPhone;
        var linkRegion = this.data.linkRegion;
        var linkAddress = this.data.linkAddress;
        var buySingleService = this.data.buySingleService;
        var buyRoundService = this.data.buyRoundService;
        if (selectPasseners.length == 0) {
            wx.showToast({
                title: '请选择乘机人!',
                icon: 'none'
            });
            return false;
        }
        if (contactor == "") {
            wx.showToast({
                title: '请填写姓名',
                icon: 'none'
            });
            return false;
        }
        else {
            if (!nameReg.test(contactor)) {
                wx.showToast({
                    title: '请按照登机所持证件填写中文或英文姓名!',
                    icon: 'none'
                });
                return false;
            }
        }
        if (contactTel == "") {
            wx.showToast({
                title: '请填写手机号码!',
                icon: 'none'
            });
            return false;
        }
        else {
            if (!mobileReg.test(contactTel)) {
                wx.showToast({
                    title: '请输入有效的手机号码!',
                    icon: 'none'
                });
                return false;
            }
        }
        for (var i = 0; i < flightInfos.length; i++) {
            if (parseInt(selectPasseners.length) > parseInt(flightInfos[i].CabInfos.Num)) {
                wx.showToast({
                    title: flightInfos[i].FlightNo + "航班," + flightInfos[i].CabInfos.Class + "舱仅剩余" + flightInfos[i].CabInfos.Num + "张,请预订其他舱位,或修改乘机人数",
                    icon: 'none'
                });
                return false;
            }
        }
        if (buyExpress == 1) {//表示需要行程单
            if (linkName == "") {
                wx.showToast({
                    title: '请填写收件人姓名!',
                    icon: 'none'
                });
                return false;
            } else {
                if (!nameReg.test(linkName)) {
                    wx.showToast({
                        title: '收件人姓名只能填中文或英文字母！!',
                        icon: 'none'
                    });
                    return false;
                }
            }
            if (linkPhone == "") {
                wx.showToast({
                    title: '请填写联系手机!',
                    icon: 'none'
                });
                return false;
            } else {
                if (!mobileReg.test(linkPhone)) {
                    wx.showToast({
                        title: '请输入有效的手机号码！!',
                        icon: 'none'
                    });
                    return false;
                }
            }
            if (linkRegion == "") {
                wx.showToast({
                    title: '请填写所在地区!',
                    icon: 'none'
                });
                return false;
            }
            if (linkAddress == "") {
                wx.showToast({
                    title: '请填写详细地址!',
                    icon: 'none'
                });
                return false;
            }
        }
        //购买服务条件判断
        if (buySingleService == 1 || buyRoundService == 1) {
            var now = new Date(), hour = now.getHours();
            if (hour < 8 && hour > 22) {
                wx.showToast({
                    title: '抱歉,为保证服务质量,请在8:00--22:00预定服务,请通过电话进行无忧出行预约服务!',
                    icon: 'none'
                });
                return false;
            } else {
                for (var i = 0; i < flightInfos.length; i++) {
                    var currNow = getNowFormatDate();
                    var datediff = getDateDiff(currNow, flightInfos[i].DepDate + " " + flightInfos[i].BeginTime + ":00", "minute");
                    if (datediff <= 60 && flightInfos[i].DepCity == "SZX") { //从深圳出发的在一个小时内预约无忧出行，得电话联系，其它城市需要3小时
                        wx.showToast({
                            title: '抱歉,您选择的' + flightInfos[i].FlightNo + '航班,起飞时间距现在不足1小时,请通过电话预约无忧出行服务！',
                            icon: 'none'
                        });
                        return false;
                    } else if (datediff <= 180 && flightInfoModel.FlightInfos()[i].DepCity != "SZX") {
                        wx.showToast({
                            title: '抱歉,您选择的' + flightInfoModel.FlightInfos()[i].FlightNo + '航班,起飞时间距现在不足3小时,请通过电话预约无忧出行服务！',
                            icon: 'none'
                        });
                        return false;
                    }
                }
            }
        }
        return true;
    },
    //创建订单
    createOrder(){
        var that = this;
        if (this.check()) {
            var orderModel = {};
            orderModel.PayType = 1;
            var selectPasseners = this.data.selectPasseners;
            var flightInfos = this.data.flightInfos;
            orderModel.FlightInfo = flightInfos;
            orderModel.PayType = 1;
            orderModel.PassengerInfo = selectPasseners;
            //一名成人最多携带两名儿童或者一名婴儿和一名儿童
            var adlut = 0;
            var child = 0;
            var boby = 0;
            for (var i = 0; i < orderModel.PassengerInfo.length; i++) {
                var pass = orderModel.PassengerInfo[i];
                if (pass.type == "0") {
                    adlut = adlut + 1;
                } else if (pass.type == "1") {
                    child = child + 1;
                } else {
                    boby = boby + 1;
                }
            }
            if (boby > adlut) {
                wx.showToast({
                    title: '一名成人只能带一个婴儿',
                    icon: 'none'
                });
                return false;
            } else if ((child + boby) / 2 > adlut) {
                wx.showToast({
                    title: '一名成人只能带两个儿童或一个儿童和一个婴儿',
                    icon: 'none'
                });
                return false;
            }
            var insuranceModel = {};
            insuranceModel.Count = this.data.buyInsurance == 1 ? selectPasseners.length : 0;
            insuranceModel.Price = this.data.insurancePrice;
            orderModel.InsuranceInfo = insuranceModel;
            var expressModel = {};
            expressModel.Is_Delivery = this.data.buyExpress;
            expressModel.linkName = this.data.linkName;
            expressModel.linkPhone = this.data.linkPhone;
            expressModel.linkRegion = this.data.linkRegion;
            expressModel.linkAddress = this.data.linkAddress;
            orderModel.ExpressInfo = expressModel;
            orderModel.Contactor = this.data.contactor;
            orderModel.ContactTel = this.data.contactTel;
            orderModel.MemberId = app.globalData.memberId;
            orderModel.TotalPrice = this.data.price.totalPrice;
            orderModel.PayType  = this.data.payType;
            var serviceModel = {};
            var temp = [];
            if (this.data.buySingleService == 1) {
                serviceModel.ServiceId = this.data.singleServiceId;
                serviceModel.Price = this.data.singleServicePrice;
                serviceModel.AirportCode = flightInfos[0].DepCity;
                serviceModel.UseDate = flightInfos[0].DepDate +" " + flightInfos[0].BeginTime + ":00";
                serviceModel.Region = this.data.singlePosition + ' '+this.data.singleArea;
                serviceModel.FlightNo = flightInfos[0].FlightNo;
                serviceModel.DepCity = flightInfos.DepCity;
                serviceModel.DepCityName = flightInfos[0].DepCityName;
                serviceModel.ArrCity = flightInfos[0].ArrCity;
                serviceModel.ArrCityName = flightInfos[0].ArrCityName;
                serviceModel.DepDate = flightInfos[0].DepDate;
                serviceModel.ArrDate = flightInfos[0].ArrDate;
                serviceModel.BeginTime = flightInfos[0].BeginTime;
                serviceModel.EndTime = flightInfos[0].EndTime;
                serviceModel.SalePrice = this.data.singleServiceSalePrice;
                temp.push(serviceModel);
            }
            if (this.data.buyRoundService == 1) {
                serviceModel = {};
                serviceModel.ServiceId = this.data.roundServiceId;
                serviceModel.Price = this.data.roundServicePrice;
                serviceModel.AirportCode = flightInfos[1].DepCity;
                serviceModel.UseDate = flightInfos[1].DepDate + " " + flightInfos[1].BeginTime + ":00";
                serviceModel.Region = this.data.roundPosition + '' + this.data.roundarea ;
                serviceModel.FlightNo = flightInfos[1].FlightNo;
                serviceModel.DepCity = flightInfos[1].DepCity;
                serviceModel.DepCityName = flightInfos[1].DepCityName;
                serviceModel.ArrCity = flightInfos[1].ArrCity;
                serviceModel.ArrCityName = flightInfos[1].ArrCityName;
                serviceModel.DepDate = flightInfos[1].DepDate;
                serviceModel.ArrDate = flightInfos[1].ArrDate;
                serviceModel.BeginTime = flightInfos[1].BeginTime;
                serviceModel.EndTime = flightInfos[1].EndTime;
                serviceModel.SalePrice = this.data.roundServiceSalePrice;
                temp.push(serviceModel);
            }
            orderModel.ServiceInfo = temp;
            wx.showLoading({
                title: '数据加载中...',
            });
            httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/airTicket.ashx', { action: "createOrder", orderModel: JSON.stringify(orderModel) }, "POST",function(res){
                wx.hideLoading()
                if (res.Success) {
                    that.setData({
                        jsAlertModalShow: true
                    });
                    that.orderConfirme(res.Data);
                    that.countDown(); //开始倒计时
                } else {
    
                }
            });
        }
    },
    //生成微信支付参数
    createPayPara(orderId) {
        var that = this;
        if (orderId != null && orderId != "") {
            wx.showLoading({
                title: '数据加载中...',
            });
            httpRequst.HttpRequst(true, '/weixin/miniprogram/ashx/airTicket.ashx', { action: "createwxpaypara", orderId: orderId, openId: app.globalData.openId  } , "POST",function(res){
                wx.hideLoading()
                if (res.Success) {
                    var parameObj = JSON.parse(res.Data);
                    that.jsApiCall(parameObj, orderId);
                } else {
                    wx.showToast({
                        title: '创建支付参数失败,请联系客服',
                        icon: 'none'
                    });
                }
            });
        }
    },
    //调用微信JS api 支付
    jsApiCall(params, orderId) {
        wx.requestPayment(
            {
            'timeStamp': params.timeStamp,
            'nonceStr': params.nonceStr,
            'package': params.package,
            'signType': params.signType,
            'paySign': params.paySign ,
            'success':function(res){
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    payOrder(orderId);
                }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    wx.showModal({
                        title: "温馨提示", 
                        content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                        success(res) {
                            if (res.confirm) {
                                wx.switchTab({
                                    url: '../../ddxq/jpdd/jpdd'
                                });
                            } else if (res.cancel) {
                                jsApiCall(params, orderId);
                            }
                        }
                    });
                }else {
                    wx.showModal({
                        title: "温馨提示", 
                        content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                        success(res) {
                          if (res.confirm) {
                            wx.switchTab({
                                url: '../../ddxq/jpdd/jpdd'
                            }); 
                          } else if (res.cancel) {
                            jsApiCall(params, orderId);
                          }
                        }
                    });
                }
            },
            'fail':function(res){
                wx.showModal({
                    title: "温馨提示", 
                    content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                    success(res) {
                      if (res.confirm) {
                        wx.switchTab({
                            url: '../../ddxq/jpdd/jpdd'
                        }); 
                      } else if (res.cancel) {
                        jsApiCall(params, orderId);
                      }
                    }
                });
            }
        });
    },
    //支付的订单
    payOrder(orderId){
        wx.showLoading({
            title: '数据加载中...',
        });
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/airTicket.ashx', { action: "pay", orderId: orderId, status: "1" }, "POST",function(res){
            wx.hideLoading()
            if (res.Success) {
                wx.showToast({
                    title: res.Message || '支付成功',
                    icon: 'none'
                });
            } else {
                wx.showToast({
                    title: res.Message,
                    icon: 'none'
                });
            }
        });
    },
    //倒计时
    countDown(){
        var that = this;
        var w = 104;
        var h = 104;
        var context1 = wx.createCanvasContext('countDown1');
        var context2 = wx.createCanvasContext('countDown2');
        wx.createSelectorQuery().select('#countDown1').boundingClientRect(function (rect) { //监听canvas的宽高
            w = parseInt(rect.width / 2); //获取canvas宽的的一半
            h = parseInt(rect.height / 2); //获取canvas高的一半，
        }).exec();            
        function drawInnerCircle() {    // 绘制固定内圈圆
        context1.arc(w, h, w - 8, 0, 2 * Math.PI, true);  // arc-创建一条弧线；参数-arc(圆心x坐标，圆心y坐标，圆半径，起始弧度，终止弧度，弧度方向是否是逆时针)
        context1.setLineWidth("14");     // setLineWidth-设置线条宽度；参数-setLineWidth(线条宽度，单位px)
        context1.setLineCap("butt");	//圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
        context1.setStrokeStyle("#f7f7f7"); //圆环线条的颜色
        context1.stroke();            // stroke-画出当前路径的边框，默认颜色为黑色
        context1.restore();           // restore-恢复之前保存的绘图上下文
        context1.draw();    // draw-将之前在绘图上下文中的描述(路径，变形，样式)画到canvas中
        }
        function run(c, w, h) {  //c是圆环进度百分比   w，h是圆心的坐标
            let that = this;
            var num = (2 * Math.PI / 60 * c) - 0.5 * Math.PI;
            //圆环的绘制
            context2.arc(w, h, w - 8, -0.5 * Math.PI, num); //绘制的动作
            context2.setStrokeStyle("#ff0000"); //圆环线条的颜色
            context2.setLineWidth("10");	//圆环的粗细
            context2.setLineCap("butt");	//圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
            context2.stroke();
            //开始绘制百分比数字
            context2.beginPath();
            context2.setFontSize(33); // 字体大小 注意不要加引号
            context2.setFillStyle("#000");	 // 字体颜色
            context2.setTextAlign("center");	 // 字体位置
            context2.setTextBaseline("middle");	 // 字体对齐方式
            context2.fillText(c , w, h);	 // 文字内容和文字坐标
            context2.draw();
        }
        countDownTimer =  setInterval(function () {
            var currentTime = 0;
            if(that.data.currentTime<=0){
                currentTime = 59
            }else{
                currentTime = that.data.currentTime-1;
            }
            that.setData({
                currentTime
            });
            drawInnerCircle();
            run(currentTime, w, h);
        }, 1000);
    },
    //跳转订单详情
    toOrderManager(){
        wx.switchTab({
            url: '../../ddxq/ddxq'
          })
    },
    //订单确认
    orderConfirme(orderId){
        var that = this;
        orderConfirmeTimer = setTimeout(function () {
            httpRequst.HttpRequst(false, '/weixin/jctnew/ashx/airticket.ashx', { action: "getorderbyid", orderId: orderId }, "POST",function(res){
                if (res.Success) {
                    var resData = JSON.parse(res.Data);
                    if(resData.airticketOrder.Order.status==1){
                        clearInterval(orderConfirmeTimer);
                        clearInterval(countDownTimer);
                        that.createPayPara(orderId);
                    }else{
                        clearInterval(orderConfirmeTimer);
                        that.orderConfirme(orderId);
                    }
                }
            });
          }, 5000);
    },
    onLoad:function(options){
        // 生命周期函数--监听页面加载
        this.initDate(options);
    },
    onReady:function(){
        // 生命周期函数--监听页面初次渲染完成
        
    },
    onShow:function(){
        // 生命周期函数--监听页面显示
        
    },
    onHide:function(){
        // 生命周期函数--监听页面隐藏
        
    },
    onUnload:function(){
        // 生命周期函数--监听页面卸载
        clearInterval(orderConfirmeTimer);
        clearInterval(countDownTimer);
        
    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作
        
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
        
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        
    }
});