// src/routes/redpack.js - 红包攻略路由
const express = require('express')
const router = express.Router()
const redpackController = require('../controllers/redpack')

/**
 * @api {GET} /api/redpack/list 获取红包活动列表
 * @apiName GetRedpackList
 * @apiGroup Redpack
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 * @apiQuery {String} platform 平台筛选
 * @apiQuery {String} status 状态筛选
 */
router.get('/list', redpackController.getList)

/**
 * @api {GET} /api/redpack/count 获取红包活动数量
 * @apiName GetRedpackCount
 * @apiGroup Redpack
 */
router.get('/count', redpackController.getCount)

/**
 * @api {GET} /api/redpack/by-date 按日期获取红包活动
 * @apiName GetRedpackByDate
 * @apiGroup Redpack
 * @apiQuery {String} date 日期 YYYY-MM-DD
 */
router.get('/by-date', redpackController.getByDate)

/**
 * @api {GET} /api/redpack/:id 获取红包活动详情
 * @apiName GetRedpackDetail
 * @apiGroup Redpack
 * @apiParam {Number} id 活动ID
 */
router.get('/:id', redpackController.getDetail)

module.exports = router
