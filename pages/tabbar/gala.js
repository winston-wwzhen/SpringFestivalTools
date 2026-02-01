// pages/tabbar/gala.js
Page({
  onLoad() {
    console.log('[TabBar:Gala] onLoad triggered')
  },

  onShow() {
    console.log('[TabBar:Gala] onShow triggered')
    wx.reLaunch({
      url: '/pages-gala/platforms/index',
      success: () => {
        console.log('[TabBar:Gala] reLaunch success')
      },
      fail: (err) => {
        console.error('[TabBar:Gala] reLaunch failed:', err)
      }
    })
  }
})
