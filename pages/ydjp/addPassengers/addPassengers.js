// pages/wycx/addList/addList_page/addList_page.js
//航班号正则判断规则
var flightNoReg = /^[0-9a-zA-Z]{2}[0-9]{3,4}$/;
//乘机人姓名正则判断规则
var nameReg = /^[\u4E00-\u9fA5]{2,20}$|^(?:(?:[A-Za-z]{2,53}\/[A-Za-z]{2,53})|(?:[A-Za-z]{1,49}\s[A-Za-z]{2,50}\/[A-Za-z]{2,50})|(?:[A-Za-z]{2,50}\/[A-Za-z]{2,50}\s[A-Za-z]{1,49}))$/;
//联系手机正则
var mobileReg = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])\d{8}$/;
var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var imgRoot = app.globalData.imgRoot;
var httpRequst = require("../../../utils/requst.js");
var {isCardNo, getFormatDate, addDate, chkdateForma, diffDateYear, getNowFormatDate} = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": imgRoot+"/images/back-b.png",
      "title_text": "选择旅客",
      "right_icon": imgRoot+"/images/dh-b.png",
    },
    imgRoot: imgRoot,
    certificate: ["身份证", "护照", "其他"],
    pasType: ["成人", "儿童","婴儿"],
    certificate_index: 0, 
    pasType_index: 0, 
    values:[],
    model:{
      user_name: "", zjh_text: "", sjh_text:""
    },
    passengerListShow: true,
    editPassenerShow:false,
    disabled:true,
    passeners: [],
    selectPasseners: [],
    editPassener: {}, //编辑或者新增的乘机人
    birthdayShow: false,
    birthday: '',
    currentDate: '',
    minDate: '',
    maxDate: '',
  },
  //返回
  bindBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  //输入
  bindKeyInput_0:function(e){
    var key = e.currentTarget.dataset.key;
    this.data.model[key] = e.detail.value;
    
    this.setData({
      values: this.data.model
    })   
  },
  //隐藏编辑乘机人
  hidEditPassener(){
    this.setData({
      editPassenerShow: false,
      passengerListShow: true,
    });
  },
  //初始化数据
  initData(options){
    var selectPasseners = options.selectPasseners && JSON.parse(options.selectPasseners) || [];
    var nowDate = new Date();
    var minDate = new Date(addDate('1900-1-1',0).replace(/-/g,  "/")).getTime();
    var maxDate = nowDate.getTime();
    this.setData({
      selectPasseners,
      currentDate: maxDate,
      maxDate,
      minDate,
    });
    this.loadPassenerInfo();
  },
  //生日日期选择
  birthdayChange(){
    this.setData({
      birthdayShow: true
    });
  },
  //生日日期确认
  birthdayPopconfirm(e) {
    var birthday = getFormatDate(e.detail);
    this.setData({
      birthday: birthday,
      currentDate: e.detail,
      birthdayShow: false,
    });
  },
  //生日日期取消
  depDateCancel(e){
    this.setData({
      depDateShow: false,
    })
  },
   //选择旅客页面加载乘机人列表
   loadPassenerInfo: function(){
    var that = this;
    var memberId = app.globalData.memberId;
    var selectPasseners = that.data.selectPasseners;
    var selectPassenerIds = [];
    for (var i = 0; i < selectPasseners.length; i++) {
      selectPassenerIds = selectPassenerIds.concat(selectPasseners[i]['id']);
    }
    wx.showLoading({
      title: '数据加载中...',
    });
    httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', {action: "get", memberId: memberId}, "POST",function(res){
      wx.hideLoading();
      var data = JSON.parse(res.Data);
      selectPasseners = [];
      for (var j = 0; j < data.length; j++) {
        data[j]['TypeName'] = that.getType(data[j]);
        data[j]["CertTypeName"] = that.getCertType(data[j]);
        data[j]["CertNoCont"] = that.getCertNo(data[j]);
        if(selectPassenerIds.indexOf(data[j]['id'])!=-1){
          selectPasseners = selectPasseners.concat(data[j]);
          data[j]['active'] = true;
        }
      }
      
      that.setData({
        passeners: data,
        selectPasseners: selectPasseners
      });
    }); 
  },
   //选择旅客页面添加乘机人跳转至详情页
   addPassener:function(){
    this.setData({
      passengerListShow: false,
      editPassenerShow: true,
      editPassener: {},
      picker_index: 0
    });
  },
  //选择旅客页面编辑乘机人跳转至详情页
  onEditPassener: function(e) {
    var that = this;
    var passenerId = e.currentTarget.dataset.passenerid;
    var passeners = that.data.passeners;
    var passener = {}; 
    for (let i = 0; i < passeners.length; i++) {
      if(passenerId == passeners[i].id){
        passener = passeners[i];
      }
    }
    var currentDate = 0;
    if(passener.birthday!=''&&passener.birthday!=null){
      currentDate = new Date(addDate(passener.birthday,0).replace(/-/g,  "/")).getTime();
    }
    this.setData({
      passengerListShow: false,
      editPassenerShow: true,
      editPassener: passener,
      certificate_index: passener.cert_type-1, 
      pasType_index: passener.type, 
      birthday: passener.birthday,
      currentDate 
    });
  },
  //选择旅客页面选择乘机人
  onSelectPassener: function(e){
    var passenerid = e.currentTarget.dataset.passenerid;
    var passeners = this.data.passeners;
    var passener = passeners.filter(v=>passenerid==v.id)[0] || {};
    if(JSON.stringify(passener) != '{}'){
      passener['active'] = ! passener['active'];
      var selectPasseners = passeners.filter(v=>v.active);
      this.setData({
        selectPasseners: selectPasseners,
        passeners: passeners
      });
    }
  },
  //选择旅客页面确认操作
  confirmPassener: function(){
    var selectPasseners = this.data.selectPasseners;
    if (selectPasseners.length == 0) {
      wx.showToast({
        title: '请先选择乘机人',
        icon: 'none'
      });
      return false;
    }else{
      var adlut = 0;
      var child = 0;
      var boby = 0;
      for (var i = 0; i < selectPasseners.length; i++) {
          var pass = selectPasseners[i];
          if (pass.type == "0") {
              adlut = adlut + 1;
          } else if (pass.type == "1") {
              child = child + 1;
          } else {
              boby = boby + 1;
          }
      }
      if (boby > adlut) {
        wx.showToast({
          title: '一名成人只能带一个婴儿',
          icon: 'none'
        })
        return false;
      } else if ((child + boby) / 2 > adlut) {
        wx.showToast({
          title: '一名成人只能带两个儿童或一个儿童和一个婴儿',
          icon: 'none'
        })
        return false;
      }
    };
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页
    var prevPage = pages[pages.length -2]; //上一个页面
    prevPage.setData({
      selectPasseners: selectPasseners,
     });
    prevPage.caculatePirce();
    wx.navigateBack({
      delta:1
    })
  },
   //新增或者编辑乘机人页面验证乘机人信息
   checkPassener: function(psg_name,type, birthday, cert_no, cert_type, phone_number) {
    if (!(nameReg.test(psg_name))) {
      wx.showToast({
        title: '请按照登机所持证件填写中文或英文姓名',
        icon: 'none',
      });
      return false;
    }

    if(type == 0){//成人
      if (cert_type == 1) {
        //判断身份证
        if (!(isCardNo(cert_no))) {
          wx.showToast({
            title: '请输入有效的身份证证件信息',
            icon: 'none',
          });
          return false;
        }
      }else if(cert_no == ''){
        wx.showToast({
          title: '证件号不能为空',
          icon: 'none',
        });
        return false;
      }else if (!(mobileReg.test(phone_number))) {
        wx.showToast({
          title: '请输入有效的手机号码',
          icon: 'none',
        });
        return false;
      }
    }else{
      if (birthday == "") {
        wx.showToast({
          title: '请选择生日',
          icon: 'none',
        });
        return false;
    } else if (!chkdateForma(birthday)) {
      wx.showToast({
        title: '请输入正确的日期格式',
        icon: 'none',
      });
      return false;
    }
    //儿童
    if ( type == 1) {
        if (diffDateYear(birthday, getNowFormatDate()) < 3) {
          wx.showToast({
            title: '小于2周岁，不属于儿童',
            icon: 'none',
          });
          return false;
        }
        if (diffDateYear(birthday, getNowFormatDate()) > 12) {
          wx.showToast({
            title: '超过12周岁，不属于儿童',
            icon: 'none',
          });
          return false;
        }
    } else {
        if (diffDateYear(birthday, getNowFormatDate()) > 2) {
          wx.showToast({
            title: '超过2周岁，不属于婴儿',
            icon: 'none',
          });
          return false;
        }
    }
    }
    return true;
  },
  //新增或者编辑乘机人页面选择乘客类型弹框
  bindPasTypeChange: function (e) {
    var index = e.detail.value;
    this.setData({
      pasType_index: parseInt(index)
    })
  },
  //新增或者编辑乘机人页面选择证件类型弹框
  bindCertificateChange: function (e) {
    var index = e.detail.value;
    this.setData({
      certificate_index: parseInt(index)
    })
  },
  //新增或者编辑乘机人页面点击确认保存操作
  submitPassener:function(e){
    var formId = e.detail.formId;
    var val = e.detail.value;
    var psg_name = val.name;
    var type = parseInt(val.type);
    var cert_no = val.cert_no;
    var cert_type = parseInt(val.cert_type) + 1;
    var phone_number = val.tel;
    var birthday = this.data.birthday;
    var flag = this.checkPassener(psg_name, type, birthday, cert_no, cert_type, phone_number);
    if(flag){
      var param = { 
        action: val.action, 
        psgId: val.psgId, 
        memberId: app.globalData.memberId, 
        psg_name: psg_name, 
        cert_no: cert_no, 
        type: type, 
        cert_type: cert_type, 
        phone_number: phone_number, 
        birthday: birthday, 
      }
      this.savePassener(param);
    }
  },
  //保存乘机人信息
  savePassener: function(param) {
    var that = this;
    var memberId = app.globalData.memberId;
    if (memberId != null && memberId != "") {
      wx.showLoading({
        title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', param , "POST",function(res){
        wx.hideLoading();
        if (res.Success) {
          that.loadPassenerInfo();
          that.setData({
            passengerListShow: true,
            editPassenerShow: false,
          });
        } else {

        }
      });
    }
  },
  //删除乘机人信息
  deletePassener: function(e){
    var that = this;
    var passenerId = e.currentTarget.dataset.passenerid;
    var memberId = app.globalData.memberId;
    if (memberId != null && memberId != "") {
      wx.showModal({
        title: '提示',
        content: '确定删除该乘机人吗？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '数据加载中...',
            });
            httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', { action: "del", memberId: memberId, psgId: passenerId } , "POST",function(res){
              wx.hideLoading()
              if (res.Success) {
                that.loadPassenerInfo();
                that.setData({
                  passengerListShow: true,
                  editPassenerShow: false,
                });
              } else {
      
              }
            });
          } else if (res.cancel) {
            
          }
        }
      })
    }
  },
  getType(item) {
    if (item.type == "0") {
        return "";
    }
    else if (item.type == "1") {
        return "(儿童)";
    } else {
        return "(婴儿)";
    }
  },
  getCertType(item) {
    if (item.type == "0") {
        if (item.cert_type == "1") {
            return "身份证";
        }
        else if (item.cert_type == "2") {
            return "护照";
        } else {
            return "其他";
        }
    } else {
        return "生日";
    }
  },
  getCertNo (item) {
    if (item.type == "0") {
        return item.cert_no;
    }else {
        return item.birthday;
    }
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