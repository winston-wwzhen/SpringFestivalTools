// pages/gala/programs/index.js
const api = require('../../../api/index')

Page({
  data: {
    platformId: null,
    platform: null,
    programs: [],
    filteredPrograms: [],
    loading: false,
    searchKeyword: '',
    activeFilter: 'all',
    favCount: 0
  },

  onLoad(options) {
    console.log('[GalaPrograms] onLoad, platformId:', options.platformId)
    const platformId = options.platformId || '1'

    this.setData({ platformId })
    this.loadData()
    this.loadFavList()
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

      let programs = res.data || []

      // 加载收藏状态
      const favList = wx.getStorageSync('gala_fav_list') || {}
      programs = programs.map(p => ({
        ...p,
        isFav: !!favList[p.id]
      }))

      this.setData({
        platform,
        programs,
        filteredPrograms: this.applyFilter(programs, this.data.activeFilter),
        favCount: Object.keys(favList).length,
        loading: false
      })
    } catch (error) {
      console.error('[GalaPrograms] Load data failed:', error)
      // 使用模拟数据
      const mockPrograms = this.getMockPrograms()

      // 加载收藏状态
      const favList = wx.getStorageSync('gala_fav_list') || {}
      const programs = mockPrograms.map(p => ({
        ...p,
        isFav: !!favList[p.id]
      }))

      this.setData({
        platform: this.getPlatformInfo(this.data.platformId),
        programs,
        filteredPrograms: this.applyFilter(programs, this.data.activeFilter),
        favCount: Object.keys(favList).length,
        loading: false
      })
    }
  },

  /**
   * 加载收藏列表
   */
  loadFavList() {
    const favList = wx.getStorageSync('gala_fav_list') || {}
    this.setData({ favCount: Object.keys(favList).length })
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
   * 搜索确认
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
      filteredPrograms: this.applyFilter(this.data.programs, this.data.activeFilter)
    })
  },

  /**
   * 过滤节目
   */
  filterPrograms(keyword) {
    let filtered = this.data.programs

    // 先应用分类筛选
    filtered = this.applyFilter(filtered, this.data.activeFilter)

    // 再应用搜索关键词
    if (keyword) {
      filtered = filtered.filter(item => {
        const searchText = `${item.name} ${item.performers || ''} ${item.type || ''}`
        return searchText.toLowerCase().includes(keyword.toLowerCase())
      })
    }

    this.setData({ filteredPrograms: filtered })
  },

  /**
   * 应用分类筛选
   */
  applyFilter(programs, filter) {
    if (filter === 'all') return programs
    if (filter === 'fav') return programs.filter(p => p.isFav)

    // 语言类包括相声和小品
    if (filter === '语言') {
      return programs.filter(p => ['相声', '小品'].includes(p.type))
    }

    return programs.filter(p => p.type === filter)
  },

  /**
   * 切换筛选
   */
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ activeFilter: filter })
    this.filterPrograms(this.data.searchKeyword)
  },

  /**
   * 获取类型数量
   */
  getTypeCount(type) {
    if (type === '语言') {
      return this.data.programs.filter(p => ['相声', '小品'].includes(p.type)).length
    }
    return this.data.programs.filter(p => p.type === type).length
  },

  /**
   * 获取类型颜色
   */
  getTypeColor(type) {
    const colorMap = {
      '歌舞': 'type-song',
      '相声': 'type-comedy',
      '小品': 'type-skit',
      '武术': 'type-wushu',
      '舞蹈': 'type-dance',
      '杂技': 'type-acrobatics',
      '魔术': 'type-magic'
    }
    return colorMap[type] || 'type-default'
  },

  /**
   * 切换收藏
   */
  onToggleFav(e) {
    const id = e.currentTarget.dataset.id
    const programs = this.data.programs.map(p => {
      if (p.id === id) {
        return { ...p, isFav: !p.isFav }
      }
      return p
    })

    // 更新存储
    const favList = wx.getStorageSync('gala_fav_list') || {}
    if (programs.find(p => p.id === id).isFav) {
      favList[id] = true
      wx.showToast({
        title: '已收藏',
        icon: 'success',
        duration: 1000
      })
    } else {
      delete favList[id]
      wx.showToast({
        title: '已取消',
        icon: 'none',
        duration: 1000
      })
    }
    wx.setStorageSync('gala_fav_list', favList)

    // 更新数据
    this.setData({
      programs,
      filteredPrograms: this.applyFilter(programs, this.data.activeFilter),
      favCount: Object.keys(favList).length
    })
  },

  /**
   * 点击节目卡片
   */
  onProgramClick(e) {
    // 检查是否点击了收藏图标
    if (e.target.dataset?.id) return

    const id = e.currentTarget.dataset.id
    const program = this.data.programs.find(p => p.id === id)

    if (program) {
      // 可以显示节目详情或执行其他操作
      console.log('[GalaPrograms] Program clicked:', program)
    }
  },

  /**
   * 获取平台信息
   */
  getPlatformInfo(id) {
    const platforms = {
      '1': {
        id: 1,
        name: '中央广播电视总台',
        emoji: '📺',
        broadcast_time: '2026年1月28日 20:00'
      },
      '2': {
        id: 2,
        name: '湖南卫视',
        emoji: '🌶️',
        broadcast_time: '2026年1月28日 19:30'
      },
      '3': {
        id: 3,
        name: '浙江卫视',
        emoji: '💫',
        broadcast_time: '2026年1月28日 19:30'
      },
      '4': {
        id: 4,
        name: '东方卫视',
        emoji: '🌃',
        broadcast_time: '2026年1月28日 19:30'
      },
      '5': {
        id: 5,
        name: '江苏卫视',
        emoji: '🍒',
        broadcast_time: '2026年1月28日 19:30'
      },
      '6': {
        id: 6,
        name: '北京卫视',
        emoji: '🧧',
        broadcast_time: '2026年1月28日 19:30'
      },
      '7': {
        id: 7,
        name: '辽宁卫视',
        emoji: '🎭',
        broadcast_time: '2026年1月28日 19:30'
      },
      '8': {
        id: 8,
        name: '河南卫视',
        emoji: '🏮',
        broadcast_time: '2026年1月28日 19:30'
      },
      '9': {
        id: 9,
        name: '广东卫视',
        emoji: '🧨',
        broadcast_time: '2026年1月28日 19:30'
      },
      '10': {
        id: 10,
        name: '四川卫视',
        emoji: '🐼',
        broadcast_time: '2026年1月28日 19:30'
      },
      '11': {
        id: 11,
        name: '山东卫视',
        emoji: '⛰️',
        broadcast_time: '2026年1月28日 19:30'
      },
      '12': {
        id: 12,
        name: '湖北卫视',
        emoji: '🌸',
        broadcast_time: '2026年1月28日 19:30'
      },
      '13': {
        id: 13,
        name: '陕西卫视',
        emoji: '🏛️',
        broadcast_time: '2026年1月28日 19:30'
      },
      '14': {
        id: 14,
        name: '天津卫视',
        emoji: '🎪',
        broadcast_time: '2026年1月28日 19:30'
      },
      '15': {
        id: 15,
        name: '黑龙江卫视',
        emoji: '❄️',
        broadcast_time: '2026年1月28日 19:30'
      },
      '16': {
        id: 16,
        name: '安徽卫视',
        emoji: '🎋',
        broadcast_time: '2026年1月28日 19:30'
      },
      '17': {
        id: 17,
        name: '深圳卫视',
        emoji: '🌊',
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
      { id: 15, order: '15', name: '歌曲《时代感》', performers: '王俊凯 王源', type: '歌曲' },
      { id: 16, order: '16', name: '舞蹈《只此青绿》', performers: '孟庆旸', type: '舞蹈' },
      { id: 17, order: '17', name: '相声《儿时趣事》', performers: '卢鑫 玉浩', type: '相声' },
      { id: 18, order: '18', name: '小品《面试》', performers: '金靖 周铁男', type: '小品' }
    ]
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: `${this.data.platform?.name || '2026'}春晚节目单`,
      path: `/pages/gala/programs/index?platformId=${this.data.platformId}`
    }
  }
})
