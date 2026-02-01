// api/index.js - API 接口定义
const request = require('../utils/request')

/**
 * 红包相关接口
 */
const redpack = {
  // 获取红包活动列表
  getList(params) {
    return request.get('/redpack/list', params)
  },

  // 获取红包活动详情
  getDetail(id) {
    return request.get(`/redpack/${id}`)
  },

  // 获取红包活动数量
  getCount() {
    return request.get('/redpack/count')
  },

  // 按日期获取红包活动
  getByDate(date) {
    return request.get('/redpack/by-date', { date })
  }
}

/**
 * 春晚相关接口
 */
const gala = {
  // 获取春晚平台列表
  getPlatforms() {
    return request.get('/gala/platforms')
  },

  // 获取节目单
  getPrograms(platformId) {
    return request.get(`/gala/${platformId}/programs`)
  },

  // 获取春晚数量
  getCount() {
    return request.get('/gala/count')
  },

  // 获取时间轴
  getTimeline(date) {
    return request.get('/gala/timeline', { date })
  }
}

/**
 * 亲戚称呼相关接口
 */
const kinship = {
  // 计算称呼
  calculate(params) {
    return request.post('/kinship/calculate', params)
  },

  // 搜索称呼
  search(keyword) {
    return request.get('/kinship/search', { keyword })
  },

  // 获取关系图
  getChart() {
    return request.get('/kinship/chart')
  }
}

/**
 * 表情包相关接口
 */
const emoticon = {
  // 获取分类列表
  getCategories() {
    return request.get('/emoticon/categories')
  },

  // 获取表情包列表
  getList(params) {
    return request.get('/emoticon/list', params)
  },

  // 获取表情包详情
  getDetail(id) {
    return request.get(`/emoticon/${id}`)
  },

  // 获取表情包数量
  getCount() {
    return request.get('/emoticon/count')
  }
}

/**
 * 通用接口
 */
const common = {
  // 获取每日推荐
  getDailyRecommend() {
    return request.get('/common/daily')
  },

  // 获取轮播图
  getBanners() {
    return request.get('/common/banners')
  },

  // 上传图片
  uploadImage(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: getApp().globalData.serverUrl + '/common/upload',
        filePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`
        },
        success: (res) => {
          const data = JSON.parse(res.data)
          if (data.code === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        },
        fail: reject
      })
    })
  }
}

module.exports = {
  redpack,
  gala,
  kinship,
  emoticon,
  common
}
