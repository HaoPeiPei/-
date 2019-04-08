// pages/jsj/cxxz/ddxq/ddxq.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../../utils/requst.js");
//乘机人姓名正则判断规则
var nameReg = /^[\u4E00-\u9fA5]{2,20}$|^(?:(?:[A-Za-z]{2,53}\/[A-Za-z]{2,53})|(?:[A-Za-z]{1,49}\s[A-Za-z]{2,50}\/[A-Za-z]{2,50})|(?:[A-Za-z]{2,50}\/[A-Za-z]{2,50}\s[A-Za-z]{1,49}))$/;
//联系手机正则
var mobileReg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "确认订单",
      "right_icon": imgRoot+"/images/dh-b.png"
    },
    imgRoot: imgRoot,
    order_details:
    {
      "vehicle_type":"经济型",
      "connecting_place":"深圳宝安国际机场T3航站楼",
      "delivery_place":"怀德社区咸田3区",
      "car_time":"2018-05-24"
    },
    contacts:
    {
      user_name:"周琦",
      cellPhone_number:"13518645266"
    },
    key:1,
    inBind:false,
    yhi_gs:0,
    bookModel: {},
    carType: '',
    fromAddress: '',
    toAddress: '',
    useTime: '',
    totalPrice: 0,
    contactor: '',
    contactTel: '',
  },
  //返回
  catchBackChange: function () {
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
  catchRsChage:function(e){
    var key = e.currentTarget.dataset.key;
    this.setData({
      key: key,
      inBind: false,
    })
  },
  bindXlChage:function(){
    var inBind = this.data.inBind;
    this.setData({
      inBind: !inBind
    })
  },
  bindYhjChage:function(){
    wx.navigateTo({
      url: 'yhj/yhj',
    })
  },
  //初始化页面数据
  initData(options){
    var bookInfo = options.bookInfo;
    if (bookInfo != null) {
      var bookModel = JSON.parse(decodeURIComponent(bookInfo));
      var fromAddress = "";
      var toAddress = "";
      var carType = this.convertCarType(bookModel.PriceInfo.VehicleType);
      if (bookModel.BookInfo.tripType == 2) {
          //送机
          fromAddress = bookModel.BookInfo.address;
          toAddress = "深圳宝安国际机场T3航站楼";
      } else {
          fromAddress = "深圳宝安国际机场T3航站楼";
          toAddress = bookModel.BookInfo.address;
      }
      var useTime = bookModel.BookInfo.useDate;
      var totalPrice = bookModel.PriceInfo.Price;
      this.setData({
        bookModel,
        fromAddress,
        toAddress,
        useTime,
        totalPrice,
        carType,
        contactor: app.globalData.user.realName,
        contactTel: app.globalData.user.mobile,
      })
    }
    else {
      wx.navigateBack({
        delta: 1, 
      });
    };
  },
  convertCarType(vehicleType) {
    if (vehicleType == "1") {
        return "经济型";
    }
    else if (vehicleType == "2") {
        return "商务型";
    }
    else if (vehicleType == "3") {
        return "豪华型";
    }
  },
  //输入联系人，手机号
  bindinput(e){
    var id = e.currentTarget.id;
    this.setData({
      [id]: e.detail.value
    })
  },
  check() {
    if (!nameReg.test(this.data.contactor)) {
      wx.showToast({
        title: "请输入正确的联系人",
        icon: 'none'
      });
      return false;
    }
    if (!mobileReg.test(this.data.contactTel)) {
      wx.showToast({
        title: "请输入正确的联系方式",
        icon: 'none'
      });
      return false;
    }
    return true;
  },
  //支付
  pay(){
    if(this.check()){
      this.createOrder();
    }
  },
  //创建订单
  createOrder(){
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    var bookModel = this.data.bookModel;
    var orderModel = { 
      member_id: app.globalData.memberId, 
      pattern_type: bookModel.BookInfo.tripType, 
      flight_no: bookModel.BookInfo.flightNo, 
      fly_date: bookModel.BookInfo.flyDate, 
      dep_time: bookModel.BookInfo.depTime, 
      arr_time: bookModel.BookInfo.arrTime, 
      location_detail_address: bookModel.BookInfo.address, 
      location_longitude: bookModel.BookInfo.lng, 
      location_latitude: bookModel.BookInfo.lat, 
      use_date: bookModel.BookInfo.useDate, 
      total_count: this.data.key, 
      contact_name: this.data.contactor, 
      contact_tel: this.data.contactTel, 
      pay_amount_due: bookModel.PriceInfo.Price, 
      vehicle_type: bookModel.PriceInfo.VehicleType, 
      price_mark: bookModel.PriceMark 
    };
    
    var param = {
      action: "create", 
      orderJson: JSON.stringify(orderModel)
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/rentcar.ashx", param, "POST",res => {
      wx.hideLoading();
      var obj = res;
      if (obj.Success) {
        var orderId = obj.Data;
        if (parseInt(bookModel.PriceInfo.Price) > 0) {
          that.createPayPara(orderId);
        } else {
          that.payOrder(orderId);
        }
      } else {
        setTimeout(()=>{
          wx.showToast({
            title: '创建订单失败,请联系客服',
            icon: 'none'
          });
        },1000);
      }
    });
  },
   //生成微信支付参数
   createPayPara(orderId) {
    var that = this;
    if (orderId != null && orderId != "") {
        wx.showLoading({
            title: '数据加载中...',
        });
        httpRequst.HttpRequst(true, '/weixin/miniprogram/ashx/rentcar.ashx', { action: "createwxpaypara", orderId: orderId, openId: app.globalData.openId  }, "POST",function(res){
            wx.hideLoading()
            if (res.Success) {
              var parameObj = JSON.parse(res.Data);
              that.jsApiCall(parameObj, orderId);
            } else {
              wx.showToast({
                  title: '创建支付参数失败,请联系客服',
                  icon: 'none'
              });
            }
        });
    }
  },
  //调用微信JS api 支付
  jsApiCall(params, orderId) {
    var that = this;
    wx.requestPayment(
        {
        'timeStamp': params.timeStamp,
        'nonceStr': params.nonceStr,
        'package': params.package,
        'signType': params.signType,
        'paySign': params.paySign ,
        'success':function(res){
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              that.payOrder(orderId);
            }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
              wx.showModal({
                  title: "温馨提示", 
                  content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../../../ddxq/jsjdd/jsjdd'
                      })
                    } else if (res.cancel) {
                      that.jsApiCall(params, orderId);
                    }
                  }
              });
            }else {
              wx.showModal({
                title: "温馨提示", 
                content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../../../ddxq/jsjdd/jsjdd'
                    })
                  } else if (res.cancel) {
                    that.jsApiCall(params, orderId);
                  }
                }
              });
            }
        },
        'fail':function(res){
          wx.showModal({
            title: "温馨提示", 
            content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../../ddxq/jsjdd/jsjdd'
                })
              } else if (res.cancel) {
                that.jsApiCall(params, orderId);
              }
            }
          });
        }
    });
  },
  //支付的订单
  payOrder(orderId){
      wx.showLoading({
          title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/rentcar.ashx', { action: "pay", orderId: orderId, status: "1" }, "POST",function(res){
          wx.hideLoading()
          if (res.Success) {
              wx.showToast({
                  title: res.Message || '支付成功',
                  icon: 'none'
              });
              wx.navigateTo({
                url: '../../ddxq/jsjdd/jsjdd'
              })
          } else {
              wx.showToast({
                  title: res.Message,
                  icon: 'none'
              });
          }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
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