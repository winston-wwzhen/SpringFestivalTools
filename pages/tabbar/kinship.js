// pages/tabbar/kinship.js
Page({
  onLoad() {
    console.log('[TabBar:Kinship] onLoad triggered')
  },

  onShow() {
    console.log('[TabBar:Kinship] onShow triggered')
    wx.reLaunch({
      url: '/pages-kinship/index/index',
      success: () => {
        console.log('[TabBar:Kinship] reLaunch success')
      },
      fail: (err) => {
        console.error('[TabBar:Kinship] reLaunch failed:', err)
      }
    })
  }
})
