// utils/request.js - 网络请求封装
const app = getApp()
const config = require('../config/index')

// 请求缓存存储
const cache = new Map()
// 进行中的请求存储
const pendingRequests = new Map()
// 请求任务存储（用于取消）
const requestTasks = new Map()
// 缓存配置
const CACHE_CONFIG = {
  defaultTTL: config.CONSTANTS.CACHE_TTL.SHORT,
  maxSize: 50
}

/**
 * 生成请求缓存键
 */
function getCacheKey(url, method, data) {
  return `${method}:${url}:${JSON.stringify(data)}`
}

/**
 * 获取缓存数据
 */
function getCache(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }
  // 过期删除
  if (cached) {
    cache.delete(key)
  }
  return null
}

/**
 * 设置缓存数据
 */
function setCache(key, data, ttl = CACHE_CONFIG.defaultTTL) {
  // 缓存满了，删除最早的
  if (cache.size >= CACHE_CONFIG.maxSize) {
    const firstKey = cache.keys().next().value
    cache.delete(firstKey)
  }

  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

/**
 * 清除所有缓存
 */
function clearCache() {
  cache.clear()
}

/**
 * 取消指定请求
 * @param {String} requestId 请求ID
 */
function abortRequest(requestId) {
  const task = requestTasks.get(requestId)
  if (task) {
    task.abort()
    requestTasks.delete(requestId)
  }
}

/**
 * 取消所有请求
 */
function abortAllRequests() {
  requestTasks.forEach(task => {
    try {
      task.abort()
    } catch (e) {
      // 忽略已完成的请求
    }
  })
  requestTasks.clear()
}

/**
 * 统一请求方法
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const { 
      url, 
      method = 'GET', 
      data = {}, 
      header = {}, 
      timeout = config.CONSTANTS.TIMEOUT.DEFAULT, 
      useCache = false, 
      cacheTTL,
      requestId  // 用于取消请求的唯一标识
    } = options

    // 只对 GET 请求启用缓存
    const enableCache = useCache && method === 'GET'

    // 检查缓存
    if (enableCache) {
      const cacheKey = getCacheKey(url, method, data)
      const cachedData = getCache(cacheKey)
      if (cachedData) {
        resolve(cachedData)
        return
      }

      // 检查是否有相同请求正在进行
      const pendingKey = getCacheKey(url, method, data)
      if (pendingRequests.has(pendingKey)) {
        pendingRequests.get(pendingKey).push({ resolve, reject })
        return
      }

      // 记录当前请求
      pendingRequests.set(pendingKey, [])
    }

    // 获取token
    const token = wx.getStorageSync('token') || ''

    const requestTask = wx.request({
      url: app.globalData.serverUrl + url,
      method,
      data,
      timeout,
      header: {
        'content-type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 业务成功 - 支持 code: 0 或 success: true 两种格式
          if (res.data.code === 0 || res.data.success === true) {
            // 缓存成功响应
            if (enableCache) {
              const cacheKey = getCacheKey(url, method, data)
              setCache(cacheKey, res.data, cacheTTL)
            }
            resolve(res.data)

            // 通知所有等待的请求
            if (enableCache) {
              const pendingKey = getCacheKey(url, method, data)
              const pending = pendingRequests.get(pendingKey) || []
              pending.forEach(({ resolve: r }) => r(res.data))
              pendingRequests.delete(pendingKey)
            }
          } else {
            // 业务失败
            showError(res.data.message || '请求失败')
            reject(res.data)

            // 通知所有等待的请求
            if (enableCache) {
              const pendingKey = getCacheKey(url, method, data)
              const pending = pendingRequests.get(pendingKey) || []
              pending.forEach(({ reject: r }) => r(res.data))
              pendingRequests.delete(pendingKey)
            }
          }
        } else if (res.statusCode === 401) {
          // 未授权，需要登录
          handleUnauthorized()
          reject(res)

          if (enableCache) {
            const pendingKey = getCacheKey(url, method, data)
            const pending = pendingRequests.get(pendingKey) || []
            pending.forEach(({ reject: r }) => r(res))
            pendingRequests.delete(pendingKey)
          }
        } else {
          // 其他错误
          showError(`请求失败: ${res.statusCode}`)
          reject(res)

          if (enableCache) {
            const pendingKey = getCacheKey(url, method, data)
            const pending = pendingRequests.get(pendingKey) || []
            pending.forEach(({ reject: r }) => r(res))
            pendingRequests.delete(pendingKey)
          }
        }
      },
      fail: (err) => {
        // 检查是否是主动取消的请求
        if (err.errMsg && err.errMsg.includes('abort')) {
          reject({ cancelled: true, message: '请求已取消' })
        } else {
          showError('网络错误，请检查网络连接')
          reject(err)
        }

        if (enableCache) {
          const pendingKey = getCacheKey(url, method, data)
          const pending = pendingRequests.get(pendingKey) || []
          pending.forEach(({ reject: r }) => r(err))
          pendingRequests.delete(pendingKey)
        }
      },
      complete: () => {
        // 请求完成，从任务列表中移除
        if (requestId) {
          requestTasks.delete(requestId)
        }
      }
    })

    // 保存请求任务以便取消
    if (requestId) {
      requestTasks.set(requestId, requestTask)
    }
  })
}

/**
 * GET 请求
 */
function get(url, data = {}, timeout) {
  return request({
    url,
    method: 'GET',
    data,
    timeout
  })
}

/**
 * POST 请求
 */
function post(url, data = {}, timeout) {
  return request({
    url,
    method: 'POST',
    data,
    timeout
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
  // 避免连续弹出错误提示
  const lastErrorTime = wx.getStorageSync('lastErrorTime') || 0
  const now = Date.now()
  if (now - lastErrorTime < 2000) {
    return
  }
  wx.setStorageSync('lastErrorTime', now)
  
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
  delete: del,
  clearCache,
  abortRequest,
  abortAllRequests
}
