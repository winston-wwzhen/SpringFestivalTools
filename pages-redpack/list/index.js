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
   * 模拟数据（API 失败时使用）
   */
  getMockData() {
    return [
      {
        id: 1,
        platform_name: '微信',
        platform_icon: '/images/platform-wechat.png',
        title: '2026春节集五福活动',
        description: '集齐五福卡，瓜分5亿现金红包，每天可获得多张福卡',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-20 00:00',
        end_time: '01-27 23:59',
        max_reward: '666元',
        tags: ['集卡', '瓜分奖金', '每日任务']
      },
      {
        id: 2,
        platform_name: '支付宝',
        platform_icon: '/images/platform-alipay.png',
        title: '支付宝集五福',
        description: 'AR扫福、森林浇水、蚂蚁庄园等多种方式集福卡',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-18 00:00',
        end_time: '01-27 23:59',
        max_reward: '888元',
        tags: ['AR扫福', '集卡', '互动玩法']
      },
      {
        id: 3,
        platform_name: '抖音',
        platform_icon: '/images/platform-douyin.png',
        title: '抖音春节红包',
        description: '看直播、刷视频、做任务，轻松领红包',
        status: 'upcoming',
        status_text: '即将开始',
        start_time: '01-25 00:00',
        end_time: '02-05 23:59',
        max_reward: '2026元',
        tags: ['视频红包', '直播间互动']
      },
      {
        id: 4,
        platform_name: '快手',
        platform_icon: '/images/platform-kuaishou.png',
        title: '快手团圆红包',
        description: '集卡分现金、看直播领红包、邀请好友得奖励',
        status: 'ongoing',
        status_text: '进行中',
        start_time: '01-15 00:00',
        end_time: '01-31 23:59',
        max_reward: '520元',
        tags: ['集卡', '直播互动', '好友邀请']
      },
      {
        id: 5,
        platform_name: '百度',
        platform_icon: '/images/platform-baidu.png',
        title: '百度好运中国年',
        description: '集卡、抽奖、签到多种玩法，总奖金超10亿',
        status: 'ended',
        status_text: '已结束',
        start_time: '01-10 00:00',
        end_time: '01-20 23:59',
        max_reward: '10000元',
        tags: ['集卡', '抽奖']
      }
    ]
  }
})