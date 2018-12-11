// pages/wycx/addList/addList_page/addList_page.js
var values = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../../images/back-b.png",
      "title_text": "选择旅客",
      "right_icon": "../../../../images/del_icon.png",
    },
    certificate: ["身份证", "护照", "其他"],
    input_val:"身份证",
    values:[],
    model:{
      user_name: "", zjh_text: "", sjh_text:""
    }
  },
  bindBackChange: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  bindPickerChange:function(e){  
    var index = e.detail.value
    var certificate = this.data.certificate
    console.log(certificate[index])
    this.setData({
      input_val: certificate[index]
    })
  },
  bindKeyInput_0:function(e){
    var key = e.currentTarget.dataset.key;
    this.data.model[key] = e.detail.value;
    
    this.setData({
      values: this.data.model
    })   
  },
  // 清空信息
  bindDelChage:function(e){
    //console.log(1)
    //var value = this.data.value
    this.setData({
      value:""
    })
  },
  catchLjyy:function(){
    var model = this.data.model
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 1];  //当前页面
    var prevPage_1 = pages[pages.length - 2];

    prevPage_1.setData({
      model: model
    })
   
    // wx.setStorageSync('model', model);
    wx.navigateBack({
      delta:1
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