// pages/gbt/gbtDetails/qrdd/qrdd.js
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
    valueString:"",
    yhi_gs:0
  },
  bindDateChange:function(e){
    var val = e.detail.value;
    
    this.setData({
      valueString: val
    })
  },
  bindYhjChange:function(){
    wx.navigateTo({
      url: 'yhj/yhj',
    })
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
  // 支付
  bindZfChange:function(){
    var valueString = this.data.valueString;
    if (valueString != ""){
      wx.navigateTo({
        url: '',
      })
    }else{
      wx.showToast({
        icon:"none",
        title:"请选择使用该日期",
      });
      setTimeout(function(){
        wx.hideToast();
      },2000);
    }
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