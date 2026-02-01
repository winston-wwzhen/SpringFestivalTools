// pages/tabbar/redpack.js
Page({
  onShow() {
    // 跳转到分包页面
    wx.reLaunch({
      url: '/pages-redpack/list/index'
    })
  }
})
