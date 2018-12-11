
function getOrderList(url,status, pageindex, pagesize, memberId, action,callback) {
  wx.request({
    url: url,
    data: {
      pageindex: pageindex,
      pagesize: pagesize,
      status: status,
      memberId: that.data.memberId,
      action: "orderPage"
    },
    method: 'POST',
    header: { 'content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}

module.exports = {
  getOrderList: getOrderList
}