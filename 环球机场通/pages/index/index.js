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
    inBind:true,
    inNone:true,
    wycx_href:"../wycx/wycx",
    sscx_href:"../sscx/sscx",
    gbt_href:"../gbt/gbt",
    inHref:false,
    airportCode: app.globalData.airportCode,
    airportName: app.globalData.airportName,
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
      //console.log(res);
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
    var url = 'weixin/miniprogram/ashx/service.ashx';
    var params = {
      action: "getservice",
      airportCode: airportCode
    }
    httpRequst.HttpRequst(true, url, params, 'POST', function(res) {
      //console.log(res.Data);
      if (res.Success) {
        var obj = JSON.parse(res.Data);
        var wycx = [];
        var sscx = [];
        var gbt = [];
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].service_type_code == 'WYCX') {
            wycx.push(obj[i]);
          } else if (obj[i].service_type_code == 'SSCX') {
            sscx.push(obj[i]);
          } else if (obj[i].service_type_code == 'GBT') {
            gbt.push(obj[i]);
          }
        }
        //console.log(wycx);
        //console.log(sscx);
       // console.log(gbt);
        var hotServiceProject = _this.data.hotServiceProject;
        if (wycx != null && wycx.length > 0) {
          var href_id = wycx[0].id;
          var service_time = wycx[0].service_time;
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
          var wycx_href = _this.data.wycx_href;
          _this.setData({
            wycx_href: "../wycx/wycx?id=" + href_id
          });
        }else if (sscx != null && sscx.length > 0) {
          var href_id = sscx[0].id;
          var service_time = sscx[0].service_time;
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
          var sscx_href = _this.data.sscx_href;
          _this.setData({
            sscx_href: "../sscx/sscx?id=" + href_id
          });
        } else if (gbt != null && gbt.length > 0) {
          var href_id = gbt[0].id;
          var gbt_href = _this.data.gbt_href;
          _this.setData({
            gbt_href: "../gbt/gbt?airportCode=" + airportCode
          });
        } else {
          _this.setData({
            inBind: !inBind
          });
        };

        //当城市不为深圳时隐藏接送机、代泊车服务、酒店服务及图标
        if (airportCode != 'SZX') {
          var inNone = _this.data.inNone;
          _this.setData({
            inNone: !inNone
          });
        }else{
          var inHref = _this.data.inHref;
          _this.setData({
            inHref: !inHref
          });
        }
      }
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
    var cityCode = "SZX";
    _this.loadService(cityCode);
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