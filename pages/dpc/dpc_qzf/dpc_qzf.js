// pages/dpc/dpc_qzf/dpc_qzf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../images/back-b.png",
      "title_text": "订单详情",
      "right_icon": "../../images/dh-b.png",
    },
    ddxq:
    [
      { "title": "接车时间", "dataStart": "2017-09-13 19:30:00"},
      { "title": "取车时间", "dataStart": "2017-09-18 21:30:00"},
      { "title": "汇合地点", "dataStart": "深圳宝安机场T3航站楼出发5号门" },
      { "title": "泊车天数", "dataStart": "5天" },
      { "title": "联系人", "dataStart": "周琦"},
      { "title": "联系电话", "dataStart": "159 8876 2000"},
    ],
    clxx:
    [
      { "title": "爱车车牌", "dataVehicle": "粤B33027" },
      { "title": "爱车型号", "dataVehicle": "奥迪A6" },
      { "title": "爱车颜色", "dataVehicle": "黑色" },
    ],
    ddxqsStart:[],
    arrayTitle:[],
    arrays:[],

  },
  bindBack:function(){
    wx.showModal({
      title: '温馨提示',
      content: '您的订单未完成支付，如果现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateBack({
            delta:1
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
    var array = this.data.ddxq;
    var arrays = this.data.arrays;
    var arrayTitle = this.data.arrayTitle;
    var ddxqsStart = this.data.ddxqsStart;
    for (var i = 0, len = array.length; i < len; i++) {
      //console.log(array[i].dataStart);
      ddxqsStart[i] = array[i].dataStart;
      arrayTitle[i] = array[i].title;
      arrays[i] = { "title": arrayTitle[i], "dataStart":ddxqsStart[i] }
    }
    
    console.log(arrays)
    this.setData({
      arrays: arrays
    });
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