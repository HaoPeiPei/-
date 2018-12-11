// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials:true,
            success: function (res) {
              console(res.userInfo)
              console(res.iv)
              console.log("成功");
            },
            fail:function(){
              console.log("失败");
            }
          })
        }
      }
    })
  },
  bindGetUserInfo:function (e) {
    console.log("userInfo:"+e.detail.userInfo);
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    console.log("iv:"+e.detail.iv);
    console.log("encryptedData:"+e.detail.encryptedData);
    wx.login({
      success:function(res){
        var code = res.code;
        console.log("code:"+res.code);
        wx.request({
          url: "https://www.51jct.cn/weixin/miniprogram/ashx/user.ashx",
          data:
          {
            code:code,
            iv:iv,
            encryptedData: encryptedData,
            action: "getUserInfo"
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success:function(user_res){
            var data = JSON.parse(user_res.data.Data);
            console.log(data.openId)
          }
        })
      }
    })
    
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