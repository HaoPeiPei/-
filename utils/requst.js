module.exports = {
  HttpRequst: HttpRequst,
}

const wwwRoot = "https://www.51jct.cn/";

function HttpRequst(loading, url, params, method, callBack) {
  if (loading == true) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
  }
  wx.request({
    url: wwwRoot + url,
    data: params,
    dataType: "json",
    header: {
      'content-Type': 'application/x-www-form-urlencoded'
    },
    method: method,
    success: function(res) {
      if (loading == true) {
        wx.hideToast(); //隐藏提示框
      }
      // if (res.data.code == 5000) {
      //   wxLogin(loading, url, sessionChoose, sessionId, params, method, ask, callBack);
      // }
      callBack(res.data);
    },
    complete: function() {
      if (loading == true) {
        wx.hideToast(); //隐藏提示框
      }
    }
  })
}