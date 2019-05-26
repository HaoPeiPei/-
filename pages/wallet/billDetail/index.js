//valet.js
var app = getApp();
var imgRoot = app.globalData.imgRoot;
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../../utils/requst.js");
Page({
  data:{
    header_text: {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "充值提现明细",
      "right_icon": imgRoot+"/images/dh-b.png"
    },
    imgRoot: wwwRoot+"/weixin/jctnew/",
    bills: [],
    pageindex: 1,
    pagesize: 5
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
  //初始化页面数据
  initData(){
    this.loadBills();
  },
  //载入明细
  loadBills(){
    var params = { 
      action: "getlist", 
      pagesize: this.data.pagesize, 
      pageindex: this.data.pageindex, 
      userid: app.globalData.memberId,
    }; 
    httpRequst.HttpRequst(true, 'weixin/jctnew/ashx/wallet.ashx', params, 'POST', res => {
      if (res.Success) {
          var bills = JSON.parse(res.Data);
          if (bills.length == 0) {
            wx.showToast({
              title: "没有更多数据",
              icon: "none"
            });
          }else{
            this.setData({
              bills
            });
          }
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
  onLoad:function(options){
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
    
  }
})