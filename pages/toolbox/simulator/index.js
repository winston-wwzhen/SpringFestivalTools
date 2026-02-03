// pages/toolbox/simulator/index.js
const app = getApp()

Page({
  data: {
    currentScene: 'countdown',
    countdownDays: 0,
    firecrackerActive: false,
    boomShow: false,
    couplerPasted: false,
    dinnerDishes: ['🍖 红烧肉', '🐟 年年有余', '🥟 饺子', '🍗 白切鸡'],
    sceneDescriptions: {
      countdown: {
        title: '春节倒计时',
        text: '距离2026马年春节还有多少天？期待新年的到来！'
      },
      firecracker: {
        title: '放鞭炮',
        text: '点击按钮或鞭炮，感受过年的热闹氛围！注意：小心烟花哦~'
      },
      coupler: {
        title: '贴春联',
        text: '春节贴春联是传统习俗，点击按钮贴上春联，迎接福气！'
      },
      gala: {
        title: '看春晚',
        text: '除夕夜一家人围坐看春晚，是过年最温馨的时刻！'
      },
      dinner: {
        title: '年夜饭',
        text: '年夜饭是春节最重要的团圆饭，加菜享用美食吧！'
      }
    }
  },

  onLoad() {
    // 计算倒计时
    this.calculateCountdown()
  },

  /**
   * 计算倒计时
   */
  calculateCountdown() {
    const now = new Date()
    const springFestival = new Date('2026-02-17')
    const diffTime = springFestival - now
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    this.setData({
      countdownDays: days > 0 ? days : 0
    })
  },

  /**
   * 切换场景
   */
  switchScene(e) {
    const scene = e.currentTarget.dataset.scene
    this.setData({
      currentScene: scene
    })
  },

  /**
   * 点燃鞭炮
   */
  triggerFirecracker() {
    this.setData({
      firecrackerActive: true,
      boomShow: false
    })

    setTimeout(() => {
      this.setData({
        firecrackerActive: false,
        boomShow: true
      })
    }, 500)

    // 2秒后隐藏爆炸文字
    setTimeout(() => {
      this.setData({
        boomShow: false
      })
    }, 2000)
  },

  /**
   * 贴春联
   */
  pasteCouplet() {
    wx.vibrateShort()
    this.setData({
      couplerPasted: true
    })

    setTimeout(() => {
      wx.showToast({
        title: '春联贴好了！',
        icon: 'success'
      })
    }, 500)
  },

  /**
   * 换台
   */
  switchChannel() {
    const channels = [
      { name: '央视春晚', time: '20:00' },
      { name: '湖南春晚', time: '19:30' },
      { name: '浙江春晚', time: '20:00' },
      { name: '东方春晚', time: '19:30' }
    ]

    const random = channels[Math.floor(Math.random() * channels.length)]
    wx.showToast({
      title: `切换到 ${random.name}`,
      icon: 'none'
    })
  },

  /**
   * 加菜
   */
  addDish() {
    const dishes = [
      '🦆 北京烤鸭', '🥬 白菜', '🍲 火锅', '🍜 面条',
      '🥩 牛排', '🦆 鹅肝', '🦞 龙虾', '🍕 披萨',
      '🍣 寿司', '🥪 汉堡', '🍝 意面', '🌮 墨西哥卷'
    ]

    const randomDish = dishes[Math.floor(Math.random() * dishes.length)]

    this.setData({
      dinnerDishes: [...this.data.dinnerDishes, randomDish]
    })

    wx.showToast({
      title: `加菜：${randomDish}`,
      icon: 'none'
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '新年模拟器 - 体验过年氛围',
      path: '/pages/toolbox/simulator/index'
    }
  }
})
