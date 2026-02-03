// src/routes/admin-gala.js - 管理端春晚路由
const express = require('express')
const router = express.Router()
const adminGalaController = require('../controllers/admin-gala')

// 平台管理
router.get('/platforms', adminGalaController.getPlatforms)
router.post('/platforms', adminGalaController.createPlatform)
router.put('/platforms/:id', adminGalaController.updatePlatform)
router.delete('/platforms/:id', adminGalaController.deletePlatform)

// 节目管理
router.get('/programs', adminGalaController.getPrograms)
router.post('/programs', adminGalaController.createProgram)
router.put('/programs/:id', adminGalaController.updateProgram)
router.delete('/programs/:id', adminGalaController.deleteProgram)

module.exports = router
