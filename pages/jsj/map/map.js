// pages/jsj/map/map.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var amap = require("../../../utils/amap");
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
    seekList: [],
    markers: []
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
    var that = this;
    amap.getRegeo()
      .then(d => {
        var marker = [{
          id: d[0].id,
          latitude: d[0].latitude,
          longitude: d[0].longitude,
          iconPath: d[0].iconPath,
          width: d[0].width,
          height: d[0].height
        }]
        let { name, desc, latitude, longitude } = d[0];
        let { city } = d[0].regeocodeData.addressComponent;
        let seekList = d[0].regeocodeData.pois || [];
        that.setData({
          markers: marker,
          city,
          latitude,
          longitude,
          seekList
        });
      })
      .catch(e => {
        that.setData({ 
          latitude: 114.06777,//纬度
          longitude: 22.547331,//经度
        }); 
      })
  },
  //输入提示
  autoSearch(e) {
    var that = this;
    var cityName = "深圳";
    var keywords = e.detail.value;
    if (keywords) {
      amap.getInputtips(cityName, '', keywords)
        .then(d => {
            var seekList = d.tips || [];
            that.setData({
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