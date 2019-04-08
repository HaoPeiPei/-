// pages/dwcs/dwcs.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst.js");
import {FlightCityList} from '../../../utils/city.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgRoot: imgRoot,
    characterCity:[],
    recentList: [],
    d_r: [],
    currentCityName:"",
    ticketType:''
  },
  bindBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  alphabet:function(e){
    var text = e.currentTarget.dataset.text;
    this.setData({
      text: text
    })  
  },
  //请求授权
  getUserLocation: function(){
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        }
        else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    });
  },
  //微信获得经纬度
  getLocation: function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getLocal(longitude, latitude)
      },
      fail: function(err){

      }
    })
  },
  //获取当前地理位置
  getLocal: function(longitude, latitude){
    var that = this;
    var url = 'https://api.map.baidu.com/geocoder/v2/?ak=32nOnN3jF3mfT0encQETVs3M&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84'
     wx.request({
      url: url,
      data: {},
      header: {
      'Content-Type': 'application/json'  
      },
      success: function (res) {
        var city = res.data.result.addressComponent.city;
        that.setData({
          currentCityName: city.split('市')[0]
        });
      },
      fail: function () {
      // fail 
      },
      complete: function () {
      // complete 
      }
     })
  },
  //载入航空城市
  loadAirCity(){
    var characterCity = [];
    var d_r = [];
    for (var key in FlightCityList) {
      d_r.push({
        key:key
      });
      var city_information = [];
      for (var  index = 0; index < FlightCityList[key].length; index++) {
        var city = FlightCityList[key][index];
        city_information.push({
          data_id: city["CityThreeSign"],
          data_type: city["CityNameSimpleEn"],
          city: city["CityName"],
        });
      }
      characterCity.push({
        data_text: key+"-start-list",
        data_title: key,
        city_information:city_information
      });
      this.setData({
        d_r,
        characterCity
      })
    }
  },
  //是否存在搜索历史城市
  isCityInRecent(recentCity) {
    var recentList = this.data.recentList;
    for (var j = 0; j < recentList.length; j++){
      if (recentList[j].city == recentCity.city){
        return false;
      }
    } 
    return true;
  },
  //修改搜索历史城市
  updateRecentList: function(recentCity){
    if (JSON.stringify(recentCity) != "{}") {
      var recentList = this.data.recentList;
      var flag = this.isCityInRecent(recentCity);
      if(flag){
        if(recentList.length >= 6){
          recentList.splice(5, 1);
          recentList.splice(0, 0, recentCity);
        }else{
          recentList = recentList.concat(recentCity);
        }
      };
      wx.setStorageSync('recentCityListForFlight_JCTAir', recentList);
    }
  },
  //点击选择城市并返回首页
  doReturn: function(e){
    var ticketType = this.data.ticketType;
    var code = e.currentTarget.dataset.id;
    var city = e.currentTarget.dataset.city;
    var type = e.currentTarget.dataset.type;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页
    var prevPage = pages[pages.length - 2]; //上一个页面
    if(ticketType == "depCity"){
      prevPage.setData({
        depCityName: city,
        depCityCode: code 
      });
    }else if(ticketType == "arrCity"){
      prevPage.setData({
        arrCityName: city,
        arrCityCode: code
      });
    }
    var recentCity = {
      data_id: code,
      data_type: type,
      city: city,
   };
   this.updateRecentList(recentCity);
   wx.navigateBack({
    delta: 1
   });
  },
  //缓存获取搜索历史城市
  getStorageRecentList: function(){
    var recentList = wx.getStorageSync('recentCityListForFlight_JCTAir') || [];
    if(recentList.length > 6){
      recentList.splice(6, 1);
    }
    this.setData({
      recentList: recentList
    });
  },
  //初始化数据
  initData(options){
    var ticketType = options.ticketType;
    this.setData({
      ticketType
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
    this.getUserLocation();
    //载入航空城市
    this.loadAirCity();
    this.getStorageRecentList();
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