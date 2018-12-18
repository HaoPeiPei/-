//app.js

App({
  getUserInfo:function(){
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
  getOpenId: function(code) {
    let url = "https://api.weixin.qq.com/sns/oauth2/access_token";
    wx.request({
      url: url,
      method: "POST",
      data: {
        appid : "wx95a1e8c05c84caca",
        secret : "0d543d50dddebd2e3718adc47dfbd2c8",
        js_code : code,
        grant_type : "authorization_code"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        let statusCode = res.statusCode
        if (200 === statusCode) {
          console.log(res)
        } else {
          console.log('获取 openId 失败')
        }
      },
    })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo();
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
    imgRoot: "https://www.51jct.cn",
    remoteUrl: "https://www.51jct.cn",
    memberId:'',
    userInfo: {},
    airportCode:'SZX',
    airportName:'深圳宝安国际机场',
  },
   

})