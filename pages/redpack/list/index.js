// pages/redpack/list/index.js
const api = require('../../../api/index')
const logger = require('../../../utils/logger')
const config = require('../../../config/index')

// Mock 数据缓存（模块级别，避免重复创建）
let MOCK_DATA_CACHE = null

Page({
  data: {
    list: [],
    loading: false,
    searchKeyword: '',
    activeTab: 'all',
    page: config.CONSTANTS.PAGINATION.DEFAULT_PAGE,
    hasMore: true,
    pageStatus: 'loading' // loading | error | empty | content
  },

  // 防抖定时器
  _searchTimer: null,

  onLoad(options) {
    this.loadData()
  },

  onUnload() {
    // 清理防抖定时器
    if (this._searchTimer) {
      clearTimeout(this._searchTimer)
      this._searchTimer = null
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      page: config.CONSTANTS.PAGINATION.DEFAULT_PAGE,
      hasMore: true
    })
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore()
    }
  },

  /**
   * 加载列表数据
   */
  async loadData() {
    if (this.data.loading) return

    this.setData({ 
      loading: true,
      pageStatus: 'loading'
    })

    try {
      const params = {
        page: 1,
        limit: config.CONSTANTS.PAGINATION.DEFAULT_LIMIT,
        status: this.data.activeTab === 'all' ? '' : this.data.activeTab,
        keyword: this.data.searchKeyword
      }

      let list = []

      try {
        const res = await api.redpack.getList(params)
        
        // 适配后端数据结构
        if (res && Array.isArray(res.data)) {
          list = res.data
        } else if (res && res.data && Array.isArray(res.data.list)) {
          list = res.data.list
        } else if (res && res.data && Array.isArray(res.data.items)) {
          list = res.data.items
        }

        // 数据字段映射和格式转换
        list = list.map(item => this.mapBackendDataToFrontend(item))
      } catch (apiError) {
        logger.warn('API 请求失败，使用 Mock 数据:', apiError.message)
      }

      // 如果API返回空或失败，使用模拟数据
      if (list.length === 0) {
        list = this.getFilteredMockData()
      }

      const processedList = list.map(item => ({
        ...item,
        status_text: this.getStatusText(item.status)
      }))

      // 设置页面状态
      const pageStatus = processedList.length > 0 ? 'content' : 'empty'

      this.setData({
        list: processedList,
        loading: false,
        hasMore: false,
        pageStatus
      })

      // 存储到全局变量
      if (list.length > 0) {
        getApp().globalData.redpackActivities = list
      }
    } catch (error) {
      logger.error('加载数据失败:', error)
      this.setData({ 
        loading: false,
        pageStatus: 'error'
      })
    }
  },

  /**
   * 加载更多
   */
  async loadMore() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const params = {
        page: this.data.page + 1,
        limit: config.CONSTANTS.PAGINATION.DEFAULT_LIMIT,
        status: this.data.activeTab === 'all' ? '' : this.data.activeTab,
        keyword: this.data.searchKeyword
      }

      const res = await api.redpack.getList(params)
      const dataList = Array.isArray(res.data) ? res.data : []
      const newList = dataList.map(item => ({
        ...item,
        status_text: this.getStatusText(item.status)
      }))

      this.setData({
        list: [...this.data.list, ...newList],
        page: this.data.page + 1,
        loading: false,
        hasMore: newList.length >= config.CONSTANTS.PAGINATION.DEFAULT_LIMIT
      })
    } catch (error) {
      logger.error('加载更多失败:', error)
      this.setData({ loading: false })
    }
  },

  /**
   * 将后端数据格式映射为前端期望格式
   */
  mapBackendDataToFrontend(backendItem) {
    // 平台 emoji 映射
    const defaultEmojiMap = {
      '腾讯元宝': '🐧',
      '百度文心': '🐻',
      '字节豆包': '🎭',
      '抖音': '🎵',
      '支付宝': '💙',
      '京东': '🛒',
      '拼多多': '🍑',
      '阿里千问': '🤖',
      '快手': '📹',
      '淘宝': '🛍️',
      '微信': '💬'
    }

    // 安全解析JSON字段
    const parseJsonField = (value, defaultValue = []) => {
      if (!value) return defaultValue
      if (typeof value === 'object') return Array.isArray(value) ? value : defaultValue
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed) ? parsed : defaultValue
        } catch (e) {
          return defaultValue
        }
      }
      return defaultValue
    }

    // 状态映射
    let status = 'ended'
    const now = new Date()
    const startTime = new Date(backendItem.start_time || backendItem.startTime)
    const endTime = new Date(backendItem.end_time || backendItem.endTime)

    if (now < startTime) {
      status = 'upcoming'
    } else if (now >= startTime && now <= endTime) {
      status = 'ongoing'
    } else {
      status = 'ended'
    }

    const backendStatus = backendItem.status || 'active'
    if (status === 'ongoing' && backendStatus === 'inactive') {
      status = 'ended'
    }

    // 时间格式转换
    const formatTime = (isoString) => {
      if (!isoString) return ''
      const date = new Date(isoString)
      if (isNaN(date.getTime())) return ''
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${month}-${day} ${hours}:${minutes}`
    }

    const platformName = backendItem.platform || backendItem.platform_name || ''
    const platformEmoji = backendItem.platform_emoji || backendItem.platformEmoji || defaultEmojiMap[platformName] || '🏮'
    const platformIcon = backendItem.platform_icon || backendItem.platformIcon || ''
    const title = backendItem.title || ''
    const description = backendItem.description || ''
    const maxReward = backendItem.max_reward || backendItem.maxReward || this.extractMaxReward(description)

    let tags = parseJsonField(backendItem.tags || backendItem.tags, [])
    if (tags.length === 0) {
      if (description.includes('AI')) tags.push('AI互动')
      if (description.includes('现金') || description.includes('红包')) tags.push('现金红包')
      if (description.includes('集') || description.includes('福')) tags.push('集卡')
      if (description.includes('券') || description.includes('满减')) tags.push('优惠券')
    }
    if (tags.length === 0) tags = ['春节活动']

    const steps = parseJsonField(backendItem.steps || backendItem.steps, [])
    const parsedSteps = steps.length > 0 ? steps : this.extractSteps(backendItem.rules || description)

    const tips = parseJsonField(backendItem.tips || backendItem.tips, [])
    const parsedTips = tips.length > 0 ? tips : this.extractTips(backendItem.rules || description)

    const totalBonus = backendItem.total_bonus || backendItem.totalBonus || ''
    const participation = backendItem.participation || backendItem.participation || '全民参与'
    const rules = backendItem.rules || description

    return {
      id: backendItem.id,
      platform_name: platformName,
      platform_icon: platformIcon,
      platform_emoji: platformEmoji,
      title: title,
      description: description,
      status: status,
      start_time: formatTime(backendItem.start_time || backendItem.startTime),
      end_time: formatTime(backendItem.end_time || backendItem.endTime),
      start_timestamp: new Date(backendItem.start_time || backendItem.startTime).getTime(),
      end_timestamp: new Date(backendItem.end_time || backendItem.endTime).getTime(),
      max_reward: maxReward,
      tags: tags,
      detail: {
        total_bonus: totalBonus,
        participation: participation,
        rules: rules,
        steps: parsedSteps,
        tips: parsedTips
      }
    }
  },

  /**
   * 从描述中提取最大奖励
   */
  extractMaxReward(description) {
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(亿元|亿)/,
      /(\d+(?:\.\d+)?)\s*(万元|万)/,
      /(\d+(?:\.\d+)?)\s*元/
    ]

    for (const pattern of patterns) {
      const match = description.match(pattern)
      if (match) {
        return match[0]
      }
    }

    return '现金红包'
  },

  /**
   * 从规则中提取步骤
   */
  extractSteps(rules) {
    if (!rules) return []
    const lines = rules.split('\n').filter(line => line.trim())
    return lines.slice(0, 6).map(line => line.replace(/^\d+\.\s*/, '').trim())
  },

  /**
   * 从规则中提取技巧
   */
  extractTips(rules) {
    if (!rules) return []
    const tips = []
    if (rules.includes('每日')) tips.push('每日参与可获得更多奖励')
    if (rules.includes('分享') || rules.includes('邀请')) tips.push('分享给好友增加奖励')
    if (rules.includes('签到')) tips.push('记得每日签到')
    return tips.length > 0 ? tips : ['按时参与，不要错过']
  },

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'ongoing': '进行中',
      'upcoming': '即将开始',
      'ended': '已结束'
    }
    return statusMap[status] || '未知'
  },

  /**
   * 搜索输入（带防抖）
   */
  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })

    if (this._searchTimer) {
      clearTimeout(this._searchTimer)
    }

    if (!keyword.trim()) {
      this.setData({ page: 1, hasMore: true })
      this.loadData()
      return
    }

    this._searchTimer = setTimeout(() => {
      this.setData({ page: 1, hasMore: true })
      this.loadData()
    }, 500)
  },

  /**
   * 搜索（确认键触发）
   */
  onSearch() {
    if (this._searchTimer) {
      clearTimeout(this._searchTimer)
      this._searchTimer = null
    }

    this.setData({
      page: 1,
      hasMore: true
    })
    this.loadData()
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      page: 1,
      hasMore: true
    })
    this.loadData()
  },

  /**
   * 切换标签
   */
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab

    this.setData({
      activeTab: tab,
      page: 1,
      hasMore: true
    })
    this.loadData()
  },

  /**
   * 跳转详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/redpack/detail/index?id=${id}`
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '春节红包活动攻略',
      path: '/pages/redpack/list/index'
    }
  },

  /**
   * 获取带筛选的 Mock 数据
   */
  getFilteredMockData() {
    let list = this.getMockData()

    if (this.data.activeTab !== 'all') {
      list = list.filter(item => item.status === this.data.activeTab)
    }

    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase()
      list = list.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        item.platform_name.toLowerCase().includes(keyword)
      )
    }

    return list
  },

  /**
   * 模拟数据（API 失败时使用）
   */
  getMockData() {
    // 使用缓存避免重复创建
    if (MOCK_DATA_CACHE) {
      return MOCK_DATA_CACHE
    }

    MOCK_DATA_CACHE = [
      {
        id: 1,
        platform_name: '腾讯元宝',
        platform_icon: '/images/platform-wechat.png',
        platform_emoji: '🐧',
        title: '春节10亿现金红包',
        description: '10亿元现金红包大派送，单个红包最高可达1万元！AI助手新年福利',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '02-01 00:00',
        end_time: '02-17 23:59',
        max_reward: '10000元',
        tags: ['AI助手', '现金红包', '万元大奖'],
        detail: {
          total_bonus: '10亿元',
          participation: '全民参与',
          rules: '下载腾讯元宝APP，搜索"春节红包"参与活动',
          steps: ['下载腾讯元宝APP', '搜索"春节红包"', '完成AI对话任务', '邀请好友助力', '领取红包'],
          tips: ['每日对话都有机会获得红包', '邀请好友可以增加奖励']
        }
      },
      {
        id: 2,
        platform_name: '百度文心',
        platform_icon: '/images/platform-baidu.png',
        platform_emoji: '🐻',
        title: '春节5亿红包',
        description: '体验"人生游戏"，瓜分5亿元现金红包，搜索"春节红包"即可参与',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-26 00:00',
        end_time: '03-12 23:59',
        max_reward: '8888元',
        tags: ['AI互动', '游戏玩法', '长期活动'],
        detail: {
          total_bonus: '5亿元',
          participation: '全民参与',
          rules: '打开百度APP搜索"春节红包"，体验人生游戏',
          steps: ['打开百度APP', '搜索"春节红包"', '体验人生游戏', '分享好友增加机会'],
          tips: ['活动持续到3月12日', '每天都可以参与']
        }
      },
      {
        id: 3,
        platform_name: '字节豆包',
        platform_icon: '/images/platform-doubao.png',
        platform_emoji: '🎭',
        title: '央视春晚互动',
        description: '2026央视春晚独家互动合作伙伴，春晚期间参与互动赢好礼',
        status: 'upcoming',
        status_text: '即将开始',
        start_time: '02-09 20:00',
        end_time: '02-10 00:30',
        max_reward: '神秘大奖',
        tags: ['春晚互动', 'AI体验', '独家合作'],
        detail: {
          total_bonus: '神秘大奖',
          participation: '春晚观众',
          rules: '春晚期间打开豆包APP参与互动',
          steps: ['下载豆包APP', '春晚期间打开APP', '参与节目竞猜', '与AI互动聊天'],
          tips: ['2月9日春晚8点开始', '需提前下载APP']
        }
      },
      {
        id: 4,
        platform_name: '支付宝',
        platform_icon: '/images/platform-alipay.png',
        platform_emoji: '💙',
        title: '2026马年集五福',
        description: '早鸟活动已开启，搜索"集福啦"领3张福卡套装必含稀有卡',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-27 00:00',
        end_time: '02-16 23:59',
        max_reward: '666元',
        tags: ['集卡', 'AR扫福', '瓜分奖金'],
        detail: {
          total_bonus: '5亿元',
          participation: '数亿人参与',
          rules: 'AR扫福、森林浇水、蚂蚁庄园等方式集福卡',
          steps: ['打开支付宝', '搜索"集福啦"', 'AR扫描福字', '完成每日任务'],
          tips: ['早鸟活动必参与', '每天都可以扫福字']
        }
      },
      {
        id: 5,
        platform_name: '京东',
        platform_icon: '/images/platform-jd.png',
        platform_emoji: '🛒',
        title: '春节红包口令',
        description: '输入红包口令"福利500"或"红包500"，领取满减优惠券',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-25 00:00',
        end_time: '02-23 23:59',
        max_reward: '满减券',
        tags: ['口令红包', '满减优惠', '购物福利'],
        detail: {
          total_bonus: '亿级优惠券',
          participation: '京东用户',
          rules: '打开京东APP搜索"福利500"领取红包',
          steps: ['打开京东APP', '搜索"福利500"', '点击领取红包', '购物时使用'],
          tips: ['每天都可以搜索领取', '注意优惠券有效期']
        }
      },
      {
        id: 6,
        platform_name: '拼多多',
        platform_icon: '/images/platform-pinduoduo.png',
        platform_emoji: '🍑',
        title: '春节不打烊',
        description: '2月7日-24日活动，188大促券、三单挑战、砸金蛋、整点抢券',
        status: 'upcoming',
        status_text: '即将开始',
        start_time: '02-07 00:00',
        end_time: '02-24 23:59',
        max_reward: '满100减50',
        tags: ['不打烊', '满减优惠', '互动游戏'],
        detail: {
          total_bonus: '百亿补贴',
          participation: '拼多多用户',
          rules: '进入"买年货"专区领券购物',
          steps: ['打开拼多多APP', '进入"买年货"专区', '领188大促券', '参与砸金蛋'],
          tips: ['2月7日活动开始', '记得先领券再购物']
        }
      }
    ]

    return MOCK_DATA_CACHE
  }
})
