// pages/toolbox/simulator/index.js
const scriptsData = require('./scripts.js')

Page({
  data: {
    // 当前剧本
    currentScript: null,
    // 当前月份 (1-12)
    currentMonth: 1,
    // 当前事件
    currentEvent: null,
    // 游戏是否结束
    gameEnding: false,
    // 最终属性
    finalStats: {},
    // 结局
    ending: {},
    // 属性列表
    statsList: [
      { key: 'wealth', label: '财富', icon: '💰', value: 50, color: '#FFD700' },
      { key: 'career', label: '事业', icon: '💼', value: 50, color: '#FF6B6B' },
      { key: 'love', label: '爱情', icon: '💕', value: 50, color: '#FF69B4' },
      { key: 'health', label: '健康', icon: '💪', value: 50, color: '#4CAF50' },
      { key: 'happiness', label: '幸福', icon: '😊', value: 50, color: '#FF9800' }
    ],
    // 当前属性
    currentStats: {
      wealth: 50,
      career: 50,
      love: 50,
      health: 50,
      happiness: 50
    },
    // 年度回顾列表
    reviewList: []
  },

  onLoad() {
    // 随机选择一个剧本开始游戏
    this.startRandomGame()
  },

  /**
   * 随机开始游戏
   */
  startRandomGame() {
    const scriptIds = Object.keys(scriptsData.scripts)
    const randomId = scriptIds[Math.floor(Math.random() * scriptIds.length)]
    const script = scriptsData.scripts[randomId]

    // 初始化游戏状态
    this.setData({
      currentScript: script,
      currentMonth: 1,
      currentEvent: script.events[0],
      currentStats: { ...script.baseStats },
      gameEnding: false,
      reviewList: []
    })

    this.updateStatsDisplay()
  },

  /**
   * 选择选项
   */
  selectOption(e) {
    const index = e.currentTarget.dataset.index
    const option = this.data.currentEvent.options[index]

    // 更新属性
    const newStats = { ...this.data.currentStats }
    for (const key in option.stats) {
      newStats[key] = Math.max(0, Math.min(100, newStats[key] + option.stats[key]))
    }

    // 记录选择
    const reviewList = [...this.data.reviewList, {
      month: this.data.currentMonth,
      choice: option.text,
      stats: { ...option.stats }
    }]

    // 显示属性变化提示
    this.showStatsChange(option.stats)

    // 更新状态
    this.setData({
      currentStats: newStats,
      reviewList
    })

    this.updateStatsDisplay()

    // 检查是否游戏结束
    if (this.data.currentMonth >= 12) {
      this.endGame()
    } else {
      // 进入下一个月
      setTimeout(() => {
        this.nextMonth()
      }, 500)
    }
  },

  /**
   * 显示属性变化提示
   */
  showStatsChange(stats) {
    const messages = []
    const statNames = {
      wealth: '财富',
      career: '事业',
      love: '爱情',
      health: '健康',
      happiness: '幸福'
    }

    for (const key in stats) {
      const value = stats[key]
      if (value > 0) {
        messages.push(`${statNames[key]} +${value}`)
      } else if (value < 0) {
        messages.push(`${statNames[key]} ${value}`)
      }
    }

    if (messages.length > 0) {
      wx.showToast({
        title: messages.join(' '),
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
   * 进入下一个月
   */
  nextMonth() {
    const nextMonth = this.data.currentMonth + 1
    const nextEvent = this.data.currentScript.events[nextMonth - 1]

    this.setData({
      currentMonth: nextMonth,
      currentEvent: nextEvent
    })
  },

  /**
   * 更新属性显示
   */
  updateStatsDisplay() {
    const statsList = this.data.statsList.map(item => ({
      ...item,
      value: this.data.currentStats[item.key]
    }))

    this.setData({ statsList })
  },

  /**
   * 结束游戏
   */
  endGame() {
    const finalStats = { ...this.data.currentStats }
    const ending = scriptsData.getEnding(finalStats)

    this.setData({
      gameEnding: true,
      finalStats,
      ending,
      currentEvent: null
    })

    wx.vibrateShort()
  },

  /**
   * 重新开始
   */
  restartGame() {
    // 直接调用随机开始游戏
    this.startRandomGame()
  },

  /**
   * 分享结果
   */
  shareResult() {
    const { ending, finalStats } = this.data
    return {
      title: `我在2026年获得了【${ending.title}】结局！`,
      path: '/pages/toolbox/simulator/index',
      imageUrl: ''
    }
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    if (this.data.gameEnding) {
      return this.shareResult()
    }
    return {
      title: '新年模拟器 - 模拟你的2026',
      path: '/pages/toolbox/simulator/index'
    }
  }
})
