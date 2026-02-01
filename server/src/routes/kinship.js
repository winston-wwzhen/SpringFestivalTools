// src/routes/kinship.js - 亲戚称呼路由
const express = require('express')
const router = express.Router()
const kinshipController = require('../controllers/kinship')

// 计算称呼
router.post('/calculate', kinshipController.calculate)

// 搜索称呼
router.get('/search', kinshipController.search)

// 获取关系图
router.get('/chart', kinshipController.getChart)

module.exports = router
