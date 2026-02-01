// src/routes/crawler.js - 爬虫路由
const express = require('express')
const router = express.Router()
const crawlerController = require('../controllers/crawler')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

// 所有路由都需要认证
router.use(authMiddleware)

/**
 * @api {GET} /admin/api/crawler/tasks 获取爬虫任务列表
 * @apiName GetCrawlerTasks
 * @apiGroup Crawler
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 */
router.get('/tasks', crawlerController.getList)

/**
 * @api {GET} /admin/api/crawler/tasks/:id 获取爬虫任务详情
 * @apiName GetCrawlerTaskDetail
 * @apiGroup Crawler
 * @apiParam {Number} id 任务ID
 */
router.get('/tasks/:id', crawlerController.getDetail)

/**
 * @api {POST} /admin/api/crawler/tasks 创建爬虫任务
 * @apiName CreateCrawlerTask
 * @apiGroup Crawler
 * @apiBody {String} name 任务名称
 * @apiBody {String} type 爬取类型
 * @apiBody {String} sourceUrl 源地址
 * @apiBody {String} cronExpression Cron表达式
 * @apiBody {Object} config 爬虫配置
 */
router.post('/tasks', roleMiddleware(['super_admin', 'admin']), crawlerController.create)

/**
 * @api {PUT} /admin/api/crawler/tasks/:id 更新爬虫任务
 * @apiName UpdateCrawlerTask
 * @apiGroup Crawler
 * @apiParam {Number} id 任务ID
 */
router.put('/tasks/:id', roleMiddleware(['super_admin', 'admin']), crawlerController.update)

/**
 * @api {DELETE} /admin/api/crawler/tasks/:id 删除爬虫任务
 * @apiName DeleteCrawlerTask
 * @apiGroup Crawler
 * @apiParam {Number} id 任务ID
 */
router.delete('/tasks/:id', roleMiddleware(['super_admin', 'admin']), crawlerController.delete)

/**
 * @api {POST} /admin/api/crawler/tasks/:id/run 手动触发爬虫任务
 * @apiName RunCrawlerTask
 * @apiGroup Crawler
 * @apiParam {Number} id 任务ID
 */
router.post('/tasks/:id/run', crawlerController.manualRun)

/**
 * @api {POST} /admin/api/crawler/tasks/:id/pause 暂停爬虫任务
 * @apiName PauseCrawlerTask
 * @apiGroup Crawler
 * @apiParam {Number} id 任务ID
 */
router.post('/tasks/:id/pause', roleMiddleware(['super_admin', 'admin']), crawlerController.pause)

/**
 * @api {POST} /admin/api/crawler/tasks/:id/resume 恢复爬虫任务
 * @apiName ResumeCrawlerTask
 * @apiGroup Crawler
 * @apiParam {Number} id 任务ID
 */
router.post('/tasks/:id/resume', roleMiddleware(['super_admin', 'admin']), crawlerController.resume)

/**
 * @api {GET} /admin/api/crawler/tasks/:id/logs 获取爬虫执行日志
 * @apiName GetCrawlerLogs
 * @apiGroup Crawler
 * @apiParam {Number} id 任务ID
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 */
router.get('/tasks/:id/logs', crawlerController.getLogs)

module.exports = router
