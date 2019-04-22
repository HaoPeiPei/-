//index.js

var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: "",
    isSZX: true,
    airportCode:'SZX',
    airportName:'深圳宝安国际机场',
    imgRoot: imgRoot,
    url: [
      imgRoot+'/images/7_26.png',
      imgRoot+'/images/7_28.png'
    ],
    hotServiceProject: [{
        'id': '1',
        'src': imgRoot+'/images/7_39.png',
        'src_1': imgRoot+'/images/3_43.png',
        'src_2': imgRoot+'/images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../wycx/wycx',
        href_code:"WYCX"
      },
      {
        'id': '2',
        'src': imgRoot+'/images/7_48.png',
        'src_1': imgRoot+'/images/3_43.png',
        'src_2': imgRoot+'/images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../sscx/sscx',
        href_code: "SSCX"
      },
      {
        'id': '3',
        'src': imgRoot+'/images/7_50.png',
        'src_1': imgRoot+'/images/3_43.png',
        'src_2': imgRoot+'/images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../dpc/dpc',
        href_code: "DBC"
      },
      {
        'id': '4',
        'src': imgRoot+'/images/7_52.png',
        'src_1': imgRoot+'/images/3_43.png',
        'src_2': imgRoot+'/images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../jsj/jsj',
        href_code: "JSJ"
      }
    ],
    advertise: "",
    wycx: {
      isNone: false,
      href: '',
      serviceTime: '06:30~22:30'
    },
    sscx: {
      isNone: false,
      href: ''//06:30~22:30
    },
    gbt: {
      isNone: false,
      href: '',
      serviceTime: '06:30~22:30'
    }
  },
  cityList: function() {
    wx.navigateTo({
      url: '../dwcs/dwcs'
    });

  },
  //拨打电话
  telephone(e){
    var phoneNumber = e.currentTarget.dataset.phonenumber;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },
  toMiniProgramSuccess(res){
      //从其他小程序返回的时候触发
      wx.showToast({
        title: '跳转成功'
      })
  },
  toMiniProgramFail(res){
      //从其他小程序返回的时候触发
      console.log(res)
      wx.showToast({
        title: '跳转失败'
      })
  },
  // 载入首页轮播图片
  loadAdvertise: function() {
    var _this = this;
    var url = 'weixin/jctnew/ashx/service.ashx';
    var params = {
      action: "advertise"
    }
    httpRequst.HttpRequst(true, url, params, 'POST', function(res) {
      if (res.Success) {
        var advertise = res.Data;
        advertise = JSON.parse(advertise);
        _this.setData({
          advertise: advertise
        });
        var imgUrls = [];
        for (var i = 0; i < advertise.length; i++) {
          imgUrls[i] = wwwRoot + advertise[i].path;
        }
        _this.setData({
          imgUrls: imgUrls
        });
      }
    });
  },
  //载入服务信息
  loadService: function(airportCode) {
    var _this = this; 
    var url = 'weixin/jctnew/ashx/service.ashx';
    var params = {
      action: "getservice",
      airportCode: airportCode
    }
    httpRequst.HttpRequst(true, url, params, 'POST', function(res) {
      if (res.Success) {
        var obj = JSON.parse(res.Data);
        _this.attachService(obj);
      }  
    });
  },
  attachService: function(services){
    if(services.length==0){
      return
    }
    var _this = this;
    var airportCode = _this.data.airportCode;
    var wycxs = services.filter(v=>v.service_type_code=="WYCX") || [];
    var sscxs = services.filter(v=>v.service_type_code=="SSCX") || [];
    var gbts = services.filter(v=>v.service_type_code=="GBT") || [];
    var wycx = Object.assign(_this.data.wycx,{
      isNone: false,
      href: "",
    });
    var sscx = Object.assign(_this.data.sscx, {
      isNone: false,
      href: ""
    });
    var gbt = Object.assign(_this.data.gbt, {
      isNone: false,
      href: ""
    });
    var isSZX = false;
    if (wycxs != null && wycxs.length > 0) {
      var href_id = wycxs[0].id;
      var service_time = wycxs[0].service_time;
      wycx = Object.assign(_this.data.wycx,{
        isNone: true,
        href: "../wycx/wycx?id=" + href_id,
        serviceTime: service_time,
      });
      
    }
    if (sscxs != null && sscxs.length > 0) {
      var href_id = sscxs[0].id;
      var service_time = sscxs[0].service_time;
      sscx = Object.assign(_this.data.sscx, {
        isNone: true,
        href: "../sscx/sscx?id=" + href_id,
        serviceTime: service_time,
      })
    }
    if (gbts != null && gbts.length > 0) {
      gbt = Object.assign(_this.data.gbt, {
        isNone: true,
        href: "../gbt/gbt?cityCode=" + airportCode
      });
    } 

    //当城市不为深圳时隐藏接送机、代泊车服务、酒店服务及图标
    if (airportCode != 'SZX') {
      isSZX = false;
    }else{
      isSZX = true;
    }
    _this.setData({
      wycx,
      sscx,
      gbt,
      isSZX
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    wx.showLoading({
      title: "加载中...",
    });
    _this.loadAdvertise();
    wx.hideLoading();

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
    this.loadService(app.globalData.airportCode);
    this.setData({
      airportCode: app.globalData.airportCode,
      airportName: app.globalData.airportName,
    });
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