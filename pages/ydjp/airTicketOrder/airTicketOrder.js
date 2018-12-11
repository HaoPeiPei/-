
// pages/ydjp/airTicketOrder/airTicketOrder.js
var app = getApp();
var httpRequst = require("../../../utils/requst.js");
var {returnDate, getWeek, dateAddValue, getMD, getNowFormatDate, getDateDiff, isCardNo} = require("../../../utils/util.js");
Page({
    data:{
        airTicketOrderShow: true,
        endorseModalShow: false,
        priceDetailShow: false,
        selectPassengerShow: false,
        passengerDetailShow: false,
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
        price: {},
        singlePosition: "随机",
        singleArea: "左侧前方",
        roundPosition: "随机",
        roundArea: "左侧前方",
        ticketPrice: {},
        passenger: {},
        passeners: [],
        flightInfos: [],
        selectPasseners: [],
        pasTypePicker:{
            data: ["成人", "儿童", "婴儿"],
            index: 0,
        }, 
        pasCerPicker: {
            data: ["身份证", "护照", "其他"],
            index: 0,
        },
    },
    //乘机人乘客类型选择
    pasTypePickerChange(e){
        var pasTypePicker = Object.assign({},this.data.pasTypePicker,{
            pickerIndex:  parseInt(e.detail.value) + 1
        }) ;
        this.setData({
            pasTypePicker
        });
    },
    //乘机人乘客类型选择
    pasCerPickerChange(e){
        var pasCerPicker = Object.assign({},this.data.pasCerPicker,{
            pickerIndex:  parseInt(e.detail.value) + 1
        }) ;
        this.setData({
            pasCerPicker
        });
    },
    //初始化数据
    initDate(options){
        var carrier = JSON.parse(options.bookInfo);
        if(JSON.stringify(carrier) != {}){
            var flightInfos = carrier.FlightInfos;
            for (let index = 0; index < flightInfos.length; index++) {
                const element = flightInfos[index];
                element['depDate'] = getMD(element.DepDate);
                element['depWeek'] = getWeek(element.DepDate);
                element['arrDate'] = getMD(element.ArrDate);
                element['arrWeek'] = getWeek(element.ArrDate);
                element['aduOilTax'] = (parseInt(element.AduOil) + parseInt(element.Tax));
            }
            this.setData({
                flightInfos
            });
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
    singleServiceSelect(e){
        var buySingleService = (e.currentTarget.dataset.buysingleservice == 1 ? 0: 1);
        this.setData({
            buySingleService
        });
        this.caculatePirce();
    },
    //选择区域
    selectArea(e){
        var serviceType = e.currentTarget.dataset.type;
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
    //显示价格明细
    showPriceDetail(e){
        var priceDetailShow = e.currentTarget.dataset.pricedetailshow;
        this.setData({
            priceDetailShow: !priceDetailShow
        });
    },
    //显示选择旅客弹框
    showAddPassengerModal(){
        this.loadPassenerInfo();
        this.setData({
            airTicketOrderShow: false,
            selectPassengerShow: true,
            passengerDetailShow: false,
        })
    },
    //选择旅客页面加载乘机人列表
    loadPassenerInfo: function(){
        var that = this;
        var memberId = app.globalData.memberId;
        var selectPasseners = that.data.selectPasseners;
        var selectPassenerIds = [];
        for (var i = 0; i < selectPasseners.length; i++) {
        selectPassenerIds = selectPassenerIds.concat(selectPasseners[i]['id']);
        }
        wx.showLoading({
        title: '数据加载中...',
        });
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', {action: "get", memberId: memberId}, "POST",function(res){
        wx.hideLoading();
        var data = JSON.parse(res.Data);
        selectPasseners = [];
        for (var j = 0; j < data.length; j++) {
            if(selectPassenerIds.indexOf(data[j]['id'])!=-1){
            selectPasseners = selectPasseners.concat(data[j]);
            data[j]['active'] = true;
            }
        }
        
        that.setData({
            passeners: data,
            selectPasseners: selectPasseners
        });
        }); 
    },
    //选择旅客页面选择乘机人
    onSelectPassener: function(e){
        var passenerid = e.currentTarget.dataset.passenerid;
        var passeners = this.data.passeners;
        var passener = passeners.filter(v=>passenerid==v.id)[0] || {};
        if(JSON.stringify(passener) != '{}'){
        passener['active'] = ! passener['active'];
        var selectPasseners = passeners.filter(v=>v.active);
        this.setData({
            selectPasseners: selectPasseners,
            passeners: passeners
        });
        }
    },
    //选择旅客页面确认操作
    catchLjyy: function(){
        var selectPasseners = this.data.selectPasseners;
        if (selectPasseners.length == 0) {
            wx.showToast({
                title: '请先选择乘机人',
                icon: 'none'
            });
            return false;
        };
        this.setData({
            airTicketOrderShow: true,
            selectPassengerShow: false,
            passengerDetailShow: false,
        });
    },
    //显示新增，编辑或者旅客弹框
    showPassengerDetailModal(){
        this.setData({
            airTicketOrderShow: false,
            selectPassengerShow: false,
            passengerDetailShow: true
        })
    },
    //隐藏新增，编辑或者旅客弹框
    hidePassengerDetailModal(){
        this.setData({
            airTicketOrderShow: false,
            selectPassengerShow: true,
            passengerDetailShow: false
        })
    },
    //新增或者编辑乘机人页面验证乘机人信息
    checkPassener: function(psg_name, type, cert_no, cert_type, phone_number) {
        if (!(nameReg.test(psg_name))) {
        wx.showToast({
            title: '请按照登机所持证件填写中文或英文姓名',
            icon: 'none',
        });
        return false;
        }
        if (cert_type == 1) {
            //判断身份证
            if (!(isCardNo(cert_no))) {
                wx.showToast({
                title: '请输入有效的身份证证件信息',
                icon: 'none',
                });
                return false;
            }
        }
        if(cert_no == ''){
        wx.showToast({
            title: '证件号不能为空',
            icon: 'none',
        });
        return false;
        }
        if (!(mobileReg.test(phone_number))) {
        wx.showToast({
            title: '请输入有效的手机号码',
            icon: 'none',
        });
        return false;
        }
        return true;
    },
   //新增或者编辑乘机人页面点击确认保存操作
    submitPassener:function(e){
        var formId = e.detail.formId;
        var val = e.detail.value;
        var psg_name = val.name;
        var type = parseInt(val.type) + 1;
        var cert_no = val.cert_no;
        var cert_type = parseInt(val.cert_type) + 1;
        var phone_number = val.tel;
        var flag = this.checkPassener(psg_name, type, cert_no, cert_type, phone_number);
        if(flag){ 
            var param = { 
                action: val.action, 
                psgId: val.psgId, 
                memberId: app.globalData.memberId, 
                psg_name: psg_name, 
                cert_no: cert_no, 
                cert_type: cert_type, 
                phone_number: phone_number, 
            }
            this.savePassener(param);
        }
    },
    //保存乘机人信息
    savePassener: function(param) {
        var that = this;
        var memberId = app.globalData.memberId;
        if (memberId != null && memberId != "") {
        wx.showLoading({
            title: '数据加载中...',
        });
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', param , "POST",function(res){
            wx.hideLoading();
            if (res.Success) {
                that.showAddPassengerModal();
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
        wx.showLoading({
            title: '数据加载中...',
        });
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', { action: "del", memberId: memberId, psgId: passenerId } , "POST",function(res){
            wx.hideLoading()
            if (res.Success) {
                that.showAddPassengerModal();
            } else {

            }
        });
        }
    },
    onLoad:function(options){
        // 生命周期函数--监听页面加载
        this.initDate(options);
        this.loadService();
        this.caculatePirce();
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
})