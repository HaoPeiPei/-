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
    model: [],
    aa:""
  },
  bindBackChange: function () {
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
    
    //var model = wx.getStorageSync("model")
    
    // this.setData({
    //   model: model
    // })
    // console.log(this.data.model)
    // wx.clearStorage() 
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
    console.log(this.data.model)
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