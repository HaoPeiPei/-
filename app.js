//app.js

App({
  //初始化全局参数
  initGlobalData:function(){
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          console.log('code :' + code)
          console.log('res :' + res)
          this.getOpenId(code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      },
      fail: function (res) {
        console.log('登录失败');
      }
    })
  },
  //获取openid
  getOpenId: function(code) {
    var that = this;  
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx9766d9666a9dd73d&secret=313d0ece56ad563fd0da66a7e4cd473e&js_code='+code+'&grant_type=authorization_code';
    wx.request({
      url: url,
      method: "get",
      success: res => {
        let statusCode = res.statusCode
        if (200 === statusCode) {
          that.globalData.openId == res.data.openid;
          that.getUserInfo()
        } else {
          console.log('获取 openId 失败')
        }
      },
    })
  },
  //获取用户信息
  getUserInfo: function(){
    var that = this;
    wx.request({
      url: this.globalData.wwwRoot +'/weixin/jctnew/ashx/user.ashx?action=getUserInfo&openId='+that.globalData.openId,
      method: "get",
      success: res => {
        console.log(res);
        /* let statusCode = res.statusCode
        if (200 === statusCode) {
          that.globalData.openId == res.data.openid;
        } else {
          console.log('获取用户信息失败')
        } */
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
    memberId: 7530,//6711
    openId : 'oZDU-wbLV1EJkwy4Xdt-dt7HQIm8',
    unionid : 'ojVAM1Bh4TS4VV_buGp7Io0_gSgU',//
    userInfo: {},
    user: {
      realName: '郝沛沛',
      mobile: '18971570000',
    },
    airportCode:'SZX',
    airportName:'深圳宝安国际机场',
  },
   

})