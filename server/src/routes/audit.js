// src/routes/audit.js - 审核路由
const express = require('express')
const router = express.Router()
const auditController = require('../controllers/audit')
const { authMiddleware } = require('../middleware/auth')

/**
 * @api {GET} /admin/api/audit/pending/:type 获取待审核列表
 * @apiName GetPendingList
 * @apiGroup Audit
 * @apiHeader {String} Authorization JWT Token
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 */
router.get('/pending/:type', authMiddleware, auditController.getPendingList)

/**
 * @api {GET} /admin/api/audit/detail/:type/:id 获取审核详情
 * @apiName GetAuditDetail
 * @apiGroup Audit
 * @apiHeader {String} Authorization JWT Token
 */
router.get('/detail/:type/:id', authMiddleware, auditController.getDetail)

/**
 * @api {POST} /admin/api/audit/approve/:type/:id 审核通过
 * @apiName Approve
 * @apiGroup Audit
 * @apiHeader {String} Authorization JWT Token
 * @apiBody {String} note 备注
 */
router.post('/approve/:type/:id', authMiddleware, auditController.approve)

/**
 * @api {POST} /admin/api/audit/reject/:type/:id 审核拒绝
 * @apiName Reject
 * @apiGroup Audit
 * @apiHeader {String} Authorization JWT Token
 * @apiBody {String} reason 拒绝理由
 */
router.post('/reject/:type/:id', authMiddleware, auditController.reject)

/**
 * @api {POST} /admin/api/audit/batch-approve/:type 批量审核通过
 * @apiName BatchApprove
 * @apiGroup Audit
 * @apiHeader {String} Authorization JWT Token
 * @apiBody {Array} ids ID数组
 * @apiBody {String} note 备注
 */
router.post('/batch-approve/:type', authMiddleware, auditController.batchApprove)

/**
 * @api {GET} /admin/api/audit/logs 获取审核日志
 * @apiName GetAuditLogs
 * @apiGroup Audit
 * @apiHeader {String} Authorization JWT Token
 * @apiQuery {String} resourceType 资源类型
 * @apiQuery {Number} resourceId 资源ID
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 */
router.get('/logs', authMiddleware, auditController.getLogs)

/**
 * @api {GET} /admin/api/audit/stats 获取审核统计
 * @apiName GetAuditStats
 * @apiGroup Audit
 * @apiHeader {String} Authorization JWT Token
 */
router.get('/stats', authMiddleware, auditController.getStats)

module.exports = router
