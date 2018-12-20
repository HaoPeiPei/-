// pages/dpc/dpc_qcxx/dpc_qcxx.js
var app = getApp();
var httpRequst = require("../../../../utils/requst");
var { addDate, getDateDiff, compareDate, returnDate } = require("../../../../utils/util.js");
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
    date: '',
    time: '',
    xinx: 'qcxx',
    val: "",
    flightNo: "",
    oldGoFlightNo: "",
    go_flightNo: "",
    depDate: "",
    useDate: "",
    oldBackFlightNo: "",
    back_flightNo: "",
    arrDate: "",
    arrTime: "",
    carPlate: "",
    carType: "",
    carColor: "",
    contactor: "",
    contacttel: "",
    price: 0,
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
      });
    } 
  },
  bindChangeDa: function (e) {
    var val = e.currentTarget.dataset.hbh;
    if (val == '') {
      wx.showToast({
        title: "请填写正确的航班号",
        icon: 'none'
      });

      setTimeout(function () {
        wx.hideToast()
      }, 2000);
    }

  },
  //信息切换
  xinxSelect(e){
    var xinx = e.currentTarget.dataset.xinx;
    this.setData({
      xinx
    })
  },
  //检查回程信息
  checkQc() {
    if (!flightNoReg.test(this.data.go_flightNo)) {
      wx.showToast({
        title: "请填写正确的航班号",
        icon: 'none'
      })
      return false;
    }
    if (this.data.flyDate == "") {
      wx.showToast({
        title: "请选择去程日期",
        icon: 'none'
      })
      return false;
    }
    if (this.data.oldGoFlightNo != "" && this.data.flightNo.toUpperCase() != this.data.oldGoFlightNo.toUpperCase()) {
      wx.showToast({
        title: "您输入的航班号发生变化,请重新选择起飞时间进行查询",
        icon: 'none'
      })
      return false;
    }
    if (this.data.useDate == "") {
      wx.showToast({
        title: "请选择接车时间",
        icon: 'none'
      })
      return false;
    }
    var min = getDateDiff(this.data.useDate, this.data.flyDate, "minute");
    if (min < 45) {
      wx.showToast({
        title: "您的接车时间至少要比起飞时间提前45分钟!",
        icon: 'none'
      })
      return false;
    }
    oldGoFlightNo = this.data.go_flightNo;
    return true;
  },
  //检查回程信息
  CheckHc() {
    if (!flightNoReg.test(this.data.back_flightNo)) {
      wx.showToast({
        title: "请输入正确的航班号",
        icon: 'none'
      })
      return false;
    }
    if (this.data.arrDate == "") {
      wx.showToast({
        title: "请选择回程日期",
        icon: 'none'
      })
      return false;
    }
    if (this.data.oldBackFlightNo != "" && this.data.back_flightNo.toUpperCase() != this.data.oldBackFlightNo.toUpperCase()) {
      wx.showToast({
        title: "您输入的航班号发生变化,请重新选择起飞时间进行查询!、",
        icon: 'none'
      })
      return false;
    }
    if (this.data.arrTime == "") {
      wx.showToast({
        title: "请选择接车时",
        icon: 'none'
      })
      return false;
    }
    var durate = getDateDiff(this.data.depDate, this.data.arrDate, "minute");
    var min = getDateDiff(this.data.arrTime, this.data.arrDate, "minute");
    if (durate <= 0) {
      wx.showToast({
        title: "您的选择的回程时间不能小于去程时间!",
        icon: 'none'
      })
      return false;
    }
    if (min > -15) {
      wx.showToast({
        title: "您的接车时间至少要比到达时间晚15分钟!",
        icon: 'none'
      })
      return false;
    }
    oldBackFlightNo = this.data.back_flightNo;
    return true;
  },
  //检查车辆信息
  CheckCl() {
    var carnoReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    if (!carnoReg.test(this.data.carPlate.toUpperCase())) {
      wx.showToast({
        title: "请输入正确的车牌号",
        icon: 'none'
      });
      return false;
    }
    if (this.data.carType == "") {
      wx.showToast({
        title: "请输入您的爱车型号",
        icon: 'none'
      });
      return false;
    }
    if (this.data.carColor == "") {
      wx.showToast({
        title: "请输入您的爱车颜色",
        icon: 'none'
      });
      return false;
    }
    if (this.data.contactor == "") {
      wx.showToast({
        title: "请填写联系人",
        icon: 'none'
      });
      return false;
    }
    if (this.data.contacttel == "") {
      wx.showToast({
        title: "请填写联系电话",
        icon: 'none'
      });
      return false;
    }
    else {
        var myreg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
        if (!myreg.test(this.data.contacttel)) {
          wx.showToast({
            title: "请输入有效的手机号码",
            icon: 'none'
          });
          return false;
        }
    }
    return true;
  },
  //计算价格
  caculatePrice() {
    var depTime = this.data.depTime;
    var arrTime = this.data.arrTime;
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "getprice", 
      depTime: depTime, 
      arrTime: arrTime
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/valet.ashx", param, "POST",res => {
      wx.hideLoading();
      var obj = JSON.parse(res);
      if (obj.Success) {
          if (parseInt(obj.Data) > 0) {
            var price = obj.Data;
            this.setData({
              price
            });
          }
      } else {
        wx.navigateTo({
          url: '../dpc/dpc',
        });
      };
    });
  },

  //创建订单
  createOrder() {
    if (this.checkQc() && this.CheckHc() && this.CheckCl()) {
      var flyInfo = airPort + "@" + this.data.go_flightNo.toUpperCase() + "@" + this.data.depDate + "@" + this.data.depTime;
      var backInfo = this.data.back_flightNo.toUpperCase() + "@" + this.data.arrDate + "@" + this.data.arrTime;
      var useInfos = app.globalData.memberId + "@" + this.data.contactor + "@" + this.data.contacttel;
      var carInfo = this.data.carPlate.toUpperCase() + "@" + this.data.carType.toUpperCase() + "@" + this.data.carColor.toUpperCase();
      var price = this.data.price;
      wx.showLoading({
        title: '数据加载中...',
      });
      var param = { 
        action: "create", 
        flyInfo: flyInfo, 
        backInfo: backInfo, 
        useInfos: useInfos, 
        carInfo: carInfo, 
        price: price 
      }
      httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/valet.ashx", param, "POST",res => {
        wx.hideLoading();
        var obj = JSON.parse(res);
        if (obj.Success) {
          wx.navigateTo({
            url: '../dpc/dpc',
          });
          window.location = "../dpc_qzf/dpc_qzf?orderId=" + obj.Data;
        } else {
          layer.msg(obj.ErrorMsg);
          return false;
        };
      });
    };
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