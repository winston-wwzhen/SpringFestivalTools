// src/controllers/crawler.js - 爬虫控制器
const crawlerService = require('../services/crawler')

class CrawlerController {
  // 获取任务列表
  async getList(req, res) {
    try {
      const { page = 1, pageSize = 20 } = req.query
      const result = await crawlerService.getList(
        parseInt(page),
        parseInt(pageSize)
      )
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取任务详情
  async getDetail(req, res) {
    try {
      const { id } = req.params
      const task = await crawlerService.getDetail(id)
      res.success(task)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 创建任务
  async create(req, res) {
    try {
      const { name, type, sourceUrl, cronExpression, config } = req.body

      if (!name || !type || !sourceUrl || !cronExpression) {
        return res.error('请填写完整信息')
      }

      const task = await crawlerService.create({
        name,
        type,
        sourceUrl,
        cronExpression,
        config
      })

      res.success(task, '创建成功')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 更新任务
  async update(req, res) {
    try {
      const { id } = req.params
      const { name, sourceUrl, cronExpression, config, status } = req.body

      const task = await crawlerService.update(id, {
        name,
        sourceUrl,
        cronExpression,
        config,
        status
      })

      res.success(task, '更新成功')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 删除任务
  async delete(req, res) {
    try {
      const { id } = req.params
      await crawlerService.delete(id)
      res.success(null, '删除成功')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 手动触发任务
  async manualRun(req, res) {
    try {
      const { id } = req.params
      const result = await crawlerService.manualRun(id)
      res.success(result, '任务已启动')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 暂停任务
  async pause(req, res) {
    try {
      const { id } = req.params
      await crawlerService.pauseTask(id)
      res.success(null, '任务已暂停')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 恢复任务
  async resume(req, res) {
    try {
      const { id } = req.params
      await crawlerService.resumeTask(id)
      res.success(null, '任务已恢复')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取执行日志
  async getLogs(req, res) {
    try {
      const { id } = req.params
      const { page = 1, pageSize = 20 } = req.query
      const result = await crawlerService.getLogs(
        id,
        parseInt(page),
        parseInt(pageSize)
      )
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new CrawlerController()
