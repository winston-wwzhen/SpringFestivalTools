// src/routes/gala.js - 春晚节目单路由
const express = require('express')
const router = express.Router()
const galaController = require('../controllers/gala')

// 获取春晚平台列表
router.get('/platforms', galaController.getPlatforms)

// 获取节目单
router.get('/:platformId/programs', galaController.getPrograms)

// 获取春晚数量
router.get('/count', galaController.getCount)

// 获取时间轴
router.get('/timeline', galaController.getTimeline)

module.exports = router
