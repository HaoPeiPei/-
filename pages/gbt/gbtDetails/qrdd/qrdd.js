// pages/gbt/gbtDetails/qrdd/qrdd.js
var app = getApp();
var httpRequst = require("../../../../utils/requst.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../../images/back-b.png",
      "title_text": "确认订单", 
      "right_icon": "../../../images/dh-b.png"
    },
    useDate:"",
    service: {},
    coupon: {},
    coupontype: 0,
    contactor:"",
    contacttel:"",
    totalPrice: 0,
    couponCount: 0,
    isShare: 0,
  },
  bindDateChange:function(e){
    var val = e.detail.value;
    this.setData({
      useDate: val
    })
  },
  bindYhjChange:function(){
    wx.navigateTo({
      url: 'yhj/yhj',
    })
  },
  bindBackChange: function () {
    wx.showModal({
      title: '温馨提示',
      content: '您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  //初始化数据
  initData(options){
    var serviceId = options.id;
    this.setData({
      service: Object.assign(this.data.service,{
        serviceId: serviceId
      }),
    });
    this.getService(serviceId);
    this.loadCouponCount(serviceId);
  },
  //载入服务
  getService(){
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/service.ashx", {action: "getservicebyid", id: this.data.service.serviceId } , "POST",res => {
      wx.hideLoading();
      if (res.Success) {
        var service = res.Data;
        var price = service.price;
        this.setData({
          service: Object.assign(this.data.service,{
            price: price
          })
        });
        this.caculatePrice();
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
        wx.navigateTo({
          url: '../../gbt/gbt',
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
    //优惠金额
    var disAmount = 0;
    if (JSON.stringify(this.data.coupon) != '{}') {
        disAmount = this.data.coupon.denomination;
    }
    var totalPrice = price - disAmount;
    if (totalPrice < 0) {
        totalPrice = 0;
    };
    this.setData({
      totalPrice
    });
  },
  //加载优惠券张数
  loadCouponCount(){
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
          this.setData({
            couponCount
          });    
        }
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
        wx.navigateTo({
          url: '../../sscx/sscx',
        });
      }
    });
  },
  //切换优惠券
  couponSelect: function (e) {
    var couponType = (e.currentTarget.dataset.coupontype == 1 ? 0: 1);
    if(couponType == 1){
      wx.navigateTo({
        url: 'yhj/yhj',
      });
    }else{
      coupon = {};
      this.setData({
        coupon
      });
      this.caculatePrice();
    };
    this.setData({
      couponType
    });
  },
  //输入联系人，手机号
  bindinput(e){
    var name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value
    })
  },
  //去支付
  bindZfChange(){
    if (this.data.useDate == "") {
      wx.showToast({
        title: '请输入使用时间',
        icon: 'none'
      });
      return false;
    }
    if (this.data.contactor == "") {
      wx.showToast({
        title: '请填写联系人',
        icon: 'none'
      });
      return false;
    }
    if (this.data.contacttel == "") {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none'
      });
      return false;
    }
    else {
        var myreg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
        if (!myreg.test(this.data.contacttel)) {
          wx.showToast({
            title: '请输入有效的手机号码',
            icon: 'none'
          });
          return false;
        }
    }
    this.book();
  },
  book(){
    var orderModel = {};
    orderModel.usedDate = this.data.useDate;
    orderModel.CouponInfo = this.data.coupon;
    orderModel.ServiceId = this.data.service.serviceId;
    orderModel.TotalPrice = this.data.totalPrice;
    orderModel.MemberId = app.globalData.memberId;
    orderModel.Contactor = this.data.contactor;
    orderModel.ContactTel = this.data.contacttel;
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
          payOrder(orderId);          //无需调用微信支付,直接更改后台支付状态
        }
        else {
            //todo 调用微信支付
            createPayPara(orderId);
        }
      } else {
        wx.showToast({
          title: res.Message,
          icon: "none",
        });
        wx.navigateTo({
          url: '../../gbt/gbt',
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
        httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/airTicket.ashx', { action: "createwxpaypara", orderId: orderId } , "POST",function(res){
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
    wx.requestPayment(
        {
        'timeStamp': params.timeStamp,
        'nonceStr': params.nonceStr,
        'package': params.package,
        'signType': params.signType,
        'paySign': params.paySign ,
        'success':function(res){
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                payOrder(orderId);
            }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                wx.showModal({
                    title: "温馨提示", 
                    content: "您的订单还未完成支付，如现在退出支付，可稍后进入“订单管理”继续完成支付，请确认是否返回?",
                    success(res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../../../ddxq/fwdd'
                        });
                      } else if (res.cancel) {
                        jsApiCall(params, orderId);
                      }
                    }
                });
            }else {
                wx.showToast({
                    title: '支付失败!',
                    icon: 'none'
                });
            }
        },
        'fail':function(res){
            wx.showToast({
                title: '支付失败!',
                icon: 'none'
            });
        }
    });
  },
  //支付的订单
  payOrder(orderId){
      wx.showLoading({
          title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/airTicket.ashx', { action: "pay", orderId: orderId, status: "1" }, "POST",function(res){
          wx.hideLoading()
          if (res.Success) {
              wx.showToast({
                  title: res.Message || '支付成功',
                  icon: 'none'
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