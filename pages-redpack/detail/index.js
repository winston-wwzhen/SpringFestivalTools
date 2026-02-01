// pages-redpack/detail/index.js
Page({
  data: {
    activity: null,
    showRules: false,
    showSteps: true,
    showTips: false
  },

  onLoad(options) {
    console.log('[RedpackDetail] onLoad, options:', options)
    const id = parseInt(options.id)

    // 从全局变量获取模拟数据
    const allActivities = getApp().globalData.redpackActivities || []

    const activity = allActivities.find(item => item.id === id)

    if (activity) {
      this.setData({ activity })
      // 默认展开参与步骤
      this.setData({ showSteps: true })
    } else {
      wx.showToast({
        title: '活动不存在',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  onShow() {
    console.log('[RedpackDetail] onShow')
  },

  onReady() {
    console.log('[RedpackDetail] onReady')
  },

  onHide() {
    console.log('[RedpackDetail] onHide')
  },

  onUnload() {
    console.log('[RedpackDetail] onUnload')
  },

  /**
   * 切换规则展开
   */
  toggleRules() {
    this.setData({
      showRules: !this.data.showRules
    })
  },

  /**
   * 切换步骤展开
   */
  toggleSteps() {
    this.setData({
      showSteps: !this.data.showSteps
    })
  },

  /**
   * 切换技巧展开
   */
  toggleTips() {
    this.setData({
      showTips: !this.data.showTips
    })
  },

  /**
   * 跳转平台
   */
  goToPlatform() {
    const activity = this.data.activity
    if (!activity) return

    wx.showModal({
      title: '跳转提示',
      content: `即将跳转到${activity.platform_name}APP参与活动`,
      confirmText: '去参与',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '请手动打开对应APP',
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 分享
   */
  onShare() {
    const activity = this.data.activity
    if (!activity) return

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    const activity = this.data.activity
    return {
      title: activity ? `${activity.title} - 最高${activity.max_reward}` : '春节红包活动',
      path: `/pages-redpack/detail/index?id=${this.data.activity?.id}`,
      imageUrl: '/images/share-redpack.jpg'
    }
  }
})