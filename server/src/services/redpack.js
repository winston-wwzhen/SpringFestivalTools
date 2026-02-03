// src/services/redpack.js - 红包攻略服务
const db = require('../database/db')

class RedpackService {
  // 获取红包活动列表（小程序端，仅返回已审核数据）
  async getList(params) {
    const { page, pageSize, platform, status } = params
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM redpack_activities WHERE review_status = "approved" AND is_show = 1'
    const queryParams = []

    if (platform) {
      sql += ' AND platform = ?'
      queryParams.push(platform)
    }

    if (status) {
      sql += ' AND status = ?'
      queryParams.push(status)
    }

    sql += ' ORDER BY sort_order ASC LIMIT ? OFFSET ?'
    queryParams.push(pageSize, offset)

    const rows = await db.query(sql, queryParams)

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM redpack_activities WHERE review_status = "approved" AND is_show = 1'
    const countParams = []

    if (platform) {
      countSql += ' AND platform = ?'
      countParams.push(platform)
    }

    if (status) {
      countSql += ' AND status = ?'
      countParams.push(status)
    }

    const countResult = await db.query(countSql, countParams)

    return {
      list: rows,
      total: countResult[0].total,
      page,
      pageSize
    }
  }

  // 获取红包活动详情（小程序端，仅返回已审核数据）
  async getDetail(id) {
    const sql = 'SELECT * FROM redpack_activities WHERE id = ? AND review_status = "approved"'
    const rows = await db.query(sql, [id])

    if (rows.length === 0) {
      throw new Error('活动不存在')
    }

    return rows[0]
  }

  // 获取红包活动数量（小程序端，仅统计已审核数据）
  async getCount() {
    const sql = 'SELECT COUNT(*) as count FROM redpack_activities WHERE status = "active" AND review_status = "approved" AND is_show = 1'
    const rows = await db.query(sql)
    return rows[0].count
  }

  // 按日期获取红包活动（小程序端，仅返回已审核数据）
  async getByDate(date) {
    const sql = `
      SELECT * FROM redpack_activities
      WHERE review_status = "approved"
        AND is_show = 1
        AND (DATE(start_time) = ? OR DATE(end_time) = ?)
      ORDER BY sort_order ASC
    `
    const rows = await db.query(sql, [date, date])
    return rows
  }

  // ============================================
  // 管理端方法（可以获取所有状态的数据）
  // ============================================

  // 管理端 - 获取列表（支持状态筛选）
  async adminGetList(params) {
    const { page, pageSize, platform, status, reviewStatus } = params
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM redpack_activities WHERE 1=1'
    const queryParams = []

    if (platform) {
      sql += ' AND platform = ?'
      queryParams.push(platform)
    }

    if (status) {
      sql += ' AND status = ?'
      queryParams.push(status)
    }

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      queryParams.push(reviewStatus)
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    queryParams.push(pageSize, offset)

    const rows = await db.query(sql, queryParams)

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM redpack_activities WHERE 1=1'
    const countParams = []

    if (platform) {
      countSql += ' AND platform = ?'
      countParams.push(platform)
    }

    if (status) {
      countSql += ' AND status = ?'
      countParams.push(status)
    }

    if (reviewStatus) {
      countSql += ' AND review_status = ?'
      countParams.push(reviewStatus)
    }

    const countResult = await db.query(countSql, countParams)

    return {
      list: rows,
      total: countResult[0].total,
      page,
      pageSize
    }
  }

  // 管理端 - 创建活动
  async create(data) {
    const { platform, title, description, rules, start_time, end_time, status } = data

    const result = await db.query(
      `INSERT INTO redpack_activities (platform, title, description, rules, start_time, end_time, status, review_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [platform, title, description, rules, start_time, end_time, status || 'active']
    )

    return { id: result.insertId }
  }

  // 管理端 - 更新活动
  async update(id, data) {
    const { platform, title, description, rules, start_time, end_time, status } = data

    await db.query(
      `UPDATE redpack_activities
       SET platform = ?, title = ?, description = ?, rules = ?, start_time = ?, end_time = ?, status = ?
       WHERE id = ?`,
      [platform, title, description, rules, start_time, end_time, status, id]
    )

    return true
  }

  // 管理端 - 删除活动
  async delete(id) {
    await db.query('DELETE FROM redpack_activities WHERE id = ?', [id])
    return true
  }
}

module.exports = new RedpackService()
