// pages/gbt/gbtDetails/gbtDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_text:
    {
      "imgUrls": ["../../images/vipHall_1.png", "../../images/valet_bg.png", "../../images/vipHall_1.png"],
      "left_icon": "../../images/back-b.png",
      "title_text": "", "right_icon": "../../images/dh-b.png"
    },
    equipment:
    [
      { icon_url: "../../images/jbxxs_icon.png", icon_title: "嘉宾休息室" },
      { icon_url: "../../images/xc_icon.png", icon_title: "小吃" },
      { icon_url: "../../images/hbxsq_icon.png", icon_title: "航班显示器" },
      { icon_url: "../../images/ds_icon.png", icon_title: "电视" },
      { icon_url: "../../images/gbtxdj_icon.png", icon_title: "广播提醒登机" },
      { icon_url: "../../images/csyl_icon.png", icon_title: "茶水/饮料" },
      { icon_url: "../../images/tsj_icon.png", icon_title: "台式机" },
      { icon_url: "../../images/bgzz_icon.png", icon_title: "报刊杂志" },
    ],
    service_notice:
    [
      "服务时间：不限",
      "两周岁以下婴儿，在成人陪同下，可免费使用休息室产品(具体情况根据休息室相关规定为准）",
      "未使用可退,购买之日起一年内有效",
      "超过有限期未使用的订单视为已使用"
    ],
    purchase_notice:
    [
      "使用方式：购买之后，可直接前往深圳机场T3航站楼C岛岛尾西部航空柜台凭二维码领取VIP贵宾厅使用卷，抵达指定休息室出示贵宾厅使用卷即可。",
      "登机提示：南航、深航、国航的航班无提醒登机提醒"
    ]
  },
  catchLjyy:function(){
    wx.navigateTo({
      url: 'qrdd/qrdd',
    })
  },
  catchBackChange:function(){
    wx.navigateBack({
      delta:1
    })
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