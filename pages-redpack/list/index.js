// pages-redpack/list/index.js
const api = require('../../api/index')

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
      const res = await api.redpack.getList(params)
      console.log('[RedpackList] Data loaded:', res)

      const list = (res.data || []).map(item => ({
        ...item,
        status_text: this.getStatusText(item.status)
      }))

      this.setData({
        list,
        loading: false,
        hasMore: list.length >= 20
      })
    } catch (error) {
      console.error('[RedpackList] Load data failed:', error)
      // 使用模拟数据
      this.setData({
        list: this.getMockData(),
        loading: false
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
        limit: 20,
        status: this.data.activeTab === 'all' ? '' : this.data.activeTab,
        keyword: this.data.searchKeyword
      }

      const res = await api.redpack.getList(params)
      const newList = (res.data || []).map(item => ({
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
      url: `/pages-redpack/detail/index?id=${id}`
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '春节红包活动攻略',
      path: '/pages-redpack/list/index'
    }
  },

  /**
   * 模拟数据（API 失败时使用）- 2026年真实活动数据
   */
  getMockData() {
    return [
      {
        id: 1,
        platform_name: '支付宝',
        platform_icon: '/images/platform-alipay.png',
        title: '2026马年集五福',
        description: '早鸟活动已开启，搜索"集福啦"领3张福卡套装必含稀有卡。正式活动2月3日-16日，瓜分现金红包',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-27 00:00',
        end_time: '02-16 23:59',
        max_reward: '666元',
        tags: ['集卡', 'AR扫福', '瓜分奖金']
      },
      {
        id: 2,
        platform_name: '腾讯元宝',
        platform_icon: '/images/platform-tencent.png',
        title: '春节10亿现金红包',
        description: '10亿元现金红包大派送，单个红包最高可达1万元！AI助手新年福利',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '02-01 00:00',
        end_time: '02-17 23:59',
        max_reward: '10000元',
        tags: ['AI助手', '现金红包', '万元大奖']
      },
      {
        id: 3,
        platform_name: '百度文心',
        platform_icon: '/images/platform-baidu.png',
        title: '春节5亿红包',
        description: '体验"人生游戏"，瓜分5亿元现金红包，搜索"春节红包"即可参与',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-26 00:00',
        end_time: '03-12 23:59',
        max_reward: '8888元',
        tags: ['AI互动', '游戏玩法', '长期活动']
      },
      {
        id: 4,
        platform_name: '字节豆包',
        platform_icon: '/images/platform-doubao.png',
        title: '央视春晚互动',
        description: '2026央视春晚独家互动合作伙伴，春晚期间参与互动赢好礼',
        status: 'upcoming',
        status_text: '即将开始',
        start_time: '02-09 20:00',
        end_time: '02-10 00:30',
        max_reward: '神秘大奖',
        tags: ['春晚互动', 'AI体验', '独家合作']
      },
      {
        id: 5,
        platform_name: '京东',
        platform_icon: '/images/platform-jd.png',
        title: '春节红包口令',
        description: '输入红包口令"福利500"或"红包500"，领取满减优惠券，活动持续至2月23日',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-25 00:00',
        end_time: '02-23 23:59',
        max_reward: '满减券',
        tags: ['口令红包', '满减优惠', '购物福利']
      },
      {
        id: 6,
        platform_name: '淘宝/天猫',
        platform_icon: '/images/platform-taobao.png',
        title: '年货节红包',
        description: '搜索口令"天降红包339"或"红包到手1717"领取红包，每日可领',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-20 00:00',
        end_time: '02-05 23:59',
        max_reward: '88元红包',
        tags: ['口令红包', '每日领取', '年货节']
      },
      {
        id: 7,
        platform_name: '拼多多',
        platform_icon: '/images/platform-pdd.png',
        title: '春节不打烊',
        description: '2月7日-24日活动，188大促券、三单挑战、砸金蛋、整点抢券、跨店满减',
        status: 'upcoming',
        status_text: '即将开始',
        start_time: '02-07 00:00',
        end_time: '02-24 23:59',
        max_reward: '满100减50',
        tags: ['不打烊', '满减优惠', '互动游戏']
      },
      {
        id: 8,
        platform_name: '美团',
        platform_icon: '/images/platform-meituan.png',
        title: '外卖闪购红包',
        description: '使用词令APP输入口令"8080"，领取美团外卖和闪购红包',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-20 00:00',
        end_time: '02-10 23:59',
        max_reward: '50元红包',
        tags: ['外卖红包', '闪购', '口令领取']
      },
      {
        id: 9,
        platform_name: '淘宝闪购',
        platform_icon: '/images/platform-taobao.png',
        title: '闪购外卖红包',
        description: '通过草柴APP或词令APP领取，春节期间外卖优惠不断',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-20 00:00',
        end_time: '02-10 23:59',
        max_reward: '30元红包',
        tags: ['外卖', '闪购', '多平台通用']
      }
    ]
  }
})