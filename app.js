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
   * 获取春节日期（农历正月初一）
   * 春节日期表（2025-2035）
   * 注：精确的农历转换需要专门的算法库，这里使用预存日期表
   */
  getSpringFestivalDate(year) {
    // 春节日期表（农历正月初一对应的公历日期）
    const springFestivalDates = {
      2025: '2025-01-29', // 乙巳年正月初一
      2026: '2026-02-17', // 丙午年正月初一
      2027: '2027-02-06', // 丁未年正月初一
      2028: '2028-01-26', // 戊申年正月初一
      2029: '2029-02-13', // 己酉年正月初一
      2030: '2030-02-03', // 庚戌年正月初一
      2031: '2031-01-23', // 辛亥年正月初一
      2032: '2032-02-11', // 壬子年正月初一
      2033: '2033-01-31', // 癸丑年正月初一
      2034: '2034-02-19', // 甲寅年正月初一
      2035: '2035-02-08'  // 乙卯年正月初一
    }

    // 如果年份超出范围，使用近似算法估算（春节一般在1月21日-2月20日之间）
    if (!springFestivalDates[year]) {
      // 简单估算：春节日期每年大约前移11天或后移19天（农历与公历的差值）
      // 这里使用保守估算，设在2月初
      const baseDate = new Date('2026-02-17')
      const yearDiff = year - 2026
      // 农历比公历短约11天，19年一个周期
      const cycleOffset = (yearDiff % 19) * 11 - Math.floor((yearDiff % 19) / 2) * 30
      const estimatedDate = new Date(baseDate.getTime() + cycleOffset * 24 * 60 * 60 * 1000)
      console.warn(`春节日期未预存，使用估算日期: ${estimatedDate.toISOString().split('T')[0]}，年份: ${year}`)
      return estimatedDate
    }

    return new Date(springFestivalDates[year])
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
