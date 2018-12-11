// pages/ddxq/jpdd/ticket_details/ticket_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "国内机票下单",
      "right_icon": "",
    },
    state:"",
    single_return:"",
    inBind_1:false,
    inBind_2:false,
    inBind_3:false,
  },
  bindBackChange: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 价格预览
  bianPriceChange:function(e){
    var inBind_1 = this.data.inBind_1;
    this.setData({
      inBind_1: !inBind_1
    });
  },
  catchBackChange1: function () {
    var inBind_1 = "";
    this.setData({
      inBind_1: inBind_1
    });
  },
  // 退改详情
  bianRetreatingChange:function(){
    var inBind_2 = this.data.inBind_2;
    this.setData({
      inBind_2: !inBind_2
    });
  },
  catchBackChange2: function () {
    var inBind_2 = "";
    this.setData({
      inBind_2: inBind_2
    });
  },
  bianReturnChange:function(){
    var inBind_3 = this.data.inBind_3;
    this.setData({
      inBind_3: !inBind_3
    });
  },
  catchBackChange3: function () {
    var inBind_3 = "";
    this.setData({
      inBind_3: inBind_3
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var state = options.state;
    var single_return = options.single_return;
    //console.log(state);
    _this.setData({
      state: state,
      single_return: single_return
    });
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