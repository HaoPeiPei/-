// pages/jd/jd_xq/jd_details/jd_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "酒店详情",
      "right_icon": "",
    },
    hotel_facilities:
    [
      { fac_icon: "../../../images/tcc_icon.png", fac_name:"停车场"},
      { fac_icon: "../../../images/wiff_icon.png", fac_name: "WLFI" },
      { fac_icon: "../../../images/ct_icon.png", fac_name: "餐厅" },
      { fac_icon: "../../../images/js_icon.png", fac_name: "健身" },
    ]
  },
  bindBackChange:function(){
    wx.navigateBack({
      delta:1
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