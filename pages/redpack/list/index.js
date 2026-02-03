// pages/redpack/list/index.js
const api = require('../../../api/index')

Page({
  data: {
    list: [],
    loading: false,
    searchKeyword: '',
    activeTab: 'all',
    page: 1,
    hasMore: true
  },

  onLoad(options) {
    console.log('[RedpackList] onLoad triggered')
    this.loadData()
  },

  onShow() {
    console.log('[RedpackList] onShow triggered')
  },

  onReady() {
    console.log('[RedpackList] onReady triggered')
  },

  onHide() {
    console.log('[RedpackList] onHide triggered')
  },

  onUnload() {
    console.log('[RedpackList] onUnload triggered')
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
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

    this.setData({ loading: true })

    try {
      const params = {
        page: 1,
        limit: 20,
        status: this.data.activeTab === 'all' ? '' : this.data.activeTab,
        keyword: this.data.searchKeyword
      }

      console.log('[RedpackList] Loading data with params:', params)
      let list = []

      try {
        const res = await api.redpack.getList(params)
        console.log('[RedpackList] Data loaded:', res)
        console.log('[RedpackList] res.data type:', typeof res.data)
        console.log('[RedpackList] res.data:', JSON.stringify(res.data))

        // 适配后端数据结构：可能是 res.data 直接是数组，或 res.data.list 是数组
        if (res && Array.isArray(res.data)) {
          list = res.data
          console.log('[RedpackList] Using res.data as array, length:', list.length)
        } else if (res && res.data && Array.isArray(res.data.list)) {
          list = res.data.list
          console.log('[RedpackList] Using res.data.list as array, length:', list.length)
        } else if (res && res.data && Array.isArray(res.data.items)) {
          list = res.data.items
          console.log('[RedpackList] Using res.data.items as array, length:', list.length)
        } else {
          console.log('[RedpackList] No array found in response, will use mock data')
        }

        // 数据字段映射和格式转换
        list = list.map(item => this.mapBackendDataToFrontend(item))
      } catch (apiError) {
        console.warn('[RedpackList] API request failed, will use mock data:', apiError)
      }

      // 如果API返回空或失败，使用模拟数据
      if (list.length === 0) {
        console.log('[RedpackList] Using mock data')
        let mockList = this.getMockData()

        // 模拟后端筛选逻辑
        if (this.data.activeTab !== 'all') {
          mockList = mockList.filter(item => item.status === this.data.activeTab)
        }

        if (this.data.searchKeyword) {
          const keyword = this.data.searchKeyword.toLowerCase()
          mockList = mockList.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            item.platform_name.toLowerCase().includes(keyword)
          )
        }

        list = mockList
      }

      const processedList = list.map(item => ({
        ...item,
        status_text: this.getStatusText(item.status)
      }))

      this.setData({
        list: processedList,
        loading: false,
        hasMore: false // 模拟数据暂时无需分页
      })

      // 存储到全局变量
      if (list.length > 0) {
        getApp().globalData.redpackActivities = list
      }
    } catch (error) {
      console.error('[RedpackList] Load data critical error:', error)
      this.setData({ loading: false })
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
        limit: 20,
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
        hasMore: newList.length >= 20
      })
    } catch (error) {
      console.error('[RedpackList] Load more failed:', error)
      this.setData({ loading: false })
    }
  },

  /**
   * 将后端数据格式映射为前端期望格式
   */
  mapBackendDataToFrontend(backendItem) {
    // 平台 emoji 映射（如果后端没有提供）
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
          console.warn('[JSON解析失败]', e.message)
          return defaultValue
        }
      }
      return defaultValue
    }

    // 状态映射：根据实际时间和后端状态综合判断
    let status = 'ended'
    const now = new Date()
    const startTime = new Date(backendItem.start_time || backendItem.startTime)
    const endTime = new Date(backendItem.end_time || backendItem.endTime)

    // 优先根据实际时间判断
    if (now < startTime) {
      status = 'upcoming'
    } else if (now >= startTime && now <= endTime) {
      status = 'ongoing'
    } else {
      status = 'ended'
    }

    // 如果后端标记为 inactive 且时间上应该是 ongoing，则根据后端状态调整为 ended
    const backendStatus = backendItem.status || 'active'
    if (status === 'ongoing' && backendStatus === 'inactive') {
      status = 'ended'
    }

    // 时间格式转换: ISO -> MM-DD HH:mm
    const formatTime = (isoString) => {
      if (!isoString) ''
      const date = new Date(isoString)
      if (isNaN(date.getTime())) return ''
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${month}-${day} ${hours}:${minutes}`
    }

    // 获取平台名称
    const platformName = backendItem.platform || backendItem.platform_name || ''

    // 获取平台 emoji（优先使用后端数据）
    const platformEmoji = backendItem.platform_emoji || backendItem.platformEmoji || defaultEmojiMap[platformName] || '🏮'

    // 获取平台图标
    const platformIcon = backendItem.platform_icon || backendItem.platformIcon || ''

    // 获取标题
    const title = backendItem.title || ''

    // 获取描述
    const description = backendItem.description || ''

    // 获取最大奖励
    const maxReward = backendItem.max_reward || backendItem.maxReward || this.extractMaxReward(description)

    // 获取标签（优先使用后端数据，否则从描述提取）
    let tags = parseJsonField(backendItem.tags || backendItem.tags, [])
    if (tags.length === 0) {
      // 从 description 提取标签
      if (description.includes('AI')) tags.push('AI互动')
      if (description.includes('现金') || description.includes('红包')) tags.push('现金红包')
      if (description.includes('集') || description.includes('福')) tags.push('集卡')
      if (description.includes('券') || description.includes('满减')) tags.push('优惠券')
    }
    if (tags.length === 0) tags = ['春节活动']

    // 获取步骤
    const steps = parseJsonField(backendItem.steps || backendItem.steps, [])
    const parsedSteps = steps.length > 0 ? steps : this.extractSteps(backendItem.rules || description)

    // 获取技巧
    const tips = parseJsonField(backendItem.tips || backendItem.tips, [])
    const parsedTips = tips.length > 0 ? tips : this.extractTips(backendItem.rules || description)

    // 获取总奖金
    const totalBonus = backendItem.total_bonus || backendItem.totalBonus || ''

    // 获取参与方式
    const participation = backendItem.participation || backendItem.participation || '全民参与'

    // 获取规则
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
      // 保留原始时间戳供详情页倒计时使用
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
    // 匹配金额数字，如 "10亿元"、"5亿"、"万元"、"10000元"等
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
    // 按行分割，过滤空行
    const lines = rules.split('\n').filter(line => line.trim())
    // 只取前6条作为步骤
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
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },

  /**
   * 搜索
   */
  onSearch() {
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
    console.log('[RedpackList] Tab changed to:', tab)

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
    console.log('[RedpackList] Go to detail, id:', id)
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
   * 模拟数据（API 失败时使用）- 2026年真实活动数据（含详情）
   */
  getMockData() {
    return [
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
          rules: `
【腾讯元宝春节玩法】
1. 下载/打开腾讯元宝APP
2. 搜索"春节红包"进入活动页面
3. 完成AI对话任务获取红包机会
4. 邀请好友助力增加红包金额
5. 每日签到累计奖励

【红包等级】
• 普通红包：1-10元
• 幸运红包：10-100元
• 超级红包：100-1000元
• 万元大奖：10000元（极低概率）

【活动特色】
• AI对话互动，体验智能助手
• 无门槛参与，人人有份
• 可提现至微信零钱
          `,
          steps: [
            '第一步：下载腾讯元宝APP',
            '第二步：注册/登录账号',
            '第三步：搜索"春节红包"进入活动',
            '第四步：与AI对话完成任务',
            '第五步：邀请好友助力',
            '第六步：领取红包并提现'
          ],
          tips: [
            '每日对话都有机会获得红包',
            '邀请好友可以增加奖励',
            '红包直接到账，可提现',
            '活动持续到2月17日'
          ]
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
          rules: `
【百度春节红包玩法】
1. 打开百度APP搜索"春节红包"
2. 体验"人生游戏"AI互动
3. 根据游戏结果获得不同红包
4. 分享给好友增加机会
5. 累计参与次数提升奖励

【游戏特色】
• AI生成个性化人生剧本
• 互动式体验新颖有趣
• 红包金额随机分配
• 活动周期长，参与机会多

【红包等级】
• 基础红包：1-5元
• 幸运红包：5-50元
• 稀有红包：50-500元
• 超级大奖：最高8888元
          `,
          steps: [
            '第一步：打开百度APP',
            '第二步：搜索"春节红包"',
            '第三步：点击进入"人生游戏"',
            '第四步：体验AI互动游戏',
            '第五步：根据结果领取红包',
            '第六步：分享好友再玩一次'
          ],
          tips: [
            '活动持续到3月12日',
            '每天都可以参与',
            '分享好友可以额外获得机会',
            '游戏结果随机，红包不固定'
          ]
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
          rules: `
【豆包春晚互动玩法】
1. 下载/打开豆包APP
2. 春晚期间打开APP进入互动页面
3. 根据春晚节目内容参与互动
4. 实时抽奖赢取大奖
5. AI聊天互动获取福利

【互动方式】
• 节目竞猜：猜节目内容赢奖励
• AI聊天：与豆包对话得红包
• 幸运抽奖：整点抽奖活动
• 分享有礼：分享增加机会

【特色】
• 央视春晚独家合作
• AI互动体验
• 实时开奖
          `,
          steps: [
            '第一步：下载豆包APP',
            '第二步：春晚期间打开APP',
            '第三步：进入春晚互动页面',
            '第四步：参与节目竞猜',
            '第五步：与AI互动聊天',
            '第六步：等待实时开奖'
          ],
          tips: [
            '2月9日春晚8点开始',
            '需提前下载APP',
            '互动及时效性很强',
            '建议全程参与互动'
          ]
        }
      },
      {
        id: 4,
        platform_name: '支付宝',
        platform_icon: '/images/platform-alipay.png',
        platform_emoji: '💙',
        title: '2026马年集五福',
        description: '早鸟活动已开启，搜索"集福啦"领3张福卡套装必含稀有卡。正式活动2月3日-16日',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-27 00:00',
        end_time: '02-16 23:59',
        max_reward: '666元',
        tags: ['集卡', 'AR扫福', '瓜分奖金'],
        detail: {
          total_bonus: '5亿元',
          participation: '数亿人参与',
          rules: `
【集五福玩法】
1. 扫福字：AR扫任意福字得福卡
2. 沾福气：好友间互相沾福卡
3. 森林浇水：蚂蚁森林浇水得福卡
4. 蚂蚁庄园：喂小鸡得福卡
5. 运动得福：步数兑换福卡

【福卡类型】
• 爱国福 • 富强福 • 和谐福 • 友善福 • 敬业福

【稀有卡】
• 全家福（万能卡，可替代任意福卡）
• 五福福卡（可合成全家福）

【时间节点】
• 早鸟活动：1月27日-2月2日（搜索"集福啦"领3张福卡套装，必有稀有卡）
• 正式活动：2月3日-2月16日
• 除夕开奖：2月16日晚上

【获奖技巧】
1. 每日完成所有任务获取福卡
2. 多扫不同风格的福字
3. 与好友互相沾福气
4. 加入支付宝群获取额外福卡
          `,
          steps: [
            '第一步：打开支付宝APP，搜索"集福啦"',
            '第二步：领取早鸟福卡套装（3张，必有稀有卡）',
            '第三步：AR扫描福字收集福卡',
            '第四步：完成每日任务（浇水、喂鸡等）',
            '第五步：与好友互相沾福气',
            '第六步：集齐五福，等待除夕开奖'
          ],
          tips: [
            '早鸟活动必参与，可获得稀有卡',
            '每天都可以扫福字，建议多扫不同风格',
            '蚂蚁森林和蚂蚁庄园每天都有机会',
            '邀请更多好友增加沾福气机会'
          ]
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
          rules: `
【京东春节红包玩法】
1. 打开京东APP搜索"福利500"或"红包500"
2. 领取红包优惠券
3. 购物时自动抵扣
4. 每日可领多次
5. 分享好友获得额外红包

【优惠券类型】
• 满减券：满199减10、满399减20等
• 品类券：特定商品满减
• 店铺券：店铺专属优惠
• 免邮券：免运费券

【使用规则】
• 有使用门槛
• 有效期内使用
• 部分商品不可用
          `,
          steps: [
            '第一步：打开京东APP',
            '第二步：搜索框输入"福利500"',
            '第三步：点击搜索领取红包',
            '第四步：查看可用优惠券',
            '第五步：购物时选择使用',
            '第六步：结算时自动抵扣'
          ],
          tips: [
            '每天都可以搜索领取',
            '注意优惠券有效期',
            '部分商品不支持使用',
            '分享好友可以获得更多'
          ]
        }
      },
      {
        id: 7,
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
          rules: `
【拼多多春节不打烊玩法】
1. 188大促券：满100减50等大额券
2. 三单挑战：完成三单得奖励
3. 砸金蛋：赢取现金红包
4. 整点抢券：限时抢大额券
5. 跨店满减：多店购买更优惠

【活动时间】
• 2月7日-2月24日
• 部分活动限时开放

【优惠券】
• 最高满100减50
• 可与秒杀价叠加
• 无品牌限制
          `,
          steps: [
            '第一步：打开拼多多APP',
            '第二步：进入"买年货"专区',
            '第三步：领188大促券',
            '第四步：参与砸金蛋',
            '第五步：完成三单挑战',
            '第六步：整点抢大额券'
          ],
          tips: [
            '2月7日活动开始',
            '记得先领券再购物',
            '整点抢券手速要快',
            '三单挑战奖励丰富'
          ]
        }
      }
    ]
  }
})