// pages/wycx/xzhb/xdzf/xdzf.js
var { getWeek, getMD, getNowFormatDate, getDateDiff, isCardNo} = require("../../../utils/util.js");
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
    yhi_gs: 0,
    obj:"",
    price:"",
    flightInfos:"",
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
    wx.navigateTo({
      url: 'yhj/yhj',
    })
  },
  bindQyxzChange:function(){
    wx.navigateTo({
      url: 'qyxz/qyxz',
    });
  },
  //初始化数据
  initDate(options){
    var carrier = JSON.parse(options.bookInfo);
    if(JSON.stringify(carrier) != {}){
        var flightInfos = carrier.FlightInfos;
        for (let index = 0; index < flightInfos.length; index++) {
            const element = flightInfos[index];
            element['depDate'] = getMD(element.DepDate);
            element['depWeek'] = getWeek(element.DepDate);
            element['arrDate'] = getMD(element.ArrDate);
            element['arrWeek'] = getWeek(element.ArrDate);
            element['aduOilTax'] = (parseInt(element.AduOil) + parseInt(element.Tax));
        }
        this.setData({
            flightInfos
        });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.initDate(options);
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
    var _this = this;
    var obj = _this.data.obj;
    console.log(obj)
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