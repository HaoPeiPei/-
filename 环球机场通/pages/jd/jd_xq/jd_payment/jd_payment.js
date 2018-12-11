// pages/jd/jd_xq/jd_payment/jd_payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "深圳机场大酒店",
      "right_icon": "../../../images/dh-b.png",
    },
    values_1:"请选择入住房时间",
    values_2: "请选择离店房时间",
    number_rooms:[1,2,3,4,5,6,7,8,9,10],
    indexs:1,
    inBind:false
  },
  bindDateChange_1:function(e){
    var values_1 = e.detail.value;
    this.setData({
      values_1: values_1,
    })
  },
  bindDateChange_2: function (e) {
    var values_2 = e.detail.value;
    this.setData({
      values_2: values_2
    })
  },
  bindLengChange:function(e){
    var indexs = e.currentTarget.dataset.indexs;
    this.setData({
      indexs: indexs
    })
  },
  bindListChange:function(){
    var inBind = this.data.inBind;
    this.setData({
      inBind: !inBind
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