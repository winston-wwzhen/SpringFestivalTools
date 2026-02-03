// src/controllers/admin-gala.js - 管理端春晚控制器
const db = require('../database/db')
const logger = require('../../utils/logger')

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

    res.success({
      list,
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
    const { name, year, description } = req.body

    if (!name || !year) {
      return res.error('缺少必要参数')
    }

    const result = await db.query(
      `INSERT INTO gala_platforms (name, year, description, review_status)
       VALUES (?, ?, ?, 'approved')`,
      [name, year, description]
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
    const { name, year, description, sort } = req.body

    const [platform] = await db.query('SELECT * FROM gala_platforms WHERE id = ?', [id])
    if (!platform) {
      return res.error('平台不存在', -1, 404)
    }

    await db.query(
      `UPDATE gala_platforms SET name = ?, year = ?, description = ?, sort = ? WHERE id = ?`,
      [name, year, description, sort || 0, id]
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

    res.success({
      list,
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
    const { platform_id, title, performer, type, order_num, start_time } = req.body

    if (!platform_id || !title) {
      return res.error('缺少必要参数')
    }

    const result = await db.query(
      `INSERT INTO gala_programs (platform_id, title, performer, type, order_num, start_time, review_status)
       VALUES (?, ?, ?, ?, ?, ?, 'approved')`,
      [platform_id, title, performer, type, order_num, start_time]
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
    const { platform_id, title, performer, type, order_num, start_time } = req.body

    const [program] = await db.query('SELECT * FROM gala_programs WHERE id = ?', [id])
    if (!program) {
      return res.error('节目不存在', -1, 404)
    }

    await db.query(
      `UPDATE gala_programs SET platform_id = ?, title = ?, performer = ?, type = ?, order_num = ?, start_time = ? WHERE id = ?`,
      [platform_id, title, performer, type, order_num, start_time, id]
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
