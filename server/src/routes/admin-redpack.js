// src/routes/admin-redpack.js - 管理端红包路由
const express = require('express')
const router = express.Router()
const adminRedpackController = require('../controllers/admin-redpack')

// 获取列表（管理端，可以查看所有数据）
router.get('/list', adminRedpackController.getList)

// 获取详情
router.get('/:id', adminRedpackController.getDetail)

// 创建红包活动
router.post('/create', adminRedpackController.create)

// 更新红包活动
router.put('/:id', adminRedpackController.update)

// 批量更新排序
router.put('/sort/batch', adminRedpackController.updateSort)

// 删除红包活动
router.delete('/:id', adminRedpackController.delete)

module.exports = router
