// pages/jsj/jsj.js
var flightNoReg = /^[0-9a-zA-Z]{2}[0-9]{3,4}$/;
var app = getApp();
var httpRequst = require("../../utils/requst");
var { formatTimestamp, addDate, getDateDiff, getNowFormatDate, formatDate } = require("../../utils/util.js");
var dateTimePicker = require('../../utils/dateTimePicker.js');
var flightNoReg = /^[0-9a-zA-Z]{2}[0-9]{3,4}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "background_url": "../images/a.png",
      "left_icon": "../images/back-1.png",
      "title_text": "舒适出行",
      "right_icon": "../images/dh.png"
    },
    useDateShow: false,
    cityCode: "SZX",
    useDate:"",
    tripType: 2,
    flyDate: "",
    arrTime: "",
    depTime: "",
    oldFlightNo: "",
    lng: "",
    lat: "",
    address: '',
    minDate: "",
    maxDate: ""
  },
  //初始化参数
  initData(){
    var nowDate = new Date();
    var minDate = nowDate.getTime();
    var maxDateStr = (nowDate.getFullYear()+1)+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
    var maxDate = new Date(addDate(maxDateStr,0).replace(/-/g,  "/")).getTime();
    this.setData({
      minDate,
      maxDate,
    });
  },
  bindBackChages: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  bindNavChage:function(){
    wx.navigateTo({
      url: 'cxxz/cxxz',
    })
  },
  useDateChange(){
    var flightNo = this.data.flightNo;
    if (!flightNoReg.test(flightNo)) {
      this.setData({
        useDateShow: false
      });
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    var flyDate = this.data.flyDate;
    if (flyDate == "") {
      this.setData({
        useDateShow: true
      });
      if (this.data.tripType == 1) {
        wx.showToast({
          title: '请输入到达时间',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: '请输入出发时间',
          icon: 'none'
        });
      }
      return false;
    }
    this.setData({
      useDateShow: true
    });
  },
  useDatePopconfirm(e){
    var useDate = formatTimestamp(e.detail);
    if (!this.checkTime(this.data.flyDate, this.data.useDate, this.data.tripType)) {
      this.setData({
        useDate: '',
        useDateShow: false
      })
    }else{
      this.setData({
        useDate: useDate.substring(0,useDate.length-3),
        useDateShow: false
      })
    }
  },
  //切换接送机
  bindTapChage:function(e){
    var tripType = e.currentTarget.dataset.triptype;
    this.setData({
      tripType,
      flyDate: ''
    })
  },

  inputBlur(e){
    if (!flightNoReg.test(e.detail.value)) {
      wx.showToast({
        title: '请输入正确的航班号',
        icon: 'none'
      });
      return false;
    }
    this.setData({
      flightNo: e.detail.value
    });
  },
  //地图
  bindMapChage:function(){
    wx.navigateTo({
      url: 'map/map',
    })
  },
  //到达时间选择
  bindDateChage:function(e){
    var flyDate = e.detail.value;
    this.setData({
      flyDate
    });
    this.search();
  },
  //搜素
  search(){
    if (!flightNoReg.test(this.data.flightNo)) {
      wx.showToast({
        title: "请输入正确的航班号",
        icon: 'none'
      });
      return false;
    } else if (this.data.flyDate == "") {
      if (this.data.tripType == 1) {
        wx.showToast({
          title: "请输入到达时间",
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: "请输入出发时间",
          icon: 'none'
        });
      }
      return false;
    }
    wx.showLoading({
      title: '数据加载中...',
    });
    var param = {
      action: "getStopCity", 
      depDate: this.data.flyDate, 
      flightNo: this.data.flightNo, 
      startCity: 'SZX', 
      air_type: this.data.tripType
    }
    httpRequst.HttpRequst(false, "/weixin/jctnew/ashx/airTicket.ashx", param, "POST",res => {
      wx.hideLoading();
      var obj = res;
      if (obj.Status == 1) {
        var flyDate = "";
        var arrTime = obj.FlightInfos[0].ArrTime;
        var depTime = obj.FlightInfos[0].DepTime;
        if (this.data.tripType == 1) {
          flyDate = depTime.substring(0,arrTime.length-3);                   
        } else {
          flyDate = depTime.substring(0,depTime.length-3);
        }
        var oldFlightNo = this.data.flightNo;
        this.setData({
          flyDate: depTime.substring(0,depTime.length-3),
          depTime,
          arrTime,
          oldFlightNo,
        });
      } else {
        wx.showToast({
          title: obj.ErrorMsg,
          icon: 'none'
        });
      }
    });
  },
  checkTime(flyTime, useTime, flyType) {
    var curDate = formatDate(getNowFormatDate(), "yyyy-mm-dd");             //当前日期
    var curHour = formatDate(getNowFormatDate(), "hour");                   //当前小时
    var flyDate = formatDate(flyTime, "yyyy-mm-dd");                        //航班日期
    var flyHour = formatDate(flyTime, "hour");                              //航班小时
    if (curDate == flyDate && flyHour < 12) {
      wx.showToast({
        title: "12点前的航班,请于用车前一天18点前预订!",
        icon: 'none'
      });
      return false;
    }
    else {
        var flyMinutes = getDateDiff(useTime, flyTime, "minute");          //用车时间距离航班时间
        if (getDateDiff(curDate, flyDate, "day") == 1 && flyHour < 12) {
            if (formatDate(getNowFormatDate(), "hour") < 18) {
                if (this.data.flyType == 1) {
                    if (GetDateDiff(useTime, flyTime, "minute") >= 0) {
                      wx.showToast({
                        title: "您的用车时间不能小于航班时间!",
                        icon: 'none'
                      });
                      return false;
                    }
                    return true;
                }
                else {
                    if (flyMinutes <= 60) {
                      wx.showToast({
                        title: "您的用车时间距航班起飞时间不足一小时,请通过其他方式预订此项服务!",
                        icon: 'none'
                      });
                      return false;
                    }
                    return true;
                }
            } else {
              wx.showToast({
                title: "12点前的航班,请于用车前一天18点前预订!",
                icon: 'none'
              });
              return false;
            }
        } else {
            var useMinutes = getDateDiff(getNowFormatDate(), flyTime, "minute");
            if (useMinutes <= 300) {
              wx.showToast({
                title: "您的下单时间距航班时间不足五小时,请通过其他方式预订此项服务!",
                icon: 'none'
              });
              return false;
            } else {
                if (this.data.flyType == 1) {
                  if (GetDateDiff(useTime, flyTime, "minute") >= 0) {
                    wx.showToast({
                      title: "您的用车时间不能小于航班时间!",
                      icon: 'none'
                    });
                    return false;
                  }
                  return true;
                } else {
                    if (flyMinutes <= 60) {
                      wx.showToast({
                        title: "您的用车时间距航班时间不足一小时,请通过其他方式预订此项服务!",
                        icon: 'none'
                      });
                      return false;
                    }
                    return true;
                }
            }
        }
    }
  },
  check() {
    var flightNo = this.data.flightNo;
    var oldFlightNo =this.data.oldFlightNo;
    var flyDate = this.data.flyDate;
    var useDate =this.data.useDate;
    var tripType =this.data.tripType;
    var lng = this.data.lng;
    var lat = this.data.lat;
    var address = this.data.address;
    if (!flightNoReg.test(flightNo)) {
      wx.showToast({
        title: "请输入正确的航班号",
        icon: 'none'
      });
      return false;
    } else if (flyDate == "") {
        if (tripType == 1) {
          wx.showToast({
            title: "请输入到达时间",
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: "请输入出发时间",
            icon: 'none'
          });
        }
        return false;
    } else if (flightNo.toUpperCase() != oldFlightNo.toUpperCase()) {
      wx.showToast({
        title: "您输入的航班号发生变化,请重新选择起飞时间进行查询",
        icon: 'none'
      });
      return false;
    } else if (address == "") {
        if (tripType == 1) {
          wx.showToast({
            title: "请输入送达地点",
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: "请输入乘车地点",
            icon: 'none'
          });
        }
        return false;
    } else if (lng == 0 || lat == 0) {
        if (tripType == 1) {
          wx.showToast({
            title: "请输入送达地点",
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: "请输入乘车地点",
            icon: 'none'
          });
        }
        return false;
    } else if (useDate == "") {
      wx.showToast({
        title: "请输入用车时间",
        icon: 'none'
      });
      return false;
    }
    var oldFlightNo = this.data.flightNo;
    this.setData({
      oldFlightNo,
    })
    return true;
  },
  bindTimeChage:function(e){
    var tm_date = e.detail.value;
    this.setData({
      tm_date: tm_date
    })
  },
  Book() {
    var queryModel = { 
      tripType: this.data.tripType, 
      flightNo: this.data.flightNo, 
      flyDate: this.data.flyDate, 
      address: this.data.address, 
      useDate: this.data.useDate, 
      lng: this.data.lng, 
      lat: this.datalat, 
      depTime: this.data.depTime, 
      arrTime: this.data.arrTime 
    };
    wx.navigateTo({
      url: "chooseCar.aspx?queryInfo=" + JSON.stringify(queryModel),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.initData();
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