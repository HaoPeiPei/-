var app = getApp();
var wwwRoot = app.globalData.wwwRoot;
var url = "https://www.51jct.cn/weixin/miniprogram/ashx/service.ashx";
var pageindex = 1;
var pagesize = 5;
var status = '';


// 请求数据
var loadMore = function (that) {
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
      pageindex: pageindex,
      pagesize: pagesize,
      status: status,
      memberId: that.data.memberId,
      action: "orderPage"
    },
    success: function (res) {
      
      var list = that.data.list;
      var listMessage = res.data.Message;
      console.log(listMessage);
      for (var i = 0; i < listMessage.length; i++) {
        list.push(listMessage[i]);
      }
      that.setData({
        list: list
      });
      pageindex++;
      that.setData({
        hidden: true
      });
    }
  });
}

Page({
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    memberId:''
  },
  onLoad: function (options) {
    var that = this;
    var memberId = app.globalData.memberId;
    wx.request({
      url: wwwRoot + "/weixin/jctnew/ashx/service.ashx",
      data: {
        memberId: app.globalData.memberId,
        action: "getorderbyid",
        orderId: "201806071000001"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      success: function (res) {
        var Success = res.data.Success;
        //var Data = JSON.parse(res.data);
        //console.log();
        if (Success) {
          that.setData({
            memberId: memberId
          });
          loadMore(that);
        } else {
          wx.navigateTo({
            url: '/pages/logIndex/logIndex',
          })
        }

      },
      fail: function (res) {
        console.log("获取失败！");
      }
    })
    //   这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    
  },
  onShow: function () {

  },
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    loadMore(that);
    console.log("lower");
  },
  scroll: function (event) {
    
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    pageindex = 0;
    this.setData({
      //list: [],
      scrollTop: 0
    });
    loadMore(this);
    console.log("lower");
  }
})