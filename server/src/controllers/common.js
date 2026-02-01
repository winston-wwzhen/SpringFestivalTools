// src/controllers/common.js - 通用控制器
const commonService = require('../services/common')

class CommonController {
  // 获取每日推荐
  async getDaily(req, res) {
    try {
      const result = await commonService.getDaily()
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取轮播图
  async getBanners(req, res) {
    try {
      const result = await commonService.getBanners()
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 上传图片
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.error('请选择文件')
      }
      const result = await commonService.saveImage(req.file)
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new CommonController()
