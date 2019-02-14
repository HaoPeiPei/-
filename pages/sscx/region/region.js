// pages/wycx/xzhb/xdzf/qyxz/qyxz.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "区域选择",
      "right_icon": imgRoot+"/images/dh-b.png"
    },
    imgRoot: imgRoot,
    key: 0,
    types: 0,
    wz: "随机",
    qy: "左侧前方",
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
  //初始化
  initData(options){
    var position = options.position;
    var area = options.area;
    var key = this.data.key;
    var types = this.data.types;
    if(position == '靠窗'){
      key = 1
    }else if(position == '过道'){
      key = 2
    }else{
      key = 0
    };
    if(area == '左侧中方'){
      types = 1
    }else if(area == '左侧下方'){
      types = 2
    }else if(area == '右侧前方'){
      types = 3
    }else if(area == '右侧中方'){
      types = 4
    }else if(area == '右侧下方'){
      types = 5
    }else{
      types = 0
    }
    this.setData({
      wz: position,
      qy: area,
      key,
      types
    })
  },
  bindBackChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  bindTapChange: function (e) {
    var key = e.currentTarget.dataset.key;
    var text = e.currentTarget.dataset.text;
    this.setData({
      key: key,
      wz: text
    })
  },
  bindTapqyChange: function (e) {
    var types = e.currentTarget.dataset.types;
    var text = e.currentTarget.dataset.text;
    this.setData({
      types: types,
      qy: text
    })
  },
  bindQrChange: function () {
    var wz = this.data.wz;
    var qy = this.data.qy;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      position: wz,
      area: qy,
    });
    
    wx.navigateBack({
      delta: 1
    })

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