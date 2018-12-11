// pages/wycx/xzhb/xdzf/xdzf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "无忧出行下单",
      "right_icon": "../../../images/dh-b.png",
    },
    yhi_gs: "3",
    obj: "",
    price: ""
  },
  bindBackChange: function () {
    wx.showModal({
      title: '温馨提示',
      content: '您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  bindYhjChange: function () {
    var yhi_gs = this.data.yhi_gs;
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页
    // var prevPage = pages[pages.length + 1]; //上一个页面
    // prevPage.setData({
    //   yhi_gs: yhi_gs
    // });
    wx.navigateTo({
      url: 'yhj/yhj?yhi_gs='+yhi_gs,
    })
  },
  bindQyxzChange: function () {
    wx.navigateTo({
      url: 'qyxz/qyxz',
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