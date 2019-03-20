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
    markers: [],
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
        console.log('catch'+e);
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
  //请求授权
  getUserLocation: function(){
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 2000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })
                      //再次授权，调用getLocationt的API
                      that.initData();
                    }else{
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          that.initData();
        }else{
          that.initData();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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