// src/routes/emoticon.js - 表情包路由
const express = require('express')
const router = express.Router()
const emoticonController = require('../controllers/emoticon')

// 获取分类列表
router.get('/categories', emoticonController.getCategories)

// 获取表情包列表
router.get('/list', emoticonController.getList)

// 获取表情包数量
router.get('/count', emoticonController.getCount)

// 获取表情包详情
router.get('/:id', emoticonController.getDetail)

module.exports = router
