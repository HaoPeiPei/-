// pages/wycx/xzhb/xdzf/qyxz/qyxz.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../../images/back-b.png",
      "title_text": "区域选择",
      "right_icon": "../../../../images/dh-b.png"
    },
    key: 0,
    types: 1,
    wz: "随机",
    qy: "左侧中方",
    obj: ""
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
    var currPage = pages[pages.length - 1]; //当前页
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      obj: { wz: wz, qy: qy }
    });
    wx.navigateBack({
      delta: 1
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