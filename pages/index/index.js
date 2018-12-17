//index.js

var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../utils/requst.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: "",
    isSZX: true,
    cityCode:'SZX',
    airportName:'深圳宝安国际机场',
    url: [
      '../images/7_26.png',
      '../images/7_28.png'
    ],
    hotServiceProject: [{
        'id': '1',
        'src': '../images/7_39.png',
        'src_1': '../images/3_43.png',
        'src_2': '../images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../wycx/wycx',
        href_code:"WYCX"
      },
      {
        'id': '2',
        'src': '../images/7_48.png',
        'src_1': '../images/3_43.png',
        'src_2': '../images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../sscx/sscx',
        href_code: "SSCX"
      },
      {
        'id': '3',
        'src': '../images/7_50.png',
        'src_1': '../images/3_43.png',
        'src_2': '../images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../dpc/dpc',
        href_code: "DBC"
      },
      {
        'id': '4',
        'src': '../images/7_52.png',
        'src_1': '../images/3_43.png',
        'src_2': '../images/3_46.png',
        'serviceTime': '05:30--23:00',
        'url': '../jsj/jsj',
        href_code: "JSJ"
      }
    ],
    advertise: "",
    wycx: {
      isNone: false,
      href: ''
    },
    sscx: {
      isNone: false,
      href: ''
    },
    gbt: {
      isNone: false,
      href: ''
    }
  },
  cityList: function() {
    wx.navigateTo({
      url: '../dwcs/dwcs'
    });

  },

  // 点击服务项目跳转页面
  switchPictures: function() {
    var url = data.hotServiceProject[0][5];
    //console.log(url);
    wx.navigateTo({
      url: ''
    });
  },
  // 载入首页轮播图片
  loadAdvertise: function() {
    var _this = this;
    var url = 'weixin/miniprogram/ashx/service.ashx';
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
  loadService: function(cityCode) {
    var _this = this; 
    var url = 'weixin/miniprogram/ashx/service.ashx';
    var params = {
      action: "getservice",
      cityCode: cityCode
    }
    httpRequst.HttpRequst(true, url, params, 'POST', function(res) {
      if (res.Success) {
        var obj = JSON.parse(res.Data);
        _this.attachService(obj);
      }  
    });
  },
  attachService: function(services){
    var _this = this;
    var cityCode = _this.data.cityCode;
    var wycxs = [];
    var sscxs = [];
    var gbts = [];
    for (var i = 0; i < services.length; i++) {
      if (services[i].service_type_code == 'WYCX') {
        wycxs.push(services[i]);
      } else if (services[i].service_type_code == 'SSCX') {
        sscxs.push(services[i]);
      } else if (services[i].service_type_code == 'GBT') {
        gbts.push(services[i]);
      }
    }
    var hotServiceProject = _this.data.hotServiceProject;
    var wycx = _this.data.wycx;
    if (wycxs != null && wycxs.length > 0) {
      var href_id = wycxs[0].id;
      var service_time = wycxs[0].service_time;
      for (var i = 0; i < hotServiceProject.length;i++){
        if (hotServiceProject[i].href_code=="WYCX"){
          var str = "hotServiceProject["+i+"].serviceTime";
          var strs = "hotServiceProject[" + i + "].url";
          _this.setData({
            [str]: service_time,
            [strs]: "../wycx/wycx?id=" + href_id
          });
        }
      }
      wycx = Object.assign(wycx,{
        isNone: true,
        href: "../wycx/wycx?id=" + href_id,
      });
      _this.setData({
        wycx: wycx,
      });
    }else {
      wycx = Object.assign(wycx,{
        isNone: false,
        href: "",
      });
      _this.setData({
        wycx: wycx,
      });
    };
    var sscx = _this.data.sscx;
    if (sscxs != null && sscxs.length > 0) {
      var href_id = sscxs[0].id;
      var service_time = sscxs[0].service_time;
      for (var i = 0; i < hotServiceProject.length; i++) {
        if (hotServiceProject[i].href_code == "SSCX") {
          var str = "hotServiceProject[" + i + "].serviceTime";
          var strs = "hotServiceProject[" + i + "].url";
          _this.setData({
            [str]: service_time,
            [strs]: "../sscx/sscx?id=" + href_id
          });
        }
      }
      sscx = Object.assign(sscx, {
        isNone: true,
        href: "../sscx/sscx?id=" + href_id
      })
      _this.setData({
        sscx: sscx,
      });
    } else {
      sscx = Object.assign(sscx, {
        isNone: false,
        href: ""
      })
      _this.setData({
        sscx: sscx,
      });
    };
    var gbt = _this.data.gbt;
    if (gbts != null && gbts.length > 0) {
      gbt = Object.assign(gbt, {
        isNone: true,
        href: "../gbt/gbt?cityCode=" + cityCode
      });
      _this.setData({
        gbt: gbt,
      });
    } else {
      gbt = Object.assign(gbt, {
        isNone: false,
        href: ""
      });
      _this.setData({
        gbt: gbt,
        gbt_href: ""
      });
    };

    //当城市不为深圳时隐藏接送机、代泊车服务、酒店服务及图标
    if (cityCode != 'SZX') {
      _this.setData({
        isSZX: false
      });
    }else{
      _this.setData({
        isSZX: true
      });
    }
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
    this.loadService(app.globalData.cityCode);
    this.setData({
      cityCode: app.globalData.cityCode,
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