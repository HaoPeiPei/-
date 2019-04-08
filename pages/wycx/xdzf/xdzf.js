// pages/wycx/xzhb/xdzf/xdzf.js
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst");
var { getWeek, getMD } = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "无忧出行",
      "right_icon": imgRoot+"/images/dh-b.png",
    },
    imgRoot: imgRoot,
    couponType: 0,
    salesType: 1,
    carrier: {},
    service: {},
    coupon: null,
    isShare: 0,
    couponCount: 0,
    totalPrice: 0,
    rechargeAmount : 0,//充值余额
    presentAmonut  : 0,//充值余额
    payType: 1, //支付方式 1:微信、
    contactor: '',
    contactTel: '',
    position: "随机",
    area: "左侧前方",
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
  //初始化数据
  initData(options){
    var carrier = JSON.parse(options.bookInfo);
    if(JSON.stringify(carrier) != {}){
      var serviceId = carrier.ServiceId;
      var serviceName = carrier.ServiceName;
      var flightInfo = carrier.FlightInfo;
      flightInfo['depDate'] = getMD(flightInfo.DepTime.substr(0, 10));
      flightInfo['depWeek'] = getWeek(flightInfo.DepTime.substr(0, 10));
      flightInfo['arrDate'] = getMD(flightInfo.ArrTime.substr(0, 10));
      flightInfo['arrWeek'] = getWeek(flightInfo.ArrTime.substr(0, 10))
      flightInfo['depTime'] = flightInfo.DepTime.substr(11, 5);
      flightInfo['arrTime'] = flightInfo.ArrTime.substr(11, 5);
      this.setData({
        service: Object.assign(this.data.service,{
          serviceId: serviceId,
          serviceName: serviceName
        }),
        carrier: carrier,
        contactor: app.globalData.user.realName,
        contactTel: app.globalData.user.mobile,
      });
      this.loadService();
      this.loadCouponCount();
    }
  },
  //载入服务
  loadService(){
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/service.ashx", {action: "getservicebyid", id: this.data.service.serviceId } , "POST",function(res){
      wx.hideLoading();
      if (res.Success) {
        var service = JSON.parse(res.Data);
        var price = service.price;
        that.setData({
          service: Object.assign(that.data.service,{
            price: price
          })
        });
        that.caculatePrice();
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
        wx.navigateTo({
          url: '../yycx',
        });
      }
    });
  },
  //计算总价
  caculatePrice(){
    var price = this.data.service.price;
    if (this.data.isShare == "1") {
        price = price - 20;
    }
    var passengerCount = this.data.carrier.PassengerInfo.length;
    //优惠金额
    var disAmount = 0;
    if (this.data.coupon != null) {
        disAmount = this.data.coupon.denomination;
    }
    var totalPrice = price * passengerCount - disAmount;
    if (totalPrice < 0) {
        totalPrice = 0;
    };
    this.setData({
      totalPrice
    });
  },
  //加载优惠券张数
  loadCouponCount(){
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "getcouponcount",
      id: this.data.service.serviceId,
      memberId: app.globalData.memberId 
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/service.ashx", param, "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        if (parseInt(res.Data) > 0) {
          var couponCount = res.Data; 
          that.setData({
            couponCount
          });    
        }
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
        wx.navigateTo({
          url: '../sscx',
        });
      }
    });
  },
  //切换优惠券
  couponSelect: function (e) {
    if(this.data.couponCount == 0){
      return
    }
    var couponType = (e.currentTarget.dataset.coupontype == 1 ? 0: 1);
    if(couponType == 1){
      wx.navigateTo({
        url: '../yhj/yhj',
      });
    }else{
      var coupon = null;
      this.setData({
        coupon
      });
      this.caculatePrice();
    };
    this.setData({
      couponType
    });
  },
  //区域选择
  areaSelect:function(){
    var position = this.data.position;
    var area = this.data.area;
    wx.navigateTo({
        url: '../region/region?position='+position+'&area='+area,
    });
  },
  //切换特惠购
  salesSelect(e){
    var salesType = (e.currentTarget.dataset.salestype == 1 ? 0: 1);
    this.setData({
      salesType
    });
  },
  //输入联系人，手机号
  bindinput(e){
    var id = e.currentTarget.id;
    this.setData({
      [id]: e.detail.value
    })
  },
  //去支付
  pay(){
    if (this.data.carrier.PassengerInfo.length == 0) {
      wx.showToast({
        title: '请选择乘机人',
        icon: 'none',
      });
      return false;
    }
    if (this.data.contactor == "") {
      wx.showToast({
        title: '请填写联系人',
        icon: 'none',
      });
      return false;
    }
    if (this.data.contactTel == "") {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none',
      });
      return false;
    }
    else {
        var myreg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
        if (!myreg.test(this.data.contactTel)) {
          wx.showToast({
            title: '请输入有效的手机号码',
            icon: 'none',
          });
          return false;
        }//this.data.isShare
    }
    if (this.data.salesType == 0) {
      var that = this;
      wx.showModal({
        title: '您确定不选择分享优惠吗？',
        success(res) {
          if (res.confirm) {
            that.book();
          } else if (res.cancel) {
            return false;
          }
        }
      })
    } else {
        if (this.data.isShare == 0 && this.data.salesType == 0) {
          wx.showToast({
            title: '需要分享才享受20元优惠券(点击当前页面右上角按钮分享朋友圈)',
            icon: 'none',
          });
            return false;
        }
        this.book();
    }
  },
  //支付
  book(){
    var that = this;
    var orderModel = {};
    var PostionInfo = {};
    PostionInfo.Postion = this.data.position;
    PostionInfo.Area = this.data.area;
    orderModel.FlightInfo = this.data.carrier.FlightInfo;
    orderModel.FlightNo = this.data.carrier.FlightNo;
    orderModel.PassengerInfo = this.data.carrier.PassengerInfo;
    orderModel.CouponInfo = this.data.coupon;
    orderModel.PostionInfo = PostionInfo;
    orderModel.ServiceId = this.data.service.serviceId;
    orderModel.PayType  = this.data.payType;
    orderModel.TotalPrice = this.data.totalPrice;
    orderModel.MemberId = app.globalData.memberId;
    orderModel.Contactor = this.data.contactor;
    orderModel.ContactTel = this.data.contactTel;
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "createorder", 
      orderInfo: JSON.stringify(orderModel) 
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/service.ashx", param, "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        var orderId = res.Data;
        if (res.Message == "true") {
          that.payOrder(orderId);          //无需调用微信支付,直接更改后台支付状态
        }
        else {
          //todo 调用微信支付
          that.createPayPara(orderId);
        }
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
        wx.navigateTo({
          url: '../wycx',
        });
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
        httpRequst.HttpRequst(true, '/weixin/miniprogram/ashx/service.ashx', { action: "createwxpaypara", orderId: orderId, openId: app.globalData.openId }, "POST",function(res){
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
                    url: '../../ddxq/fwdd/fwdd',
                  });
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
                      url: '../../ddxq/fwdd/fwdd',
                    });
                  } else if (res.cancel) {
                    that.jsApiCall(params, orderId);
                  }
              }
            });
          };
        },
        'fail':function(res){
          wx.showModal({
            title: "温馨提示", 
            content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../ddxq/fwdd/fwdd',
                });
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
    var that = this;
      wx.showLoading({
          title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/service.ashx', { action: "pay", orderId: orderId, status: "1" }, "POST",function(res){
          wx.hideLoading()
          if (res.Success) {
              wx.showToast({
                  title: res.Message || '支付成功',
                  icon: 'none'
              });
              wx.navigateTo({
                url: '../../ddxq/fwdd/fwdd',
              });
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
    this.initData(options)
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
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/service.ashx", {action: "share", url: '' } , "POST",res => {
      if (res.Success) {
        return {
          title: '靠窗座位人人爱，用我就对了！—环球机场通',
          path: '/pages/sscx/xzhb/xdzf',
          imageUrl: "http://www.51jct.cn/weixin/jctnew/images/logo.png",
          success: res => {
            wx.showToast({
              title: "分享成功!",
              icon: "none",
            });
            this.setData({
              isShare : 1
            });
          },
          fail: res => {
            wx.showToast({
              title: "已取消!",
              icon: "none",
            });
          }
        };
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
      }
    });
  }
})