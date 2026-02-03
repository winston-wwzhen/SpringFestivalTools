// pages/redpack/detail/index.js
Page({
  data: {
    activity: null,
    showRules: false,
    showSteps: true,
    showTips: false,
    countdownText: '',
    countdownLabel: '',
    copied: false,
    countdownTimer: null
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
      // 启动倒计时
      this.startCountdown()
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
    // 清除倒计时定时器
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer)
    }
  },

  /**
   * 启动倒计时
   */
  startCountdown() {
    this.updateCountdown()
    this.data.countdownTimer = setInterval(() => {
      this.updateCountdown()
    }, 1000)
  },

  /**
   * 更新倒计时
   */
  updateCountdown() {
    const activity = this.data.activity
    if (!activity) return

    const now = new Date().getTime()
    // 优先使用时间戳，如果没有则尝试解析格式化时间
    const endTime = activity.end_timestamp || (activity.end_time ? new Date(activity.end_time).getTime() : 0)
    const startTime = activity.start_timestamp || (activity.start_time ? new Date(activity.start_time).getTime() : 0)

    if (!endTime || !startTime) {
      this.setData({ countdownText: '', countdownLabel: '' })
      return
    }

    let targetTime, label

    if (now < startTime) {
      targetTime = startTime
      label = '距离开始'
    } else if (now >= startTime && now < endTime) {
      targetTime = endTime
      label = '距离结束'
    } else {
      this.setData({ countdownText: '', countdownLabel: '' })
      clearInterval(this.data.countdownTimer)
      return
    }

    const diff = targetTime - now

    if (diff <= 0) {
      this.setData({ countdownText: '', countdownLabel: '' })
      clearInterval(this.data.countdownTimer)
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    let text = ''
    if (days > 0) {
      text = `${days}天${hours}时${minutes}分`
    } else if (hours > 0) {
      text = `${hours}时${minutes}分${seconds}秒`
    } else {
      text = `${minutes}分${seconds}秒`
    }

    this.setData({
      countdownText: text,
      countdownLabel: label
    })
  },

  /**
   * 复制口令码
   */
  copyCode() {
    const activity = this.data.activity
    if (!activity?.detail?.code) return

    wx.setClipboardData({
      data: activity.detail.code,
      success: () => {
        this.setData({ copied: true })
        wx.showToast({
          title: '口令已复制',
          icon: 'success'
        })
        // 2秒后恢复按钮状态
        setTimeout(() => {
          this.setData({ copied: false })
        }, 2000)
      }
    })
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
      title: activity ? `${activity.title} - 最高${activity.max_reward}` : '春节活动',
      path: `/pages/redpack/detail/index?id=${this.data.activity?.id}`,
      imageUrl: '/images/share-redpack.jpg'
    }
  }
})
