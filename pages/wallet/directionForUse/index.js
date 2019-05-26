//directionForUse.js
var app = getApp();
var imgRoot = app.globalData.imgRoot;
var wwwRoot = app.globalData.wwwRoot;
Page({
  data:{
    header_text: {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "使用说明",
      "right_icon": imgRoot+"/images/dh-b.png"
    },
    imgRoot: wwwRoot+"/weixin/jctnew/"
  },
   //返回
   catchBackChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  //拨打电话
  telephone(e){
    var phoneNumber = e.currentTarget.dataset.phonenumber;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  }
})