// src/controllers/admin-gala.js - 管理端春晚控制器
const db = require('../database/db')
const logger = require('../../utils/logger')

/**
 * 将数据库字段（下划线命名）转换为前端字段（驼峰命名）
 */
function mapPlatformToCamelCase(item) {
  return {
    id: item.id,
    name: item.name,
    shortName: item.short_name,
    emoji: item.emoji,
    year: item.year,
    airDate: item.air_date,
    airTime: item.air_time,
    channel: item.channel,
    logo: item.logo,
    poster: item.poster,
    description: item.description,
    sort: item.sort,
    isShow: item.is_show,
    tags: safeParseJson(item.tags, []),
    reviewStatus: item.review_status,
    sourceUrl: item.source_url,
    reviewedAt: item.reviewed_at,
    reviewedBy: item.reviewed_by,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }
}

/**
 * 安全解析JSON
 */
function safeParseJson(value, defaultValue = []) {
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
 * 将节目数据库字段（下划线命名）转换为前端字段（驼峰命名）
 */
function mapProgramToCamelCase(item) {
  return {
    id: item.id,
    platformId: item.platform_id,
    title: item.title,
    type: item.type,
    performers: item.performer,
    performer: item.performer,
    orderNum: item.order_num,
    airTime: item.start_time,
    startTime: item.start_time,
    duration: item.duration,
    description: item.description,
    reviewStatus: item.review_status,
    reviewedAt: item.reviewed_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }
}

/**
 * 获取平台列表
 */
async function getPlatforms(req, res) {
  try {
    const { page = 1, pageSize = 20, year, reviewStatus } = req.query
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM gala_platforms WHERE 1=1'
    const params = []

    if (year) {
      sql += ' AND year = ?'
      params.push(year)
    }

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      params.push(reviewStatus)
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total')
    const [countResult] = await db.query(countSql, params)
    const total = countResult.total

    sql += ' ORDER BY sort ASC, year DESC LIMIT ? OFFSET ?'
    const list = await db.query(sql, [...params, parseInt(pageSize), offset])

    // 字段映射
    const mappedList = list.map(mapPlatformToCamelCase)

    res.success({
      list: mappedList,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    })
  } catch (error) {
    logger.error('获取平台列表失败:', error)
    res.error('获取列表失败')
  }
}

/**
 * 创建平台
 */
async function createPlatform(req, res) {
  try {
    const { name, shortName, emoji, year, airDate, airTime, channel, logo, poster, description, sort, isShow, tags } = req.body

    if (!name || !year) {
      return res.error('缺少必要参数')
    }

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags || '[]')

    const result = await db.query(
      `INSERT INTO gala_platforms (name, short_name, emoji, year, air_date, air_time, channel, logo, poster, description, sort, is_show, tags, review_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [name, shortName || null, emoji || null, year, airDate || null, airTime || null, channel || null, logo || null, poster || null, description || null, sort || 0, isShow !== undefined ? (isShow ? 1 : 0) : 1, tagsJson]
    )

    logger.info('创建春晚平台成功:', { id: result.insertId, name })
    res.success({ id: result.insertId }, '创建成功')
  } catch (error) {
    logger.error('创建平台失败:', error)
    res.error('创建失败')
  }
}

/**
 * 更新平台
 */
async function updatePlatform(req, res) {
  try {
    const { id } = req.params
    const { name, shortName, emoji, year, airDate, airTime, channel, logo, poster, description, sort, isShow, tags } = req.body

    const [platform] = await db.query('SELECT * FROM gala_platforms WHERE id = ?', [id])
    if (!platform) {
      return res.error('平台不存在', -1, 404)
    }

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags || platform.tags || '[]')

    await db.query(
      `UPDATE gala_platforms
       SET name = ?, short_name = ?, emoji = ?, year = ?, air_date = ?, air_time = ?, channel = ?, logo = ?, poster = ?,
           description = ?, sort = ?, is_show = ?, tags = ?
       WHERE id = ?`,
      [name, shortName || null, emoji || null, year, airDate || null, airTime || null, channel || null, logo || null, poster || null,
       description || null, sort || 0, isShow !== undefined ? (isShow ? 1 : 0) : platform.is_show, tagsJson, id]
    )

    logger.info('更新春晚平台成功:', { id, name })
    res.success(null, '更新成功')
  } catch (error) {
    logger.error('更新平台失败:', error)
    res.error('更新失败')
  }
}

/**
 * 删除平台
 */
async function deletePlatform(req, res) {
  try {
    const { id } = req.params

    const [platform] = await db.query('SELECT * FROM gala_platforms WHERE id = ?', [id])
    if (!platform) {
      return res.error('平台不存在', -1, 404)
    }

    await db.query('DELETE FROM gala_platforms WHERE id = ?', [id])

    logger.info('删除春晚平台成功:', { id })
    res.success(null, '删除成功')
  } catch (error) {
    logger.error('删除平台失败:', error)
    res.error('删除失败')
  }
}

/**
 * 获取节目列表
 */
async function getPrograms(req, res) {
  try {
    const { page = 1, pageSize = 20, platformId, type, reviewStatus } = req.query
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM gala_programs WHERE 1=1'
    const params = []

    if (platformId) {
      sql += ' AND platform_id = ?'
      params.push(platformId)
    }

    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      params.push(reviewStatus)
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total')
    const [countResult] = await db.query(countSql, params)
    const total = countResult.total

    sql += ' ORDER BY platform_id ASC, order_num ASC LIMIT ? OFFSET ?'
    const list = await db.query(sql, [...params, parseInt(pageSize), offset])

    // 字段映射
    const mappedList = list.map(mapProgramToCamelCase)

    res.success({
      list: mappedList,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    })
  } catch (error) {
    logger.error('获取节目列表失败:', error)
    res.error('获取列表失败')
  }
}

/**
 * 创建节目
 */
async function createProgram(req, res) {
  try {
    const { platform_id, title, performer, type, order_num, start_time, duration, description } = req.body

    if (!platform_id || !title) {
      return res.error('缺少必要参数')
    }

    const result = await db.query(
      `INSERT INTO gala_programs (platform_id, title, performer, type, order_num, start_time, duration, description, review_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [platform_id, title, performer || null, type || null, order_num || 0, start_time || null, duration || null, description || null]
    )

    logger.info('创建春晚节目成功:', { id: result.insertId, title })
    res.success({ id: result.insertId }, '创建成功')
  } catch (error) {
    logger.error('创建节目失败:', error)
    res.error('创建失败')
  }
}

/**
 * 更新节目
 */
async function updateProgram(req, res) {
  try {
    const { id } = req.params
    const { platform_id, title, performer, type, order_num, start_time, duration, description } = req.body

    const [program] = await db.query('SELECT * FROM gala_programs WHERE id = ?', [id])
    if (!program) {
      return res.error('节目不存在', -1, 404)
    }

    await db.query(
      `UPDATE gala_programs
       SET platform_id = ?, title = ?, performer = ?, type = ?, order_num = ?, start_time = ?, duration = ?, description = ?
       WHERE id = ?`,
      [platform_id, title, performer || null, type || null, order_num || 0, start_time || null, duration || null, description || null, id]
    )

    logger.info('更新春晚节目成功:', { id, title })
    res.success(null, '更新成功')
  } catch (error) {
    logger.error('更新节目失败:', error)
    res.error('更新失败')
  }
}

/**
 * 删除节目
 */
async function deleteProgram(req, res) {
  try {
    const { id } = req.params

    const [program] = await db.query('SELECT * FROM gala_programs WHERE id = ?', [id])
    if (!program) {
      return res.error('节目不存在', -1, 404)
    }

    await db.query('DELETE FROM gala_programs WHERE id = ?', [id])

    logger.info('删除春晚节目成功:', { id })
    res.success(null, '删除成功')
  } catch (error) {
    logger.error('删除节目失败:', error)
    res.error('删除失败')
  }
}

module.exports = {
  getPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram
}
