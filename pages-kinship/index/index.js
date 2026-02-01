// pages-kinship/index/index.js
Page({
  data: {
    commonRelations: [
      { id: 1, icon: '👨', name: '爸爸', description: '父亲的称呼' },
      { id: 2, icon: '👩', name: '妈妈', description: '母亲的称呼' },
      { id: 3, icon: '👴', name: '爷爷', description: '父亲的父亲' },
      { id: 4, icon: '👵', name: '奶奶', description: '父亲的母亲' },
      { id: 5, icon: '👨‍🦳', name: '外公', description: '母亲的父亲' },
      { id: 6, icon: '👩‍🦳', name: '外婆', description: '母亲的母亲' }
    ],
    hotSearch: [
      '表哥', '堂弟', '舅妈', '姑父', '姨夫', '婶婶', '嫂子', '弟妹'
    ]
  },

  onLoad(options) {
    console.log('[KinshipIndex] onLoad triggered')
  },

  onShow() {
    console.log('[KinshipIndex] onShow triggered')
  },

  onReady() {
    console.log('[KinshipIndex] onReady triggered')
  },

  onHide() {
    console.log('[KinshipIndex] onHide triggered')
  },

  onUnload() {
    console.log('[KinshipIndex] onUnload triggered')
  },

  /**
   * 跳转计算器
   */
  goToCalculator() {
    console.log('[KinshipIndex] Go to calculator')
    wx.navigateTo({
      url: '/pages-kinship/calculator/index'
    })
  },

  /**
   * 跳转关系图
   */
  goToChart() {
    console.log('[KinshipIndex] Go to chart')
    wx.navigateTo({
      url: '/pages-kinship/chart/index'
    })
  },

  /**
   * 显示详情
   */
  showDetail(e) {
    const item = e.currentTarget.dataset.item
    console.log('[KinshipIndex] Show detail:', item)
    wx.showToast({
      title: item.name,
      icon: 'none'
    })
  },

  /**
   * 搜索称呼
   */
  searchRelation(e) {
    const keyword = e.currentTarget.dataset.keyword
    console.log('[KinshipIndex] Search relation:', keyword)
    wx.navigateTo({
      url: `/pages-kinship/calculator/index?keyword=${keyword}`
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '亲戚称呼计算器',
      path: '/pages-kinship/index/index'
    }
  }
})