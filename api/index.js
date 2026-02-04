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

  // 获取红包活动数量（5秒超时）
  getCount() {
    return request.get('/redpack/count', {}, 5000)
  },

  // 按日期获取红包活动
  getByDate(date) {
    return request.get('/redpack/by-date', { date })
  }
}

/**
 * 亲戚称呼相关接口
 */
const kinship = {
  // 计算亲戚称呼
  calculate(params) {
    return request.post('/kinship/calculate', params, 60000)
  },

  // 搜索亲戚称呼
  search(keyword) {
    return request.get('/kinship/search', { keyword })
  },

  // 获取亲戚称呼图表
  getChart() {
    return request.get('/kinship/chart')
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

  // 获取春晚数量（5秒超时）
  getCount() {
    return request.get('/gala/count', {}, 5000)
  },

  // 获取时间轴
  getTimeline(date) {
    return request.get('/gala/timeline', { date })
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
    return request.upload('/common/upload', filePath)
  }
}

// 导出所有接口
module.exports = {
  redpack,
  gala,
  kinship,
  common
}
