// src/controllers/gala.js - 春晚节目单控制器
const galaService = require('../services/gala')

class GalaController {
  // 获取春晚平台列表
  async getPlatforms(req, res) {
    try {
      const result = await galaService.getPlatforms()
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取节目单
  async getPrograms(req, res) {
    try {
      const { platformId } = req.params
      const result = await galaService.getPrograms(platformId)
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取春晚数量
  async getCount(req, res) {
    try {
      const count = await galaService.getCount()
      res.success({ count })
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取时间轴
  async getTimeline(req, res) {
    try {
      const { date } = req.query
      const result = await galaService.getTimeline(date)
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new GalaController()
