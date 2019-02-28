// pages/dwcs/dwcs.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../utils/requst.js");
var amap = require("../../utils/amap");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgRoot: imgRoot,
    hotCity:
    [
      { data_id: "SZX", data_type: "sz", data_value: "深圳宝安国际机场", city:"深圳"},
      { data_id: "PVG", data_type: "sh", data_value: "上海浦东国际机场", city: "上海浦东" },
      { data_id: "CAN", data_type: "gz", data_value: "广州白云国际机场", city: "广州" },
      { data_id: "TNA", data_type: "jn", data_value: "济南遥墙国际机场", city: "济南" },
      { data_id: "URC", data_type: "wlmq", data_value: "乌鲁木齐地窝堡国际机场", city: "乌鲁木齐" },
      { data_id: "NGB", data_type: "nb", data_value: "宁波栎社国际机场", city: "宁波" },
      { data_id: "CGO", data_type: "zz", data_value: "郑州新郑国际机场", city: "郑州" },
      { data_id: "HGH", data_type: "hz", data_value: "杭州萧山国际机场", city: "杭州" },
      { data_id: "XIY", data_type: "xa", data_value: "西安咸阳国际机场", city: "西安" },
      { data_id: "WNZ", data_type: "wz", data_value: "温州国际机场", city: "温州" } 
    ],
    characterCity:
    [
      { 
        data_text: "C-start-list", 
        data_title:"C",
        city_information:
        [
          { data_id: "CSX", data_type: "cs", data_value: "长沙黄花国际机场", city: "长沙" },
          { data_id: "CZX", data_type: "cz", data_value: "常州国际机场", city: "常州" }
        ]
      },
      {
        data_text: "D-start-list",
        data_title: "D",
        city_information:
        [
          { data_id: "DLC", data_type: "dl", data_value: "大连金洲湾国际机场", city: "大连" },
        ]
      },
      {
        data_text: "G-start-list",
        data_title: "G",
        city_information:
        [
          { data_id: "CAN", data_type: "gz", data_value: "广州白云国际机场", city: "广州" },
          { data_id: "KWE", data_type: "gy", data_value: "贵阳龙洞堡国际机场", city: "贵阳" },
        ]
      },
      {
        data_text: "H-start-list",
        data_title: "H",
        city_information:
        [
          { data_id: "HGH", data_type: "hz", data_value: "杭州萧山国际机场", city: "杭州" },
          { data_id: "HFE", data_type: "hf", data_value: "合肥新桥国际机场", city: "合肥" },
        ]
      },
      {
        data_text: "J-start-list",
        data_title: "J",
        city_information:
        [
          { data_id: "TNA", data_type: "jn", data_value: "济南遥墙国际机场", city: "济南" },
          { data_id: "JZH", data_type: "jzg", data_value: "九寨沟黄龙国际机场", city: "九寨沟" },
        ]
      },
      {
        data_text: "L-start-list",
        data_title: "L",
        city_information:
        [
          { data_id: "LXA", data_type: "ls", data_value: "拉萨贡嘎国际机场", city: "拉萨" },
          { data_id: "LJG", data_type: "lj", data_value: "丽江三义国际机场", city: "丽江" },
        ]
      },
      {
        data_text: "N-start-list",
        data_title: "N",
        city_information:
        [
          { data_id: "KHN", data_type: "nc", data_value: "南昌昌北国际机场", city: "南昌" },
          { data_id: "NNG", data_type: "nn", data_value: "南宁吴圩国际机场", city: "南宁" },
          { data_id: "NGB", data_type: "nb", data_value: "宁波栎社国际机场", city: "宁波" },
        ]
      },
      {
        data_text: "Q-start-list",
        data_title: "Q",
        city_information:
        [
          { data_id: "TAO", data_type: "qd", data_value: "青岛胶东国际机场  ", city: "青岛" },
        ]
      },
      {
        data_text: "S-start-list",
        data_title: "S",
        city_information:
        [
          { data_id: "PVG", data_type: "sh", data_value: "上海浦东国际机场", city: "上海浦东" },
          { data_id: "SZX", data_type: "sz", data_value: "深圳宝安国际机场", city: "深圳" },
          { data_id: "SJW", data_type: "sjz", data_value: "石家庄正定国际机场", city: "石家庄" },
        ]
      },
      {
        data_text: "T-start-list",
        data_title: "T",
        city_information:
        [
          { data_id: "TYN", data_type: "ty", data_value: "太原武宿国际机场  ", city: "太原" },
        ]
      },
      {
        data_text: "W-start-list",
        data_title: "W",
        city_information:
        [
          { data_id: "WNZ", data_type: "wz", data_value: "温州国际机场", city: "温州" },
          { data_id: "URC", data_type: "wlmq", data_value: "乌鲁木齐地窝堡国际机场", city: "乌鲁木齐" },
        ]
      },
      {
        data_text: "X-start-list",
        data_title: "X",
        city_information:
        [
          { data_id: "XIY", data_type: "xa", data_value: "西安咸阳国际机场", city: "西安" },
          { data_id: "XMN", data_type: "xm", data_value: "厦门高崎国际机场", city: "厦门" },
          { data_id: "XIC", data_type: "xc", data_value: "西昌青山国际机场", city: "西昌" },
          { data_id: "XUZ", data_type: "xz", data_value: "徐州观音国际机场", city: "徐州" },
        ]
      },
      {
        data_text: "Y-start-list",
        data_title: "Y",
        city_information:
        [
          { data_id: "INC", data_type: "yc", data_value: "银川河东国际机场  ", city: "银川" },
        ]
      },
      {
        data_text: "Z-start-list",
        data_title: "Z",
        city_information:
        [
          { data_id: "CGO", data_type: "zz", data_value: "郑州新郑国际机场", city: "郑州" },
          { data_id: "ZUH", data_type: "zh", data_value: "珠海金湾国际机场", city: "珠海" },
        ]
      },
    ],
    recentList: [],
    currentCityName:"",
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
    amap.getRegeo()
      .then(d => {
        let { city } = d[0].regeocodeData.addressComponent;
        that.setData({
          currentCityName: city.split('市')[0]
        });
      })
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
      wx.setStorageSync('recentCityListForFlight', recentList);
    }
  },
  //点击选择城市并返回首页
  doReturn: function(e){
    var airportCode = e.currentTarget.dataset.id;
    var airportName = e.currentTarget.dataset.value;
    var type = e.currentTarget.dataset.type;
    var city = e.currentTarget.dataset.city;
    app.globalData.airportCode = airportCode;
    app.globalData.airportName = airportName;
    var recentCity = {
      data_id: airportCode,
      data_type: type,
      data_value: airportName,
      city: city,
   };
   this.updateRecentList(recentCity);
   wx.navigateBack({
    delta: 1
   });
  },
  //缓存获取搜索历史城市
  getStorageRecentList: function(){
    var recentList = wx.getStorageSync('recentCityListForFlight') || [];
    if(recentList.length > 6){
      recentList.splice(6, 1);
    }
    this.setData({
      recentList: recentList
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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