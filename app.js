// app.js
App({
  globalData: {
    // 服务器配置
    serverUrl: 'http://49.234.120.81/api',
    // 用户信息
    userInfo: null,
    // 春节日期（当年）
    springFestivalDate: null,
    // 倒计时
    countdownDays: 0
  },

  onLaunch() {
    // 小程序启动
    console.log('春节攻略小程序启动')

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo

    // 计算春节倒计时
    this.calculateSpringFestivalCountdown()

    // 检查更新
    this.checkUpdate()

    // 初始化用户信息
    this.initUserInfo()
  },

  onShow() {
    // 小程序显示
  },

  onHide() {
    // 小程序隐藏
  },

  /**
   * 计算春节倒计时
   */
  calculateSpringFestivalCountdown() {
    const now = new Date()
    const year = now.getFullYear()
    // 计算当年春节日期（农历正月初一）
    const springFestival = this.getSpringFestivalDate(year)

    // 如果今年的春节已过，计算明年
    if (now > springFestival) {
      this.globalData.springFestivalDate = this.getSpringFestivalDate(year + 1)
    } else {
      this.globalData.springFestivalDate = springFestival
    }

    const diffTime = this.globalData.springFestivalDate - now
    this.globalData.countdownDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  /**
   * 获取春节日期
   */
  getSpringFestivalDate(year) {
    // 2025年和2026年春节日期
    const dates = {
      2025: '2025-01-29',
      2026: '2026-02-17'
    }
    return new Date(dates[year] || '2026-02-17')
  },

  /**
   * 检查小程序更新
   */
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()

      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('发现新版本')
        }
      })

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(() => {
        wx.showModal({
          title: '更新失败',
          content: '新版本下载失败，请检查网络后重试',
          showCancel: false
        })
      })
    }
  },

  /**
   * 初始化用户信息
   */
  initUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },

  /**
   * 统一的网络请求方法
   */
  request(options) {
    const { url, method = 'GET', data = {}, success, fail, complete } = options

    wx.request({
      url: this.globalData.serverUrl + url,
      method,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          success && success(res.data)
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          })
          fail && fail(res)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        fail && fail(err)
      },
      complete
    })
  }
})
