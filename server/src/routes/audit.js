// src/routes/audit.js - 审核路由
const express = require('express')
const router = express.Router()
const auditController = require('../controllers/audit')
const { authMiddleware } = require('../middleware/auth')

// 所有路由都需要认证
router.use(authMiddleware)

/**
 * @api {GET} /admin/api/audit/pending 获取待审核列表
 * @apiName GetPendingList
 * @apiGroup Audit
 * @apiQuery {String} type 资源类型 (redpack/gala_platform/gala_program/emoticon/kinship)
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 */
router.get('/pending', auditController.getPendingList)

/**
 * @api {GET} /admin/api/audit/:type/:id 获取审核详情
 * @apiName GetAuditDetail
 * @apiGroup Audit
 * @apiParam {String} type 资源类型
 * @apiParam {Number} id 资源ID
 */
router.get('/:type/:id', auditController.getDetail)

/**
 * @api {POST} /admin/api/audit/:type/:id/approve 审核通过
 * @apiName Approve
 * @apiGroup Audit
 * @apiParam {String} type 资源类型
 * @apiParam {Number} id 资源ID
 * @apiBody {String} note 审核备注
 */
router.post('/:type/:id/approve', auditController.approve)

/**
 * @api {POST} /admin/api/audit/:type/:id/reject 审核拒绝
 * @apiName Reject
 * @apiGroup Audit
 * @apiParam {String} type 资源类型
 * @apiParam {Number} id 资源ID
 * @apiBody {String} reason 拒绝理由
 */
router.post('/:type/:id/reject', auditController.reject)

/**
 * @api {POST} /admin/api/audit/:type/batch-approve 批量审核通过
 * @apiName BatchApprove
 * @apiGroup Audit
 * @apiParam {String} type 资源类型
 * @apiBody {Number[]} ids 资源ID数组
 * @apiBody {String} note 审核备注
 */
router.post('/:type/batch-approve', auditController.batchApprove)

/**
 * @api {GET} /admin/api/audit/logs 获取审核日志
 * @apiName GetAuditLogs
 * @apiGroup Audit
 * @apiQuery {String} resourceType 资源类型（可选）
 * @apiQuery {Number} resourceId 资源ID（可选）
 * @apiQuery {Number} page 页码
 * @apiQuery {Number} pageSize 每页数量
 */
router.get('/logs', auditController.getLogs)

/**
 * @api {GET} /admin/api/audit/stats 获取审核统计
 * @apiName GetAuditStats
 * @apiGroup Audit
 */
router.get('/stats', auditController.getStats)

module.exports = router
