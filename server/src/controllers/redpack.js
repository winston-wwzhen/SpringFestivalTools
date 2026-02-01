// src/controllers/redpack.js - 红包攻略控制器
const redpackService = require('../services/redpack')

class RedpackController {
  // 获取红包活动列表
  async getList(req, res) {
    try {
      const { page = 1, pageSize = 20, platform, status } = req.query
      const result = await redpackService.getList({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        platform,
        status
      })
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取红包活动详情
  async getDetail(req, res) {
    try {
      const { id } = req.params
      const result = await redpackService.getDetail(id)
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取红包活动数量
  async getCount(req, res) {
    try {
      const count = await redpackService.getCount()
      res.success({ count })
    } catch (error) {
      res.error(error.message)
    }
  }

  // 按日期获取红包活动
  async getByDate(req, res) {
    try {
      const { date } = req.query
      const result = await redpackService.getByDate(date)
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new RedpackController()
