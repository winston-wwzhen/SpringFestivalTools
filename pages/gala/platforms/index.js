// pages/gala/platforms/index.js
const api = require('../../../api/index')
const logger = require('../../../utils/logger')

// Mock 数据缓存
let MOCK_DATA_CACHE = null

Page({
  data: {
    list: [],
    loading: false
  },

  onLoad(options) {
    this.loadData()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 加载列表数据
   */
  async loadData() {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      const res = await api.gala.getPlatforms()
      
      let list = []
      if (res.data && res.data.length > 0) {
        list = res.data
      }

      // 如果API返回空数据，使用 Mock 数据
      if (list.length === 0) {
        list = this.getMockData()
      }

      this.setData({
        list,
        loading: false
      })
    } catch (error) {
      logger.warn('加载春晚平台失败，使用 Mock 数据:', error.message)
      // API 失败时使用 Mock 数据
      const list = this.getMockData()
      this.setData({
        list,
        loading: false
      })
    }
  },

  /**
   * 跳转节目单
   */
  goToPrograms(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/gala/programs/index?platformId=${id}`
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '2026春晚节目单',
      path: '/pages/gala/platforms/index'
    }
  },

  /**
   * 模拟数据
   */
  getMockData() {
    if (MOCK_DATA_CACHE) {
      return MOCK_DATA_CACHE
    }

    MOCK_DATA_CACHE = [
      {
        id: 1,
        name: '中央广播电视总台',
        short_name: '央',
        emoji: '📺',
        broadcast_time: '2026年1月28日 20:00',
        program_count: 42,
        is_live: false,
        tags: ['央视', '主会场', '全球直播']
      },
      {
        id: 2,
        name: '湖南卫视',
        short_name: '湘',
        emoji: '🌶️',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 38,
        is_live: false,
        tags: ['卫视', '快乐', '青春']
      },
      {
        id: 3,
        name: '浙江卫视',
        short_name: '浙',
        emoji: '💫',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 35,
        is_live: false,
        tags: ['卫视', '综艺', '潮流']
      },
      {
        id: 4,
        name: '东方卫视',
        short_name: '沪',
        emoji: '🌃',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 32,
        is_live: false,
        tags: ['卫视', '海派', '都市']
      },
      {
        id: 5,
        name: '江苏卫视',
        short_name: '苏',
        emoji: '🍒',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 28,
        is_live: false,
        tags: ['卫视', '荔枝', '科技创新']
      },
      {
        id: 6,
        name: '北京卫视',
        short_name: '京',
        emoji: '🧧',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 32,
        is_live: false,
        tags: ['卫视', '京味儿', '冰雪']
      },
      {
        id: 7,
        name: '辽宁卫视',
        short_name: '辽',
        emoji: '🎭',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 35,
        is_live: false,
        tags: ['卫视', '东北特色', '小品']
      },
      {
        id: 8,
        name: '河南卫视',
        short_name: '豫',
        emoji: '🏮',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 30,
        is_live: false,
        tags: ['卫视', '传统文化', '国风']
      },
      {
        id: 9,
        name: '广东卫视',
        short_name: '粤',
        emoji: '🧨',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 29,
        is_live: false,
        tags: ['卫视', '岭南', '粤语']
      },
      {
        id: 10,
        name: '四川卫视',
        short_name: '川',
        emoji: '🐼',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 27,
        is_live: false,
        tags: ['卫视', '巴蜀', '麻辣']
      },
      {
        id: 11,
        name: '山东卫视',
        short_name: '鲁',
        emoji: '⛰️',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 31,
        is_live: false,
        tags: ['卫视', '儒家', '豪爽']
      },
      {
        id: 12,
        name: '湖北卫视',
        short_name: '鄂',
        emoji: '🌸',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 26,
        is_live: false,
        tags: ['卫视', '荆楚', '黄鹤']
      },
      {
        id: 13,
        name: '陕西卫视',
        short_name: '陕',
        emoji: '🏛️',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 25,
        is_live: false,
        tags: ['卫视', '秦腔', '大唐']
      },
      {
        id: 14,
        name: '天津卫视',
        short_name: '津',
        emoji: '🎪',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 28,
        is_live: false,
        tags: ['卫视', '相声', '幽默']
      },
      {
        id: 15,
        name: '黑龙江卫视',
        short_name: '黑',
        emoji: '❄️',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 30,
        is_live: false,
        tags: ['卫视', '冰雪', '北国']
      },
      {
        id: 16,
        name: '安徽卫视',
        short_name: '皖',
        emoji: '🎋',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 27,
        is_live: false,
        tags: ['卫视', '徽派', '黄山']
      },
      {
        id: 17,
        name: '深圳卫视',
        short_name: '深',
        emoji: '🌊',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 24,
        is_live: false,
        tags: ['卫视', '科技', '创新']
      }
    ]

    return MOCK_DATA_CACHE
  }
})
