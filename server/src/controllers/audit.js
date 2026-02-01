// src/controllers/audit.js - 审核控制器
const auditService = require('../services/audit')

class AuditController {
  // 获取待审核列表
  async getPendingList(req, res) {
    try {
      const { type = 'redpack', page = 1, pageSize = 20 } = req.query
      const result = await auditService.getPendingList(
        type,
        parseInt(page),
        parseInt(pageSize)
      )

      // 获取统计信息
      const stats = await auditService.getPendingStats()

      res.success({
        ...result,
        stats
      })
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取审核详情
  async getDetail(req, res) {
    try {
      const { type, id } = req.params
      const detail = await auditService.getDetail(type, id)
      res.success(detail)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 审核通过
  async approve(req, res) {
    try {
      const { type, id } = req.params
      const { note = '' } = req.body
      const ip = req.ip || req.connection.remoteAddress || 'unknown'

      await auditService.approve(type, id, req.admin.id, note, ip)
      res.success(null, '审核通过')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 审核拒绝
  async reject(req, res) {
    try {
      const { type, id } = req.params
      const { reason = '' } = req.body
      const ip = req.ip || req.connection.remoteAddress || 'unknown'

      if (!reason) {
        return res.error('请填写拒绝理由')
      }

      await auditService.reject(type, id, req.admin.id, reason, ip)
      res.success(null, '已拒绝')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 批量审核
  async batchApprove(req, res) {
    try {
      const { type } = req.params
      const { ids, note = '' } = req.body
      const ip = req.ip || req.connection.remoteAddress || 'unknown'

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.error('请选择要审核的内容')
      }

      const result = await auditService.batchApprove(type, ids, req.admin.id, note, ip)
      res.success(result, `已批量通过 ${result.count} 条内容`)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取审核日志
  async getLogs(req, res) {
    try {
      const { resourceType, resourceId, page = 1, pageSize = 20 } = req.query
      const result = await auditService.getLogs(
        resourceType,
        resourceId ? parseInt(resourceId) : null,
        parseInt(page),
        parseInt(pageSize)
      )
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取审核统计
  async getStats(req, res) {
    try {
      const stats = await auditService.getStats()
      res.success(stats)
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new AuditController()
