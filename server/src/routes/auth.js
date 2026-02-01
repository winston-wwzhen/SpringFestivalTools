// src/routes/auth.js - 认证路由
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { authMiddleware, roleMiddleware } = require('../middleware/auth')

/**
 * @api {POST} /admin/api/auth/login 管理员登录
 * @apiName AdminLogin
 * @apiGroup Auth
 * @apiBody {String} username 用户名
 * @apiBody {String} password 密码
 */
router.post('/login', authController.login)

/**
 * @api {GET} /admin/api/auth/profile 获取当前用户信息
 * @apiName GetProfile
 * @apiGroup Auth
 * @apiHeader {String} Authorization JWT Token
 */
router.get('/profile', authMiddleware, authController.getProfile)

/**
 * @api {PUT} /admin/api/auth/password 修改密码
 * @apiName ChangePassword
 * @apiGroup Auth
 * @apiHeader {String} Authorization JWT Token
 * @apiBody {String} oldPassword 原密码
 * @apiBody {String} newPassword 新密码
 */
router.put('/password', authMiddleware, authController.changePassword)

/**
 * @api {GET} /admin/api/auth/users 获取管理员列表
 * @apiName GetAdminList
 * @apiGroup Auth
 * @apiHeader {String} Authorization JWT Token
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 */
router.get('/users', authMiddleware, roleMiddleware(['super_admin', 'admin']), authController.getList)

/**
 * @api {POST} /admin/api/auth/users 创建管理员
 * @apiName CreateAdmin
 * @apiGroup Auth
 * @apiHeader {String} Authorization JWT Token
 * @apiBody {String} username 用户名
 * @apiBody {String} password 密码
 * @apiBody {String} realName 真实姓名
 * @apiBody {String} role 角色
 */
router.post('/users', authMiddleware, roleMiddleware(['super_admin']), authController.create)

/**
 * @api {PUT} /admin/api/auth/users/:id 更新管理员
 * @apiName UpdateAdmin
 * @apiGroup Auth
 * @apiHeader {String} Authorization JWT Token
 */
router.put('/users/:id', authMiddleware, roleMiddleware(['super_admin']), authController.update)

/**
 * @api {DELETE} /admin/api/auth/users/:id 删除管理员
 * @apiName DeleteAdmin
 * @apiGroup Auth
 * @apiHeader {String} Authorization JWT Token
 */
router.delete('/users/:id', authMiddleware, roleMiddleware(['super_admin']), authController.delete)

module.exports = router
