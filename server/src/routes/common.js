// src/routes/common.js - 通用路由
const express = require('express')
const router = express.Router()
const commonController = require('../controllers/common')
const uploadMiddleware = require('../middleware/upload')

// 获取每日推荐
router.get('/daily', commonController.getDaily)

// 获取轮播图
router.get('/banners', commonController.getBanners)

// 上传图片
router.post('/upload', uploadMiddleware.single('file'), commonController.upload)

module.exports = router
