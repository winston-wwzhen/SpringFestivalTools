// components/nav-bar/nav-bar.js
const app = getApp()

Component({
  properties: {
    title: {
      type: String,
      value: '春节攻略'
    },
    bgColor: {
      type: String,
      value: '#E63946'
    },
    showBack: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    totalHeight: 0
  },

  lifetimes: {
    attached() {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync()
      const statusBarHeight = systemInfo.statusBarHeight

      // 计算导航栏高度（默认44px，自定义时可以增加到60px）
      const navBarHeight = 60

      this.setData({
        statusBarHeight,
        navBarHeight,
        totalHeight: statusBarHeight + navBarHeight
      })
    }
  },

  methods: {
    onBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack()
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }
})
