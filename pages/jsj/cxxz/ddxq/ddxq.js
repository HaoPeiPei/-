// pages/jsj/cxxz/ddxq/ddxq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "确认订单",
      "right_icon": "../../../images/dh-b.png"
    },
    order_details:
    {
      "vehicle_type":"经济型",
      "connecting_place":"深圳宝安国际机场T3航站楼",
      "delivery_place":"怀德社区咸田3区",
      "car_time":"2018-05-24"
    },
    contacts:
    {
      user_name:"周琦",
      cellPhone_number:"13518645266"
    },
    key:1,
    inBind:false,
    yhi_gs:0
  },
  bindBackChange:function(e){
    wx.showModal({
      title: '温馨提示',
      content: '您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta:1
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  catchRsChage:function(e){
    var key = e.currentTarget.dataset.key;
    this.setData({
      key:key
    })
  },
  bindXlChage:function(){
    var inBind = this.data.inBind;
    this.setData({
      inBind: !inBind
    })
  },
  bindYhjChage:function(){
    wx.navigateTo({
      url: 'yhj/yhj',
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