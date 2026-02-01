// src/controllers/kinship.js - 亲戚称呼控制器
const kinshipService = require('../services/kinship')

class KinshipController {
  // 计算称呼
  async calculate(req, res) {
    try {
      const { gender, relation } = req.body
      const result = await kinshipService.calculate({ gender, relation })
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 搜索称呼
  async search(req, res) {
    try {
      const { keyword } = req.query
      const result = await kinshipService.search(keyword)
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取关系图
  async getChart(req, res) {
    try {
      const result = await kinshipService.getChart()
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new KinshipController()
