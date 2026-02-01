// pages/gala/programs/index.js
const api = require('../../../api/index')

Page({
  data: {
    platformId: null,
    platform: null,
    programs: [],
    filteredPrograms: [],
    loading: false,
    searchKeyword: ''
  },

  onLoad(options) {
    console.log('[GalaPrograms] onLoad, platformId:', options.platformId)
    const platformId = options.platformId || '1'

    this.setData({ platformId })
    this.loadData()
  },

  /**
   * 加载数据
   */
  async loadData() {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      // 获取平台信息（从全局数据或模拟）
      const platform = this.getPlatformInfo(this.data.platformId)

      // 获取节目列表
      const res = await api.gala.getPrograms(this.data.platformId)
      console.log('[GalaPrograms] Programs loaded:', res)

      this.setData({
        platform,
        programs: res.data || [],
        filteredPrograms: res.data || [],
        loading: false
      })
    } catch (error) {
      console.error('[GalaPrograms] Load data failed:', error)
      // 使用模拟数据
      const mockPrograms = this.getMockPrograms()
      this.setData({
        platform: this.getPlatformInfo(this.data.platformId),
        programs: mockPrograms,
        filteredPrograms: mockPrograms,
        loading: false
      })
    }
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.trim()
    this.setData({ searchKeyword: keyword })
    this.filterPrograms(keyword)
  },

  /**
   * 琜索确认
   */
  onSearchConfirm() {
    const keyword = this.data.searchKeyword.trim()
    this.filterPrograms(keyword)
  },

  /**
   * 清空搜索
   */
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      filteredPrograms: this.data.programs
    })
  },

  /**
   * 过滤节目
   */
  filterPrograms(keyword) {
    if (!keyword) {
      this.setData({ filteredPrograms: this.data.programs })
      return
    }

    const filtered = this.data.programs.filter(item => {
      const searchText = `${item.name} ${item.performers || ''} ${item.type || ''}`
      return searchText.toLowerCase().includes(keyword.toLowerCase())
    })

    this.setData({ filteredPrograms: filtered })
  },

  /**
   * 获取平台信息
   */
  getPlatformInfo(id) {
    const platforms = {
      '1': {
        id: 1,
        name: '中央广播电视总台',
        logo: '/images/gala-cctv.png',
        broadcast_time: '2026年1月28日 20:00'
      },
      '2': {
        id: 2,
        name: '辽宁卫视',
        logo: '/images/gala-liaoning.png',
        broadcast_time: '2026年1月28日 19:30'
      },
      '3': {
        id: 3,
        name: '河南卫视',
        logo: '/images/gala-henan.png',
        broadcast_time: '2026年1月28日 19:30'
      },
      '4': {
        id: 4,
        name: '江苏卫视',
        logo: '/images/gala-jiangsu.png',
        broadcast_time: '2026年1月28日 19:30'
      },
      '5': {
        id: 5,
        name: '北京卫视',
        logo: '/images/gala-beijing.png',
        broadcast_time: '2026年1月28日 19:30'
      }
    }
    return platforms[id] || platforms['1']
  },

  /**
   * 模拟节目数据
   */
  getMockPrograms() {
    return [
      { id: 1, order: '01', name: '开场歌舞《新春欢歌》', performers: '全体主持人', type: '歌舞' },
      { id: 2, order: '02', name: '相声《马年说马》', performers: '郭德纲 于谦', type: '相声' },
      { id: 3, order: '03', name: '小品《回家过年》', performers: '沈腾 贾玲', type: '小品' },
      { id: 4, order: '04', name: '歌曲《我和我的祖国》', performers: '廖昌永', type: '歌曲' },
      { id: 5, order: '05', name: '武术《中华武魂》', performers: '少林武僧团', type: '武术' },
      { id: 6, order: '06', name: '小品《幸福生活》', performers: '贾玲 张小斐', type: '小品' },
      { id: 7, order: '07', name: '舞蹈《丝路花语》', performers: '中国东方演艺集团', type: '舞蹈' },
      { id: 8, order: '08', name: '歌曲《明天会更好》', performers: '周深', type: '歌曲' },
      { id: 9, order: '09', name: '杂技《勇攀高峰》', performers: '中国杂技团', type: '杂技' },
      { id: 10, order: '10', name: '尾声《难忘今宵》', performers: '全体演员', type: '歌舞' },
      { id: 11, order: '11', name: '相声《我要上春晚》', performers: '岳云鹏 孙越', type: '相声' },
      { id: 12, order: '12', name: '小品《投其所好》', performers: '艾伦 常远', type: '小品' },
      { id: 13, order: '13', name: '魔术《见证奇迹》', performers: '刘谦', type: '魔术' },
      { id: 14, order: '14', name: '歌曲《万疆》', performers: '迪丽热巴', type: '歌曲' },
      { id: 15, order: '15', name: '歌曲《时代感》', performers: '王俊凯 王源', type: '歌曲' }
    ]
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '2026春晚节目单',
      path: `/pages/gala/programs/index?platformId=${this.data.platformId}`
    }
  }
})

