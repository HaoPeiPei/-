// pages/grzx/yhj_details/yhj_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
      {
        "left_icon": "../../images/back-b.png",
        "title_text": "优惠卷",
        "right_icon": "",
      },
    key: 0,
    yhi_gs: "",
    conttent_text:
      [
        { backImg_url: "../../images/wycx_yhj.png", backImg_url_1: "../../images/wycx_yhj_1.png", yhxm: "无忧出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "30", },
        { backImg_url: "../../images/sscx_yhj.png", backImg_url_1: "../../images/sscx_yhj_1.png", yhxm: "舒适出行", start_item: "2017.08.19", end_item: "2017.09.27", price: "50", },
        { backImg_url: "../../images/dbc_yhj.png", backImg_url_1: "../../images/dbc_yhj_1.png", yhxm: "代泊车", start_item: "2017.08.19", end_item: "2017.09.27", price: "80", }
      ]
  },
  bindBackChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  bindTapChage: function (e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      key: key
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