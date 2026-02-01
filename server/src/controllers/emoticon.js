// src/controllers/emoticon.js - 表情包控制器
const emoticonService = require('../services/emoticon')

class EmoticonController {
  // 获取分类列表
  async getCategories(req, res) {
    try {
      const result = await emoticonService.getCategories()
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取表情包列表
  async getList(req, res) {
    try {
      const { page = 1, pageSize = 20, category } = req.query
      const result = await emoticonService.getList({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        category
      })
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取表情包详情
  async getDetail(req, res) {
    try {
      const { id } = req.params
      const result = await emoticonService.getDetail(id)
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取表情包数量
  async getCount(req, res) {
    try {
      const count = await emoticonService.getCount()
      res.success({ count })
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new EmoticonController()
