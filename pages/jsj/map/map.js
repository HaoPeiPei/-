// pages/jsj/map/map.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var amap = require("../../../utils/amap");
var bmap = require("../../../utils/bmap-wx.min.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-f.png",
      "title_text": "接送地址",
      "right_icon": imgRoot+"/images/dh-f.png"
    },
    imgRoot: imgRoot,
    longitude: 0,
    latitude: 0,
    seekList: []
  },
  //返回
  catchBackChange: function (e) {
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
  initData(){
    this.mapCtx = wx.createMapContext('map');
    this.BMap = new bmap.BMapWX({
      ak: '32nOnN3jF3mfT0encQETVs3M'
    });
    amap.getRegeo()
      .then(d => {
        let { name, desc, latitude, longitude } = d[0];
        let { city } = d[0].regeocodeData.addressComponent;
        let seekList = d[0].regeocodeData.pois || [];
        this.setData({
          city,
          latitude,
          longitude,
          seekList
        });
      })
      .catch(e => {
        this.setData({ 
          latitude: 114.06777,//纬度
          longitude: 22.547331,//经度
        }); 
        //this.regeocoder();
      })

  },
  //输入提示
  autoSearch(e) {
    var pageNum = e.currentTarget.dataset.pagenum;
    var cityName = "深圳";
    var keywords = e.detail.value;
    if (keywords) {
      amap.getInputtips(cityName, '', keywords)
        .then(d => {
            var seekList = d.tips || [];
            this.setData({
              seekList
            });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  //选择地址
  selectSeek(e){
    var address = e.currentTarget.dataset.address;
    var addressName = e.currentTarget.dataset.addressname;
    var location = e.currentTarget.dataset.location.split(',');
    var lat = location.length > 1 && location[0];
    var lng = location.length >= 2 && location[1];
    var pages = getCurrentPages();
    var prevPage = pages[pages.length -2]; //上一个页面
    prevPage.setData({
      address,
      addressName,
      lat,
      lng,
     });
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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