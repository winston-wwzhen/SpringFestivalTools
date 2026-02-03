// src/controllers/admin-redpack.js - 管理端红包控制器
const db = require('../database/db')
const logger = require('../../utils/logger')

/**
 * 将数据库字段（下划线命名）转换为前端字段（驼峰命名）
 */
function mapToCamelCase(item) {
  return {
    id: item.id,
    platform: item.platform,
    title: item.title,
    description: item.description,
    rules: item.rules,
    startTime: item.start_time,
    endTime: item.end_time,
    status: item.status,
    isShow: item.is_show,
    sortOrder: item.sort_order,
    reviewStatus: item.review_status,
    reviewedAt: item.reviewed_at,
    reviewedBy: item.reviewed_by,
    reviewerNote: item.reviewer_note,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }
}

/**
 * 获取红包活动列表（管理端）
 */
async function getList(req, res) {
  try {
    const { page = 1, pageSize = 20, platform, status, reviewStatus } = req.query
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM redpack_activities WHERE 1=1'
    const params = []

    if (platform) {
      sql += ' AND platform = ?'
      params.push(platform)
    }

    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      params.push(reviewStatus)
    }

    // 获取总数
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total')
    const [countResult] = await db.query(countSql, params)
    const total = countResult.total

    // 分页查询
    sql += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'
    const list = await db.query(sql, [...params, parseInt(pageSize), offset])

    // 字段映射：下划线转驼峰
    const mappedList = list.map(item => mapToCamelCase(item))

    res.success({
      list: mappedList,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    })
  } catch (error) {
    logger.error('获取红包列表失败:', error)
    res.error('获取列表失败')
  }
}

/**
 * 获取红包活动详情
 */
async function getDetail(req, res) {
  try {
    const { id } = req.params
    const [activity] = await db.query(
      'SELECT * FROM redpack_activities WHERE id = ?',
      [id]
    )

    if (!activity) {
      return res.error('活动不存在', -1, 404)
    }

    // 字段映射
    res.success(mapToCamelCase(activity))
  } catch (error) {
    logger.error('获取活动详情失败:', error)
    res.error('获取详情失败')
  }
}

/**
 * 创建红包活动
 */
async function create(req, res) {
  try {
    const { platform, title, description, rules, start_time, end_time, status = 'active' } = req.body

    if (!platform || !title || !start_time || !end_time) {
      return res.error('缺少必要参数')
    }

    const result = await db.query(
      `INSERT INTO redpack_activities (platform, title, description, rules, start_time, end_time, status, review_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [platform, title, description, rules, start_time, end_time, status]
    )

    logger.info('创建红包活动成功:', { id: result.insertId, title })
    res.success({ id: result.insertId }, '创建成功')
  } catch (error) {
    logger.error('创建红包活动失败:', error)
    res.error('创建失败')
  }
}

/**
 * 更新红包活动
 */
async function update(req, res) {
  try {
    const { id } = req.params
    const { platform, title, description, rules, start_time, end_time, status, is_show } = req.body

    // 检查活动是否存在
    const [activity] = await db.query('SELECT * FROM redpack_activities WHERE id = ?', [id])
    if (!activity) {
      return res.error('活动不存在', -1, 404)
    }

    // 更新
    await db.query(
      `UPDATE redpack_activities
       SET platform = ?, title = ?, description = ?, rules = ?, start_time = ?, end_time = ?, status = ?, is_show = ?
       WHERE id = ?`,
      [platform, title, description, rules, start_time, end_time, status, is_show !== undefined ? (is_show ? 1 : 0) : activity.is_show, id]
    )

    logger.info('更新红包活动成功:', { id, title })
    res.success(null, '更新成功')
  } catch (error) {
    logger.error('更新红包活动失败:', error)
    res.error('更新失败')
  }
}

/**
 * 批量更新排序
 */
async function updateSort(req, res) {
  try {
    const { items } = req.body // items: [{id: 1, sortOrder: 1}, {id: 2, sortOrder: 2}, ...]

    if (!Array.isArray(items) || items.length === 0) {
      return res.error('参数错误')
    }

    // 批量更新
    for (const item of items) {
      await db.query(
        'UPDATE redpack_activities SET sort_order = ? WHERE id = ?',
        [item.sortOrder, item.id]
      )
    }

    logger.info('批量更新排序成功:', { count: items.length })
    res.success(null, '更新成功')
  } catch (error) {
    logger.error('批量更新排序失败:', error)
    res.error('更新失败')
  }
}

/**
 * 删除红包活动
 */
async function deleteItem(req, res) {
  try {
    const { id } = req.params

    // 检查活动是否存在
    const [activity] = await db.query('SELECT * FROM redpack_activities WHERE id = ?', [id])
    if (!activity) {
      return res.error('活动不存在', -1, 404)
    }

    await db.query('DELETE FROM redpack_activities WHERE id = ?', [id])

    logger.info('删除红包活动成功:', { id })
    res.success(null, '删除成功')
  } catch (error) {
    logger.error('删除红包活动失败:', error)
    res.error('删除失败')
  }
}

module.exports = {
  getList,
  getDetail,
  create,
  update,
  updateSort,
  delete: deleteItem
}
