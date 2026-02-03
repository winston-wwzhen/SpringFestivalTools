// pages/toolbox/index/index.js
Page({
  data: {},

  /**
   * 跳转到亲戚称呼
   */
  goToKinship() {
    wx.navigateTo({
      url: '/pages/toolbox/kinship/index'
    })
  },

  /**
   * 跳转到新年运势
   */
  goToFortune() {
    wx.navigateTo({
      url: '/pages/toolbox/fortune/index'
    })
  },

  /**
   * 跳转到祝福语生成器
   */
  goToBlessing() {
    wx.navigateTo({
      url: '/pages/toolbox/blessing/index'
    })
  },

  /**
   * 跳转到新年模拟器
   */
  goToSimulator() {
    wx.navigateTo({
      url: '/pages/toolbox/simulator/index'
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '春节百宝箱 - 实用工具大全',
      path: '/pages/toolbox/index/index'
    }
  }
})
