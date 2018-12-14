// pages/jd/jd_xq/jd_xq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "imgUrls": ["../../images/hotel_bg.png", "../../images/worryFree.png"],
      "left_icon": "../../images/back-f.png",
      "title_text": "",
      "right_icon": "../../images/dh-f.png"
    },
    room_details:
    [
      { room_imgURL:"../../images/hhdrj_img.png", type_room: "豪华单人间", room_area: "26", room_floor: "2~8", room_price:"264"},
      { room_imgURL: "../../images/hhsrj_img.png", type_room: "豪华双人间", room_area: "26", room_floor: "2~8", room_price: "253" }, 
      { room_imgURL: "../../images/bzsrj_img.png", type_room: "标准双人间", room_area: "26", room_floor: "2~8", room_price: "214" }, 
    ]
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  bindHotelDetails:function(){
    wx.navigateTo({
      url: 'jd_details/jd_details',
    })
  },
  bianPayment:function(){
    wx.navigateTo({
      url: 'jd_payment/jd_payment',
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