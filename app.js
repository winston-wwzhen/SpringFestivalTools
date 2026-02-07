// app.js
const logger = require('./utils/logger')
const config = require('./config/index')

App({
  globalData: {
    // 服务器配置（从配置文件读取）
    serverUrl: config.serverUrl,
    // 用户信息
    userInfo: null,
    // 春节日期（当年）
    springFestivalDate: null,
    // 倒计时
    countdownDays: 0,
    // 是否开发环境
    isDev: config.isDev,
    // 网络状态
    networkType: 'unknown',
    isConnected: true
  },

  onLaunch() {
    // 小程序启动
    logger.info('春节攻略小程序启动')

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo

    // 计算春节倒计时
    this.calculateSpringFestivalCountdown()

    // 检查更新
    this.checkUpdate()

    // 初始化用户信息
    this.initUserInfo()

    // 监听网络状态
    this.initNetworkListener()
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
    // 从配置文件读取春节日期
    const dateStr = config.SPRING_FESTIVAL_DATES[year] || config.SPRING_FESTIVAL_DATES[2026]
    return new Date(dateStr)
  },

  /**
   * 检查小程序更新
   */
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()

      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          logger.info('发现新版本')
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
   * 初始化网络状态监听
   */
  initNetworkListener() {
    // 获取当前网络状态
    wx.getNetworkType({
      success: (res) => {
        this.globalData.networkType = res.networkType
        logger.info('当前网络类型:', res.networkType)
      }
    })

    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      this.globalData.isConnected = res.isConnected
      this.globalData.networkType = res.networkType

      if (!res.isConnected) {
        wx.showToast({
          title: '网络已断开，请检查网络设置',
          icon: 'none',
          duration: 2000
        })
        logger.warn('网络已断开')
      } else {
        logger.info('网络已恢复，类型:', res.networkType)
      }
    })
  },

  /**
   * 统一的网络请求方法（兼容旧代码）
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
