// utils/request.js - 网络请求封装
const app = getApp()

/**
 * 统一请求方法
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {} } = options

    // 获取token
    const token = wx.getStorageSync('token') || ''

    wx.request({
      url: app.globalData.serverUrl + url,
      method,
      data,
      header: {
        'content-type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 业务成功 - 支持 code: 0 或 success: true 两种格式
          if (res.data.code === 0 || res.data.success === true) {
            resolve(res.data)
          } else {
            // 业务失败
            showError(res.data.message || '请求失败')
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // 未授权，需要登录
          handleUnauthorized()
          reject(res)
        } else {
          // 其他错误
          showError(`请求失败: ${res.statusCode}`)
          reject(res)
        }
      },
      fail: (err) => {
        showError('网络错误，请检查网络连接')
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 */
function get(url, data = {}) {
  return request({
    url,
    method: 'GET',
    data
  })
}

/**
 * POST 请求
 */
function post(url, data = {}) {
  return request({
    url,
    method: 'POST',
    data
  })
}

/**
 * PUT 请求
 */
function put(url, data = {}) {
  return request({
    url,
    method: 'PUT',
    data
  })
}

/**
 * DELETE 请求
 */
function del(url, data = {}) {
  return request({
    url,
    method: 'DELETE',
    data
  })
}

/**
 * 显示错误提示
 */
function showError(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 处理未授权
 */
function handleUnauthorized() {
  // 清除token
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')

  // 跳转到登录页（如果需要的话）
  // wx.reLaunch({
  //   url: '/pages/login/index'
  // })
}

module.exports = {
  request,
  get,
  post,
  put,
  delete: del
}
