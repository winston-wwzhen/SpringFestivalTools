// pages/emoticon/categories/index.js
Page({
  data: {
    categories: [
      {
        id: 1,
        name: '拜年祝福',
        description: '新年快乐、万事如意',
        cover: '/images/emoticon-newyear.png',
        count: 24
      },
      {
        id: 2,
        name: '马到成功',
        description: '马年专属吉祥话',
        cover: '/images/emoticon-horse.png',
        count: 18
      },
      {
        id: 3,
        name: '搞笑幽默',
        description: '逗趣表情包',
        cover: '/images/emoticon-funny.png',
        count: 32
      },
      {
        id: 4,
        name: '可爱萌宠',
        description: '小动物拜年',
        cover: '/images/emoticon-cute.png',
        count: 28
      },
      {
        id: 5,
        name: '传统年画',
        description: '国风年画表情',
        cover: '/images/emoticon-traditional.png',
        count: 16
      },
      {
        id: 6,
        name: '红包祝福',
        description: '恭喜发财表情包',
        cover: '/images/emoticon-redpack.png',
        count: 20
      }
    ],
    hotEmoticons: [
      { id: 1, title: '马年大吉', url: '/images/emoticon-hot-1.png' },
      { id: 2, title: '恭喜发财', url: '/images/emoticon-hot-2.png' },
      { id: 3, title: '新年快乐', url: '/images/emoticon-hot-3.png' },
      { id: 4, title: '万事如意', url: '/images/emoticon-hot-4.png' }
    ]
  },

  onLoad(options) {
    console.log('[EmoticonCategories] onLoad triggered')
  },

  onShow() {
    console.log('[EmoticonCategories] onShow triggered')
  },

  onReady() {
    console.log('[EmoticonCategories] onReady triggered')
  },

  onHide() {
    console.log('[EmoticonCategories] onHide triggered')
  },

  onUnload() {
    console.log('[EmoticonCategories] onUnload triggered')
  },

  /**
   * 跳转图库
   */
  goToGallery(e) {
    const id = e.currentTarget.dataset.id
    console.log('[EmoticonCategories] Go to gallery, categoryId:', id)
    wx.navigateTo({
      url: `/pages/emoticon/gallery/index?categoryId=${id}`
    })
  },

  /**
   * 预览表情包
   */
  previewEmoticon(e) {
    const url = e.currentTarget.dataset.url
    console.log('[EmoticonCategories] Preview emoticon:', url)
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '马年表情包大全',
      path: '/pages/emoticon/categories/index'
    }
  }
})