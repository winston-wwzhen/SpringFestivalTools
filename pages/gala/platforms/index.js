// pages/gala/platforms/index.js
const api = require('../../../api/index')

Page({
  data: {
    list: [],
    loading: false
  },

  onLoad(options) {
    console.log('[GalaPlatforms] onLoad triggered')
    this.loadData()
  },

  onShow() {
    console.log('[GalaPlatforms] onShow triggered')
  },

  onReady() {
    console.log('[GalaPlatforms] onReady triggered')
  },

  onHide() {
    console.log('[GalaPlatforms] onHide triggered')
  },

  onUnload() {
    console.log('[GalaPlatforms] onUnload triggered')
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
      console.log('[GalaPlatforms] Loading platforms')
      const res = await api.gala.getPlatforms()
      console.log('[GalaPlatforms] Data loaded:', res)

      this.setData({
        list: res.data || [],
        loading: false
      })
    } catch (error) {
      console.error('[GalaPlatforms] Load data failed:', error)
      // 使用模拟数据
      this.setData({
        list: this.getMockData(),
        loading: false
      })
    }
  },

  /**
   * 跳转节目单
   */
  goToPrograms(e) {
    const id = e.currentTarget.dataset.id
    console.log('[GalaPlatforms] Go to programs, platformId:', id)
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
    return [
      {
        id: 1,
        name: '中央广播电视总台',
        logo: '/images/gala-cctv.png',
        cover_image: '/images/gala-cctv-cover.png',
        broadcast_time: '2026年1月28日 20:00',
        program_count: 42,
        is_live: false,
        tags: ['央视', '主会场', '全球直播']
      },
      {
        id: 2,
        name: '辽宁卫视',
        logo: '/images/gala-liaoning.png',
        cover_image: '/images/gala-liaoning-cover.png',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 35,
        is_live: false,
        tags: ['卫视', '东北特色', '小品']
      },
      {
        id: 3,
        name: '河南卫视',
        logo: '/images/gala-henan.png',
        cover_image: '/images/gala-henan-cover.png',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 30,
        is_live: false,
        tags: ['卫视', '传统文化', '国风']
      },
      {
        id: 4,
        name: '江苏卫视',
        logo: '/images/gala-jiangsu.png',
        cover_image: '/images/gala-jiangsu-cover.png',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 28,
        is_live: false,
        tags: ['卫视', '荔枝', '科技创新']
      },
      {
        id: 5,
        name: '北京卫视',
        logo: '/images/gala-beijing.png',
        cover_image: '/images/gala-beijing-cover.png',
        broadcast_time: '2026年1月28日 19:30',
        program_count: 32,
        is_live: false,
        tags: ['卫视', '京味儿', '冰雪']
      }
    ]
  }
})