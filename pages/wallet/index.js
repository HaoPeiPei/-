//wallet.js
var app = getApp();
var imgRoot = app.globalData.imgRoot;
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../utils/requst");
Page({
  data:{
    header_text: {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_center_text": "我的钱包",
      "title_rigth_text": "明细"
    },
    imgRoot: wwwRoot+"/weixin/jctnew/"
  },
  //返回
  catchBackChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  //查看我的钱包明细
  catchRigth(){
    wx.navigateTo({
      url: './billDetail/index',
    })
  },
  //初始化页面数据
  initData(){
    this.loadUser();
  },
  //载入服务信息
  loadUser(){
    var params = { action: "get", openId: app.globalData.openId, }; 
    httpRequst.HttpRequst(true, 'weixin/jctnew/ashx/wallet.ashx', params, 'POST', res => {
      console.log(res)
      if (res.Success) {
          var user = JSON.parse(res.Data);
          this.setData({
            user
          });
      } else {
        //todo 跳转到登陆页面
        wx.showModal({
          title: '信息',
          content: '您尚未登陆或者注册,请先登陆或注册!',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../logIndex/logIndex',
              })
            } 
          }
        });
      }
    });
  },
  onLoad:function(){
    // 生命周期函数--监听页面加载
    this.initData();
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
    
  },
})