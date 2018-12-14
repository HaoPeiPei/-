// pages/jsj/cxxz/cxxz.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../images/back-b.png",
      "title_text": "车型选择",
      "right_icon": "../../images/dh-b.png"
    },
    // 车型
    carModel:
    [
      { "imagUrl": "../../images/jingjixing.png", "tk_scopeOfUse": "锋范 伊兰特等同级车", "scopeOfUse": "经济型", "price": "43", "keyWord": ["经济", "实惠"] },
      { "imagUrl": "../../images/shangwuche.png", "tk_scopeOfUse": "别克GL8 奥德赛等同级车", "scopeOfUse": "商务型", "price": "46", "keyWord": ["舒适", "大空间"] },
      { "imagUrl": "../../images/haohuache.png", "tk_scopeOfUse": "奔驰 奥迪A6系列等同级车", "scopeOfUse": "豪华型", "price": "53", "keyWord": ["品味", "享受"] },
    ]
  },
  bindBackChages: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  bindYyChage:function(){
    wx.navigateTo({
      url: 'ddxq/ddxq',
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