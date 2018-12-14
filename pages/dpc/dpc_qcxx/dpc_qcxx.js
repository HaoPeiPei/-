// pages/dpc/dpc_qcxx/dpc_qcxx.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../images/back-b.png",
      "title_text": "预约泊车",
      "right_icon": "../../images/dh-b.png",
    },
    date:'',
    time:'',
    xinx:'qcxx',
    val:""
  },
  bindqcDateChange:function(e){
   
    this.setData({
      date: e.detail.value
    });
  },
  bindBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  bindjcTimeChange:function(e) {
    
    this.setData({
      time: e.detail.value
    });
  },
  bindZfchage:function(){
    wx.navigateTo({
      url: '../dpc_qzf/dpc_qzf',
    })
  },
  bindXybchage:function(){
    var xinx = this.data.xinx;
    if(xinx == "qcxx"){
      xinx = "hcxx";
    }else if(xinx == "hcxx"){
      xinx = "clxx";
    }
    this.setData({
      xinx: xinx,
    });
  },
  bindBlurChage:function(e){
    var val = e.detail.value;
   
    if (val==""){
      wx.showToast({
        title:"请填写正确的航班号",
        icon:"none",
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000);
    } else {
      this.setData({
        val: val
      })
      //console.log(this.data.value);
      
    } 
      
  
  },
  bindChangeDa: function (e) {
    var val = e.currentTarget.dataset.hbh;
    if (val == '') {
      wx.showToast({
        title: "请填写正确的航班号",
        icon: 'none'
      })

      setTimeout(function () {
        wx.hideToast()
      }, 2000);
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