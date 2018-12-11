// pages/sscx/addList/addList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "选择旅客",
      "right_icon": "",
    },
   
    model: '',
    model_1:[],
    inCatch:true
  },
  bindBackChange: function () {
    wx.navigateBack({
      delta: 1
    }) 
  },
  catchLjyy: function () {
    var model = this.data.model
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 1];  //当前页面
    var prevPage_1 = pages[pages.length - 2];

    prevPage_1.setData({
      model: model
    })

    wx.navigateBack({
      delta: 1
    })
  },
  bindNavChage:function(){
    wx.navigateTo({
      url: 'addList_page/addList_page',
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
    var model_1 = this.data.model_1
    var model = this.data.model
    if (model!=""){
      model_1.push(model)
    }
    this.setData({
      model_1: model_1
    })
    
  },
  catchXz:function(){
    var inCatch = this.data.inCatch
    this.setData({
      inCatch: !inCatch
    })
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