// pages/wycx/addList/addList_page/addList_page.js
var values = []
var app = getApp();
var httpRequst = require("../../../utils/requst.js");
var {isCardNo, getDateDiff, getNowFormatDate} = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "left_icon": "../../images/back-b.png",
      "title_text": "选择旅客",
      "right_icon": "../../images/dh-b.png",
    },
    certificate: ["身份证", "护照", "其他"],
    picker_index: 0, 
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

  },
  bindBackChange:function(){
    wx.navigateBack({
      delta:1
    })
  },
  bindPickerChange:function(e){  
    var index = e.detail.value
    var certificate = this.data.certificate
    console.log(certificate[index])
    this.setData({
      input_val: certificate[index]
    })
  },
  bindKeyInput_0:function(e){
    var key = e.currentTarget.dataset.key;
    this.data.model[key] = e.detail.value;
    
    this.setData({
      values: this.data.model
    })   
  },
  // 清空信息
  bindDelChage:function(e){
    //console.log(1)
    //var value = this.data.value
    this.setData({
      value:""
    })
  },
  //初始化数据
  initData(){
    this.loadPassenerInfo();
  },
   //选择旅客页面加载乘机人列表
   loadPassenerInfo: function(){
    var that = this;
    var memberId = app.globalData.memberId;
    var passeners = that.data.passeners;
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
    var passengerListShow = this.data.passengerListShow;
    var editPassenerShow = this.data.editPassenerShow;
    this.setData({
      passengerListShow: false,
      editPassenerShow: true,
      editPassener: {}
    });
  },
  //选择旅客页面编辑乘机人跳转至详情页
  editPassener: function(e) {
    var that = this;
    var passenerId = e.currentTarget.dataset.passenerid;
    var passeners = that.data.passeners;
    var editPassener = that.data.editPassener;
    var passener = {}; 
    for (let i = 0; i < passeners.length; i++) {
      if(passenerId == passeners[i].id){
        passener = passeners[i];
      }
    }
    this.setData({
      passengerListShow: false,
      editPassenerShow: true,
      editPassener: passener
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
  catchLjyy: function(){
    var selectPasseners = this.data.selectPasseners;
    var passengerListShow = this.data.passengerListShow;
    var editPassenerShow = this.data.editPassenerShow;
    if (selectPasseners.length == 0) {
      wx.showToast({
        title: '请先选择乘机人',
        icon: 'none'
      });
      return false;
    };
    this.setData({
      passengerListShow: false,
      editPassenerShow: false,
    });
  },
  /* catchLjyy:function(){
    var model = this.data.model
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 1];  //当前页面
    var prevPage_1 = pages[pages.length - 2];

    prevPage_1.setData({
      model: model
    })
   
    wx.navigateBack({
      delta:1
    })
  }, */
   //新增或者编辑乘机人页面验证乘机人信息
   checkPassener: function(psg_name, cert_no, cert_type, phone_number) {
    if (!(nameReg.test(psg_name))) {
      wx.showToast({
        title: '请按照登机所持证件填写中文或英文姓名',
        icon: 'none',
      });
      return false;
    }
    if (cert_type == 1) {
      //判断身份证
      if (!(isCardNo(cert_no))) {
        wx.showToast({
          title: '请输入有效的身份证证件信息',
          icon: 'none',
        });
        return false;
      }
    }
    if(cert_no == ''){
      wx.showToast({
        title: '证件号不能为空',
        icon: 'none',
      });
      return false;
    }
    if (!(mobileReg.test(phone_number))) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: 'none',
      });
      return false;
    }
    return true;
  },
  //新增或者编辑乘机人页面选择证件类型弹框
  bindPickerChange: function (e) {
    var index = e.detail.value;
    this.setData({
      picker_index: parseInt(index) + 1
    })
  },
  //新增或者编辑乘机人页面点击确认保存操作
  submitPassener:function(e){
    var formId = e.detail.formId;
    var val = e.detail.value;
    var psg_name = val.name;
    var cert_no = val.cert_no;
    var cert_type = parseInt(val.cert_type) + 1;
    var phone_number = val.tel;
    var flag = this.checkPassener(psg_name, cert_no, cert_type, phone_number);
    if(flag){
      var param = { 
        action: val.action, 
        psgId: val.psgId, 
        memberId: app.globalData.memberId, 
        psg_name: psg_name, 
        cert_no: cert_no, 
        cert_type: cert_type, 
        phone_number: phone_number, 
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
          var passengerListShow = that.data.passengerListShow;
          var editPassenerShow = that.data.editPassenerShow;
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
      wx.showLoading({
        title: '数据加载中...',
      });
      httpRequst.HttpRequst(true, '/weixin/jctnew/ashx/passenger.ashx', { action: "del", memberId: memberId, psgId: passenerId } , "POST",function(res){
        wx.hideLoading()
        if (res.Success) {
          that.loadPassenerInfo();
          var passengerListShow = that.data.passengerListShow;
          var editPassenerShow = that.data.editPassenerShow;
          that.setData({
            passengerListShow: true,
            editPassenerShow: false,
          });
        } else {

        }
      });
    }
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