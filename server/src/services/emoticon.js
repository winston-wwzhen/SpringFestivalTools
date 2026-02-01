// src/services/emoticon.js - 表情包服务
const db = require('../database/db')

class EmoticonService {
  // 获取分类列表
  async getCategories() {
    const sql = 'SELECT * FROM emoticon_categories ORDER BY sort ASC'
    const rows = await db.query(sql)
    return rows
  }

  // 获取表情包列表（小程序端，仅返回已审核数据）
  async getList(params) {
    const { page, pageSize, category } = params
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM emoticons WHERE review_status = "approved"'
    const queryParams = []

    if (category) {
      sql += ' AND category_id = ?'
      queryParams.push(category)
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    queryParams.push(pageSize, offset)

    const rows = await db.query(sql, queryParams)

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM emoticons WHERE review_status = "approved"'
    const countParams = []

    if (category) {
      countSql += ' AND category_id = ?'
      countParams.push(category)
    }

    const countResult = await db.query(countSql, countParams)

    return {
      list: rows,
      total: countResult[0].total,
      page,
      pageSize
    }
  }

  // 获取表情包详情（小程序端，仅返回已审核数据）
  async getDetail(id) {
    const sql = 'SELECT * FROM emoticons WHERE id = ? AND review_status = "approved"'
    const rows = await db.query(sql, [id])

    if (rows.length === 0) {
      throw new Error('表情包不存在')
    }

    // 增加浏览次数
    await db.query('UPDATE emoticons SET views = views + 1 WHERE id = ?', [id])

    return rows[0]
  }

  // 获取表情包数量（小程序端，仅统计已审核数据）
  async getCount() {
    const sql = 'SELECT COUNT(*) as count FROM emoticons WHERE review_status = "approved"'
    const rows = await db.query(sql)
    return rows[0].count
  }

  // ============================================
  // 管理端方法
  // ============================================

  // 管理端 - 获取列表（支持状态筛选）
  async adminGetList(params) {
    const { page, pageSize, category, reviewStatus } = params
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM emoticons WHERE 1=1'
    const queryParams = []

    if (category) {
      sql += ' AND category_id = ?'
      queryParams.push(category)
    }

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      queryParams.push(reviewStatus)
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    queryParams.push(pageSize, offset)

    const rows = await db.query(sql, queryParams)

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM emoticons WHERE 1=1'
    const countParams = []

    if (category) {
      countSql += ' AND category_id = ?'
      countParams.push(category)
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

  // 管理端 - 创建表情包
  async create(data) {
    const { category_id, title, image_url, tags } = data

    const result = await db.query(
      `INSERT INTO emoticons (category_id, title, image_url, tags, review_status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [category_id, title, image_url, tags]
    )

    return { id: result.insertId }
  }

  // 管理端 - 更新表情包
  async update(id, data) {
    const { category_id, title, image_url, tags } = data

    await db.query(
      `UPDATE emoticons
       SET category_id = ?, title = ?, image_url = ?, tags = ?
       WHERE id = ?`,
      [category_id, title, image_url, tags, id]
    )

    return true
  }

  // 管理端 - 删除表情包
  async delete(id) {
    await db.query('DELETE FROM emoticons WHERE id = ?', [id])
    return true
  }

  // 管理端 - 创建分类
  async createCategory(data) {
    const { name, icon, sort } = data

    const result = await db.query(
      'INSERT INTO emoticon_categories (name, icon, sort) VALUES (?, ?, ?)',
      [name, icon, sort || 0]
    )

    return { id: result.insertId }
  }

  // 管理端 - 更新分类
  async updateCategory(id, data) {
    const { name, icon, sort } = data

    await db.query(
      'UPDATE emoticon_categories SET name = ?, icon = ?, sort = ? WHERE id = ?',
      [name, icon, sort, id]
    )

    return true
  }

  // 管理端 - 删除分类
  async deleteCategory(id) {
    await db.query('DELETE FROM emoticon_categories WHERE id = ?', [id])
    return true
  }
}

module.exports = new EmoticonService()
