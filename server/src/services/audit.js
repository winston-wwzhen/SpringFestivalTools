// src/services/audit.js - 审核服务
const db = require('../database/db')

class AuditService {
  /**
   * 资源类型到表名的映射
   */
  getTableName(type) {
    const mapping = {
      'redpack': 'redpack_activities',
      'gala_platform': 'gala_platforms',
      'gala_program': 'gala_programs',
      'emoticon': 'emoticons',
      'kinship': 'kinship_terms'
    }
    return mapping[type]
  }

  /**
   * 获取待审核列表
   */
  async getPendingList(type, page = 1, pageSize = 20) {
    const tableName = this.getTableName(type)
    const offset = (page - 1) * pageSize

    const sql = `
      SELECT * FROM ${tableName}
      WHERE review_status = 'pending'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `
    const list = await db.query(sql, [pageSize, offset])

    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM ${tableName} WHERE review_status = 'pending'`
    )

    return {
      list,
      total: countResult[0].total,
      page,
      pageSize
    }
  }

  /**
   * 获取所有类型的待审核统计
   */
  async getPendingStats() {
    const stats = {}
    const types = ['redpack', 'gala_platform', 'gala_program', 'emoticon', 'kinship']

    for (const type of types) {
      const tableName = this.getTableName(type)
      const result = await db.query(
        `SELECT COUNT(*) as count FROM ${tableName} WHERE review_status = 'pending'`
      )
      stats[type] = result[0].count
    }

    return stats
  }

  /**
   * 获取审核详情
   */
  async getDetail(type, id) {
    const tableName = this.getTableName(type)
    const rows = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id])

    if (rows.length === 0) {
      throw new Error('内容不存在')
    }

    return rows[0]
  }

  /**
   * 审核通过
   */
  async approve(type, id, adminId, note, ip) {
    const tableName = this.getTableName(type)
    const connection = await db.pool.getConnection()

    try {
      await connection.beginTransaction()

      // 获取原状态
      const [rows] = await connection.query(
        `SELECT review_status FROM ${tableName} WHERE id = ? FOR UPDATE`,
        [id]
      )

      if (rows.length === 0) {
        throw new Error('内容不存在')
      }

      const oldStatus = rows[0].review_status

      // 更新状态
      await connection.query(
        `UPDATE ${tableName}
         SET review_status = 'approved',
             reviewed_at = NOW(),
             reviewed_by = ?,
             reviewer_note = ?
         WHERE id = ?`,
        [adminId, note, id]
      )

      // 记录日志
      await connection.query(
        `INSERT INTO audit_logs (admin_id, resource_type, resource_id, action, old_status, new_status, reason, ip_address)
         VALUES (?, ?, ?, 'approve', ?, 'approved', ?, ?)`,
        [adminId, type, id, oldStatus, note, ip]
      )

      await connection.commit()
      return true
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  /**
   * 审核拒绝
   */
  async reject(type, id, adminId, reason, ip) {
    const tableName = this.getTableName(type)
    const connection = await db.pool.getConnection()

    try {
      await connection.beginTransaction()

      // 获取原状态
      const [rows] = await connection.query(
        `SELECT review_status FROM ${tableName} WHERE id = ? FOR UPDATE`,
        [id]
      )

      if (rows.length === 0) {
        throw new Error('内容不存在')
      }

      const oldStatus = rows[0].review_status

      // 更新状态
      await connection.query(
        `UPDATE ${tableName}
         SET review_status = 'rejected',
             reviewed_at = NOW(),
             reviewed_by = ?,
             reviewer_note = ?
         WHERE id = ?`,
        [adminId, reason, id]
      )

      // 记录日志
      await connection.query(
        `INSERT INTO audit_logs (admin_id, resource_type, resource_id, action, old_status, new_status, reason, ip_address)
         VALUES (?, ?, ?, 'reject', ?, 'rejected', ?, ?)`,
        [adminId, type, id, oldStatus, reason, ip]
      )

      await connection.commit()
      return true
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  /**
   * 批量审核
   */
  async batchApprove(type, ids, adminId, note, ip) {
    const tableName = this.getTableName(type)
    const connection = await db.pool.getConnection()

    try {
      await connection.beginTransaction()

      const placeholders = ids.map(() => '?').join(',')

      // 更新状态
      await connection.query(
        `UPDATE ${tableName}
         SET review_status = 'approved',
             reviewed_at = NOW(),
             reviewed_by = ?,
             reviewer_note = ?
         WHERE id IN (${placeholders})`,
        [adminId, note, ...ids]
      )

      // 批量记录日志
      for (const id of ids) {
        await connection.query(
          `INSERT INTO audit_logs (admin_id, resource_type, resource_id, action, new_status, reason, ip_address)
           VALUES (?, ?, ?, 'approve', 'approved', ?, ?)`,
          [adminId, type, id, note, ip]
        )
      }

      await connection.commit()
      return { count: ids.length }
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  /**
   * 获取审核日志
   */
  async getLogs(resourceType, resourceId, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize

    let sql = `
      SELECT al.*, au.real_name as reviewer_name
      FROM audit_logs al
      LEFT JOIN admin_users au ON al.admin_id = au.id
      WHERE 1=1
    `
    const params = []

    if (resourceType) {
      sql += ' AND al.resource_type = ?'
      params.push(resourceType)
    }

    if (resourceId) {
      sql += ' AND al.resource_id = ?'
      params.push(resourceId)
    }

    sql += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?'
    params.push(pageSize, offset)

    const list = await db.query(sql, params)

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM audit_logs WHERE 1=1'
    const countParams = []

    if (resourceType) {
      countSql += ' AND resource_type = ?'
      countParams.push(resourceType)
    }

    if (resourceId) {
      countSql += ' AND resource_id = ?'
      countParams.push(resourceId)
    }

    const countResult = await db.query(countSql, countParams)

    return {
      list,
      total: countResult[0].total,
      page,
      pageSize
    }
  }

  /**
   * 获取审核统计
   */
  async getStats() {
    const stats = {}

    for (const type of ['redpack', 'gala_platform', 'gala_program', 'emoticon', 'kinship']) {
      const tableName = this.getTableName(type)
      const rows = await db.query(
        `SELECT review_status, COUNT(*) as count FROM ${tableName} GROUP BY review_status`
      )

      stats[type] = {
        pending: 0,
        approved: 0,
        rejected: 0
      }

      rows.forEach(row => {
        stats[type][row.review_status] = row.count
      })
    }

    return stats
  }
}

module.exports = new AuditService()
