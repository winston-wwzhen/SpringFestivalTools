// utils/helpers.js - 工具函数

/**
 * 格式化时间
 * @param {Date|String|Number} date 时间
 * @param {String} format 格式
 */
function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = padZero(d.getMonth() + 1)
  const day = padZero(d.getDate())
  const hour = padZero(d.getHours())
  const minute = padZero(d.getMinutes())
  const second = padZero(d.getSeconds())

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 补零
 */
function padZero(num) {
  return num < 10 ? `0${num}` : num
}

/**
 * 格式化相对时间
 * @param {Date|String|Number} date 时间
 */
function formatRelativeTime(date) {
  if (!date) return ''

  const d = new Date(date)
  const now = new Date()
  const diff = now - d

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < day * 2) {
    return '昨天'
  } else if (diff < day * 3) {
    return '前天'
  } else if (diff < day * 7) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatTime(date, 'YYYY-MM-DD')
  }
}

/**
 * 防抖
 * @param {Function} fn 函数
 * @param {Number} delay 延迟
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流
 * @param {Function} fn 函数
 * @param {Number} interval 间隔
 */
function throttle(fn, interval = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 深拷贝
 * @param {Any} obj 对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))

  const clone = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key])
    }
  }
  return clone
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 验证手机号
 * @param {String} phone 手机号
 */
function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 获取图片信息
 * @param {String} src 图片地址
 */
function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 保存图片到相册
 * @param {String} filePath 图片路径
 */
function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        })
        resolve()
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: () => {
              wx.openSetting()
            }
          })
        }
        reject(err)
      }
    })
  })
}

/**
 * 下载图片
 * @param {String} url 图片地址
 */
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error('下载失败'))
        }
      },
      fail: reject
    })
  })
}

/**
 * 设置剪贴板
 * @param {String} data 内容
 */
function setClipboard(data) {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
        resolve()
      },
      fail: reject
    })
  })
}

/**
 * 显示加载
 * @param {String} title 标题
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示提示
 * @param {String} title 标题
 * @param {String} icon 图标
 */
function showToast(title, icon = 'none') {
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

/**
 * 显示确认
 * @param {Object} options 选项
 */
function showConfirm(options) {
  return new Promise((resolve) => {
    wx.showModal({
      title: options.title || '提示',
      content: options.content || '',
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 页面跳转（封装）
 * @param {String} url 地址
 */
function navigateTo(url) {
  wx.navigateTo({
    url,
    fail: () => {
      // 跳转失败，可能是页面层级过多，尝试使用 redirectTo
      wx.redirectTo({ url })
    }
  })
}

module.exports = {
  formatTime,
  formatRelativeTime,
  padZero,
  debounce,
  throttle,
  deepClone,
  generateId,
  validatePhone,
  getImageInfo,
  saveImageToPhotosAlbum,
  downloadImage,
  setClipboard,
  showLoading,
  hideLoading,
  showToast,
  showConfirm,
  navigateTo
}
