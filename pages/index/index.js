// pages/index/index.js
const app = getApp()
const api = require('../../api/index')

Page({
  data: {
    countdownDays: 0,
    redpackCount: 0,
    galaCount: 0,
    emoticonCount: 0,
    dailyItems: [],
    tips: [
      '春节期间，各大平台都会发放红包，记得定时领取哦',
      '拜年时称呼要准确，长辈会更高兴',
      '看春晚的同时，别忘了陪家人聊天',
      '马年要到了，准备好马到成功的祝福了吗'
    ]
  },

  onLoad() {
    this.setData({
      countdownDays: app.globalData.countdownDays
    })
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
      console.error('加载数据失败:', error)
    }
  },

  /**
   * 加载各模块数据量
   */
  async loadCounts() {
    try {
      // 为 count 接口设置 5 秒超时
      const [redpackRes, galaRes, emoticonRes] = await Promise.all([
        api.redpack.getCount().catch(() => ({ count: 6 })),
        api.gala.getCount().catch(() => ({ count: 17 })),
        api.emoticon.getCount().catch(() => ({ count: 138 }))
      ])

      this.setData({
        redpackCount: redpackRes.count || 6,
        galaCount: galaRes.count || 17,
        emoticonCount: emoticonRes.count || 138
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
      // 使用默认值
      this.setData({
        redpackCount: 6,
        galaCount: 17,
        emoticonCount: 138
      })
    }
  },

  /**
   * 加载每日精选
   */
  async loadDailyItems() {
    try {
      const res = await api.common.getDailyRecommend()
      this.setData({
        dailyItems: res.data || []
      })
    } catch (error) {
      console.error('加载精选失败:', error)
      // 使用默认数据
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
    console.log('[Index] goToRedpack called')
    wx.switchTab({
      url: '/pages/redpack/list/index',
      success: () => {
        console.log('[Index] switchTab redpack success')
      },
      fail: (err) => {
        console.error('[Index] switchTab redpack failed:', err)
      }
    })
  },

  /**
   * 跳转到春晚节目单
   */
  goToGala() {
    console.log('[Index] goToGala called')
    wx.switchTab({
      url: '/pages/gala/platforms/index',
      success: () => {
        console.log('[Index] switchTab gala success')
      },
      fail: (err) => {
        console.error('[Index] switchTab gala failed:', err)
      }
    })
  },

  /**
   * 跳转到亲戚称呼
   */
  goToKinship() {
    console.log('[Index] goToKinship called')
    wx.switchTab({
      url: '/pages/kinship/index/index',
      success: () => {
        console.log('[Index] switchTab kinship success')
      },
      fail: (err) => {
        console.error('[Index] switchTab kinship failed:', err)
      }
    })
  },

  /**
   * 跳转到表情包
   */
  goToEmoticon() {
    wx.navigateTo({
      url: '/pages/emoticon/categories/index'
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
  }
})
