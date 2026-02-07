// pages/index/index.js
const app = getApp()
const api = require('../../api/index')
const logger = require('../../utils/logger')

Page({
  data: {
    countdownDays: 0,
    redpackCount: 0,
    galaCount: 0,
    dailyItems: [],
    // 所有春节小知识
    allTips: [
      '除夕夜要守岁到12点，寓意把一切邪瘟病疫驱走',
      '初一要拜年，说吉祥话，忌说不吉利的话',
      '过年吃饺子寓意"更岁交子"，新旧交替',
      '马年戴红绳，趋吉避凶，马到成功',
      '贴春联要贴在大门两侧，上联在右，下联在左',
      '放鞭炮是为了驱赶年兽，保佑平安',
      '长辈给晚辈压岁钱，寓意压住邪祟',
      '正月初五接财神，迎福纳财',
      '元宵节吃汤圆，寓意团团圆圆',
      '过年不扫地，不倒垃圾，怕扫走财气',
      '拜年时长辈给晚辈发红包，晚辈要双手接',
      '过年穿新衣，辞旧迎新，万象更新',
      '春节祭祀祖先，表达孝心和敬意',
      '舞龙舞狮祈求风调雨顺，五谷丰登',
      '年夜饭要有鱼，寓意年年有余',
      '门神要贴在门上，保家宅平安',
      '福字倒贴，寓意福到了',
      '年画贴在墙上，增添喜庆气氛',
      '春节要给长辈拜年，表示尊敬',
      '过年不吵架，和和美美过新年'
    ],
    tips: [],
  },

  onLoad() {
    this.setData({
      countdownDays: app.globalData.countdownDays
    })
    this.randomizeTips()
    this.loadData()
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadCounts()
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onShareAppMessage() {
    return {
      title: '春节攻略助手，红包、春晚、称呼全攻略',
      path: '/pages/index/index',
      imageUrl: '/images/share.jpg'
    }
  },

  /**
   * 加载页面数据
   */
  async loadData() {
    try {
      await Promise.all([
        this.loadCounts(),
        this.loadDailyItems()
      ])
    } catch (error) {
      logger.error('加载首页数据失败:', error)
    }
  },

  /**
   * 加载各模块数据量
   */
  async loadCounts() {
    try {
      // 为 count 接口设置 5 秒超时
      const [redpackRes, galaRes] = await Promise.all([
        api.redpack.getCount().catch(() => ({ count: 6 })),
        api.gala.getCount().catch(() => ({ count: 17 }))
      ])

      this.setData({
        redpackCount: redpackRes.count || 6,
        galaCount: galaRes.count || 17
      })
    } catch (error) {
      logger.warn('加载统计数据失败:', error.message)
      // 使用默认值
      this.setData({
        redpackCount: 6,
        galaCount: 17
      })
    }
  },

  /**
   * 加载每日精选
   */
  async loadDailyItems() {
    try {
      const res = await api.common.getDailyRecommend()
      if (res.data && res.data.length > 0) {
        this.setData({
          dailyItems: res.data
        })
      } else {
        this.setData({
          dailyItems: this.getDefaultDailyItems()
        })
      }
    } catch (error) {
      logger.warn('加载精选失败，使用默认数据:', error.message)
      this.setData({
        dailyItems: this.getDefaultDailyItems()
      })
    }
  },

  /**
   * 默认精选数据
   */
  getDefaultDailyItems() {
    return [
      {
        id: 1,
        icon: '🧧',
        title: '微信五福红包',
        description: '集五福活动已经开始，快来集福卡吧',
        category: '红包活动',
        type: 'primary',
        time: '今天 10:00'
      },
      {
        id: 2,
        icon: '📺',
        title: '央视春晚节目单',
        description: '2026年央视春晚完整节目单已公布',
        category: '春晚',
        type: 'secondary',
        time: '昨天 18:00'
      },
      {
        id: 3,
        icon: '🧧',
        title: '支付宝集五福',
        description: 'AR扫福、森林浇水，多种方式集福卡',
        category: '红包活动',
        type: 'primary',
        time: '2天前'
      }
    ]
  },

  /**
   * 跳转到红包攻略
   */
  goToRedpack() {
    wx.switchTab({
      url: '/pages/redpack/list/index'
    })
  },

  /**
   * 跳转到春晚节目单
   */
  goToGala() {
    wx.switchTab({
      url: '/pages/gala/platforms/index'
    })
  },

  /**
   * 跳转到百宝箱
   */
  goToToolbox() {
    wx.switchTab({
      url: '/pages/toolbox/index/index'
    })
  },

  /**
   * 跳转到新年模拟器
   */
  goToSimulator() {
    wx.navigateTo({
      url: '/pages-toolbox-sub/pages/toolbox/simulator/index'
    })
  },

  /**
   * 查看详情
   */
  goToDetail(e) {
    const item = e.currentTarget.dataset.item
    // 根据类型跳转到对应页面
    if (item.category === '红包活动') {
      wx.navigateTo({
        url: `/pages/redpack/detail/index?id=${item.id}`
      })
    } else if (item.category === '春晚') {
      wx.navigateTo({
        url: `/pages/gala/programs/index?platformId=${item.id}`
      })
    }
  },

  /**
   * 查看更多
   */
  loadMore() {
    wx.showToast({
      title: '更多功能开发中',
      icon: 'none'
    })
  },

  /**
   * 随机选择4条小知识
   */
  randomizeTips() {
    const allTips = this.data.allTips
    const shuffled = [...allTips].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 4)
    this.setData({ tips: selected })
  },

  /**
   * 刷新小知识
   */
  refreshTips() {
    this.randomizeTips()
    wx.showToast({
      title: '已刷新',
      icon: 'success',
      duration: 1000
    })
  }
})
