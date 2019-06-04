//valet.js
var app = getApp();
var imgRoot = app.globalData.imgRoot;
var wwwRoot = app.globalData.wwwRoot;
var httpRequst = require("../../../utils/requst.js");
var bankReg = /^(\d{16}|\d{19})$/;          //银行账号正则
var reg = /^\d+(\.\d{1,2})?$/
Page({
  data:{
    header_text: {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "提现",
      "right_icon": imgRoot+"/images/dh-b.png"
    },
    imgRoot: wwwRoot+"/weixin/jctnew/",
    user: {},
    serverFee: '0.00'
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
  //计算手续费
  calcServerFee(e){
    this.setData({
      serverFee: (e.detail.value * 0.006).toFixed(0)+".00"
    })
  },
  //提交
  formSubmit(e){
    var account = e.detail.value.account;
    var depositBank = e.detail.value.deposit_bank;
    var accountName = e.detail.value.account_name;
    var withdrawAmount = e.detail.value.withdraw_amount;
    var total = this.data.user.rechargeBalance;
    if (!bankReg.test(account)) {
      wx.showToast({
        title: "请输入正确的收款账号",
        icon: "none"
      })
      return false;
    }
    if (depositBank == "") {
      wx.showToast({
        title: "请输入开户行",
        icon: "none"
      })
      return false;
    }
    if (accountName == "") {
      wx.showToast({
        title: "请输入收款人",
        icon: "none"
      })
      return false;
    }
    if (!reg.test(parseInt(withdrawAmount))) {
      wx.showToast({
        title: "请输入正确的提现金额",
        icon: "none"
      })
      return false;
    }
    else if (parseInt(withdrawAmount) > parseInt(total)) {
      wx.showToast({
        title: "提现金额不能大于可提现金额",
        icon: "none"
      })
      return false;
    }
    var serviceFee = (withdrawAmount * 0.006).toFixed(0);
    var params = { 
      action: "withdraw",
      accountName: accountName,
      depositBank: depositBank,
      accountNum: account,
      amount: withdrawAmount,
      serviceFee: serviceFee,
      memeberId: app.globalData.memberId
    }; 
    httpRequst.HttpRequst(true, 'weixin/jctnew/ashx/wallet.ashx', params, 'POST', res => {
      var obj = eval('(' + res + ')');
      wx.showModal({
        title: '信息',
        content: obj.Message,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../index',
            })
          } 
        }
      });
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