// src/services/gala.js - 春晚节目单服务
const db = require('../database/db')

class GalaService {
  /**
   * 安全解析JSON
   */
  safeParseJson(value, defaultValue = []) {
    if (!value) return defaultValue

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : defaultValue
      } catch (e) {
        return defaultValue
      }
    }

    return defaultValue
  }

  /**
   * 格式化播出时间
   */
  formatBroadcastTime(airDate, airTime) {
    if (!airDate && !airTime) return ''

    // 处理 Date 对象或字符串
    let dateStr = ''
    if (airDate) {
      if (airDate instanceof Date) {
        const year = airDate.getFullYear()
        const month = String(airDate.getMonth() + 1).padStart(2, '0')
        const day = String(airDate.getDate()).padStart(2, '0')
        dateStr = `${year}年${month}月${day}日`
      } else {
        dateStr = airDate.replace(/-/g, '年') + '日'
      }
    }

    const time = airTime || ''

    if (dateStr && time) {
      return `${dateStr} ${time}`
    }
    return dateStr || time
  }

  // 获取春晚平台列表（小程序端，仅返回已审核数据）
  async getPlatforms() {
    const sql = 'SELECT * FROM gala_platforms WHERE review_status = "approved" AND is_show = 1 ORDER BY sort ASC'
    const rows = await db.query(sql)

    // 统计每个平台的节目数量
    const platformIds = rows.map(r => r.id)
    const programCounts = {}

    if (platformIds.length > 0) {
      const placeholders = platformIds.map(() => '?').join(',')
      const countSql = `
        SELECT platform_id, COUNT(*) as count
        FROM gala_programs
        WHERE platform_id IN (${placeholders}) AND review_status = "approved"
        GROUP BY platform_id
      `
      const countRows = await db.query(countSql, platformIds)
      countRows.forEach(row => {
        programCounts[row.platform_id] = row.count
      })
    }

    // 格式化数据
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      short_name: row.short_name || '',
      emoji: row.emoji || '📺',
      broadcast_time: this.formatBroadcastTime(row.air_date, row.air_time),
      program_count: programCounts[row.id] || 0,
      is_live: false, // TODO: 根据当前时间和播出时间判断
      tags: this.safeParseJson(row.tags, [])
    }))
  }

  // 获取节目单（小程序端，仅返回已审核数据）
  async getPrograms(platformId) {
    const sql = `
      SELECT * FROM gala_programs
      WHERE platform_id = ? AND review_status = "approved"
      ORDER BY order_num ASC
    `
    const rows = await db.query(sql, [platformId])

    // 获取平台信息（仅返回已审核的平台）
    const platformSql = 'SELECT * FROM gala_platforms WHERE id = ? AND review_status = "approved"'
    const platformRows = await db.query(platformSql, [platformId])
    const platform = platformRows[0] || {}

    // 格式化节目数据
    const programs = rows.map(row => ({
      id: row.id,
      order: row.order_num,
      name: row.title,
      performers: row.performer,
      type: row.type || '歌舞'
    }))

    // 格式化平台数据
    const platformData = {
      id: platform.id,
      name: platform.name,
      emoji: platform.emoji || '📺',
      broadcast_time: this.formatBroadcastTime(platform.air_date, platform.air_time)
    }

    return {
      platform: platformData,
      programs: programs
    }
  }

  // 获取春晚数量（小程序端，仅统计已审核数据）
  async getCount() {
    const sql = 'SELECT COUNT(*) as count FROM gala_platforms WHERE review_status = "approved"'
    const rows = await db.query(sql)
    return rows[0].count
  }

  // 获取时间轴（小程序端，仅返回已审核数据）
  async getTimeline(date) {
    const sql = `
      SELECT gp.*, p.name as platform_name, p.logo as platform_logo
      FROM gala_programs gp
      JOIN gala_platforms p ON gp.platform_id = p.id
      WHERE gp.air_date = ? AND gp.review_status = "approved" AND p.review_status = "approved"
      ORDER BY gp.air_time ASC
    `
    const rows = await db.query(sql, [date])
    return rows
  }

  // ============================================
  // 管理端方法
  // ============================================

  // 管理端 - 获取平台列表（支持状态筛选）
  async adminGetPlatforms(params) {
    const { reviewStatus } = params

    let sql = 'SELECT * FROM gala_platforms WHERE 1=1'
    const queryParams = []

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      queryParams.push(reviewStatus)
    }

    sql += ' ORDER BY created_at DESC'

    const rows = await db.query(sql, queryParams)
    return rows
  }

  // 管理端 - 创建平台
  async createPlatform(data) {
    const { name, logo, air_date, air_time, channel, description, sort } = data

    const result = await db.query(
      `INSERT INTO gala_platforms (name, logo, air_date, air_time, channel, description, sort, review_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [name, logo, air_date, air_time, channel, description, sort || 0]
    )

    return { id: result.insertId }
  }

  // 管理端 - 更新平台
  async updatePlatform(id, data) {
    const { name, logo, air_date, air_time, channel, description, sort } = data

    await db.query(
      `UPDATE gala_platforms
       SET name = ?, logo = ?, air_date = ?, air_time = ?, channel = ?, description = ?, sort = ?
       WHERE id = ?`,
      [name, logo, air_date, air_time, channel, description, sort, id]
    )

    return true
  }

  // 管理端 - 删除平台
  async deletePlatform(id) {
    await db.query('DELETE FROM gala_platforms WHERE id = ?', [id])
    return true
  }

  // 管理端 - 获取节目列表
  async adminGetPrograms(params) {
    const { platformId, reviewStatus } = params

    let sql = 'SELECT * FROM gala_programs WHERE 1=1'
    const queryParams = []

    if (platformId) {
      sql += ' AND platform_id = ?'
      queryParams.push(platformId)
    }

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      queryParams.push(reviewStatus)
    }

    sql += ' ORDER BY order_num ASC'

    const rows = await db.query(sql, queryParams)
    return rows
  }

  // 管理端 - 创建节目
  async createProgram(data) {
    const { platform_id, title, type, performers, air_time, order_num } = data

    const result = await db.query(
      `INSERT INTO gala_programs (platform_id, title, type, performers, air_time, order_num, review_status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [platform_id, title, type, performers, air_time, order_num || 0]
    )

    return { id: result.insertId }
  }

  // 管理端 - 更新节目
  async updateProgram(id, data) {
    const { title, type, performers, air_time, order_num } = data

    await db.query(
      `UPDATE gala_programs
       SET title = ?, type = ?, performers = ?, air_time = ?, order_num = ?
       WHERE id = ?`,
      [title, type, performers, air_time, order_num, id]
    )

    return true
  }

  // 管理端 - 删除节目
  async deleteProgram(id) {
    await db.query('DELETE FROM gala_programs WHERE id = ?', [id])
    return true
  }
}

module.exports = new GalaService()
