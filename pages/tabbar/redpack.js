// pages/tabbar/redpack.js
Page({
  onLoad() {
    console.log('[TabBar:Redpack] onLoad triggered')
  },

  onShow() {
    console.log('[TabBar:Redpack] onShow triggered')
    // 跳转到分包页面
    wx.reLaunch({
      url: '/pages-redpack/list/index',
      success: () => {
        console.log('[TabBar:Redpack] reLaunch success')
      },
      fail: (err) => {
        console.error('[TabBar:Redpack] reLaunch failed:', err)
      }
    })
  }
})
