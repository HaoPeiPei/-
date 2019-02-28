//app.js

App({
  //初始化全局参数
  initGlobalData:function(){
    var that = this;
    wx.login({
      success: res => {
        that.getOpenId(res.code)
      },
      fail: function (res) {
        console.log('登录失败');
      }
    })
  },
  //获取openid
  getOpenId: function(code) {
    var that = this;  
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx95a1e8c05c84caca&secret=0d543d50dddebd2e3718adc47dfbd2c8&js_code='+code+'&grant_type=authorization_code';
    wx.request({
      url: url,
      method: "get",
      success: res => {
        let statusCode = res.statusCode;
        if (200 === statusCode) {
          that.globalData.openId = res.data.openid;
          that.globalData.unionid= res.data.unionid;
          that.getUserInfo()
        } else {
          console.log('获取 openId 失败')
        }
      }
    })
  },
  //获取用户信息
  getUserInfo: function(){
    var that = this;
    wx.request({
      url: this.globalData.wwwRoot +'/weixin/jctnew/ashx/user.ashx?action=getUserInfo&UnionId='+that.globalData.unionid,
      method: "get",
      success: res => {
        if(res.statusCode == 200 && res.data.Success){
          var resDate = JSON.parse(res.data.Data);
          that.globalData.memberId = resDate.id;
          that.globalData.unionid= resDate.UnionId;
          that.globalData.user = resDate;
        }
        wx.showModal({
          title: 'app.js',
          content: that.globalData.memberId,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.initGlobalData();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    wwwRoot: "https://www.51jct.cn",
    imgRoot: "http://www.51jct.cn/weixin/miniprogram",
    remoteUrl: "https://www.51jct.cn",
    memberId: '',//6711
    openId : '',
    unionid : '',//
    user: {},
    userInfo: {},
    airportCode:'SZX',
    airportName:'深圳宝安国际机场',
  },
   

})