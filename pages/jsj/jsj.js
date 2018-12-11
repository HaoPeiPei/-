// pages/jsj/jsj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "background_url": "../images/a.png",
      "left_icon": "../images/back-1.png",
      "title_text": "舒适出行",
      "right_icon": "../images/dh.png"
    },
    inBind:true,
    key:0,
    dd_date:"",
    tm_date:""
  },
  bindBackChages: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  bindNavChage:function(){
    wx.navigateTo({
      url: 'cxxz/cxxz',
    })
  },
  //切换接送机
  bindTapChage:function(e){
    var inBind = this.data.inBind;

    var key = e.currentTarget.dataset.key;
    this.setData({
     key:key
    })
  },
  //地图
  bindMapChage:function(){
    wx.navigateTo({
      url: 'map/map',
    })
  },
  //到达时间选择
  bindDateChage:function(e){
    var dd_date = e.detail.value;
    this.setData({
      dd_date: dd_date
    })
  },
  bindTimeChage:function(e){
    var tm_date = e.detail.value;
    this.setData({
      tm_date: tm_date
    })
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