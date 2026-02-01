// src/services/kinship.js - 亲戚称呼服务
const db = require('../database/db')

class KinshipService {
  // 称呼映射表（简化版）
  relationMap = {
    '父': { male: '爸爸', female: '爸爸' },
    '母': { male: '妈妈', female: '妈妈' },
    '父父': { male: '爷爷', female: '爷爷' },
    '父母': { male: '奶奶', female: '奶奶' },
    '母父': { male: '外公', female: '外公' },
    '母母': { male: '外婆', female: '外婆' },
    '父兄': { male: '伯伯', female: '伯母' },
    '父弟': { male: '叔叔', female: '婶婶' },
    '父姐': { male: '姑姑', female: '姑姑' },
    '父妹': { male: '姑姑', female: '姑姑' },
    '母兄': { male: '舅舅', female: '舅妈' },
    '母弟': { male: '舅舅', female: '舅妈' },
    '母姐': { male: '姨妈', female: '姨妈' },
    '母妹': { male: '姨妈', female: '姨妈' },
  }

  // 计算称呼（小程序端）
  async calculate(params) {
    const { gender, relation } = params

    // 简化版实现，实际需要更复杂的关系计算逻辑
    const result = this.relationMap[relation]

    if (!result) {
      // 如果没有预设关系，返回通用称呼
      return {
        relation,
        title: gender === 'male' ? '亲戚' : '亲戚',
        description: '该关系较为复杂，建议详细描述'
      }
    }

    return {
      relation,
      title: result[gender] || result.male,
      description: this.getDescription(relation)
    }
  }

  // 获取关系描述
  getDescription(relation) {
    const descriptions = {
      '父': '生身之父',
      '母': '生身之母',
      '父父': '父亲的父亲',
      '父母': '父亲的母亲',
      '母父': '母亲的父亲',
      '母母': '母亲的母亲',
      '父兄': '父亲的哥哥',
      '父弟': '父亲的弟弟',
      '父姐': '父亲的姐姐',
      '父妹': '父亲的妹妹',
      '母兄': '母亲的哥哥',
      '母弟': '母亲的弟弟',
      '母姐': '母亲的姐姐',
      '母妹': '母亲的妹妹',
    }
    return descriptions[relation] || '亲戚关系'
  }

  // 搜索称呼（小程序端，仅返回已审核数据）
  async search(keyword) {
    const sql = 'SELECT * FROM kinship_terms WHERE review_status = "approved" AND (title LIKE ? OR pinyin LIKE ?)'
    const searchTerm = `%${keyword}%`
    const rows = await db.query(sql, [searchTerm, searchTerm])
    return rows
  }

  // 获取关系图
  async getChart() {
    // 返回关系图数据结构
    return {
      levels: [
        { name: '祖辈', relations: ['爷爷', '奶奶', '外公', '外婆'] },
        { name: '父辈', relations: ['爸爸', '妈妈', '伯伯', '叔叔', '姑姑', '舅舅', '姨妈'] },
        { name: '同辈', relations: ['哥哥', '姐姐', '弟弟', '妹妹', '堂兄', '堂妹', '表兄', '表妹'] },
        { name: '子辈', relations: ['儿子', '女儿', '侄子', '侄女', '外甥', '外甥女'] }
      ]
    }
  }

  // ============================================
  // 管理端方法
  // ============================================

  // 管理端 - 获取列表（支持状态筛选）
  async adminGetList(params) {
    const { page, pageSize, reviewStatus } = params
    const offset = (page - 1) * pageSize

    let sql = 'SELECT * FROM kinship_terms WHERE 1=1'
    const queryParams = []

    if (reviewStatus) {
      sql += ' AND review_status = ?'
      queryParams.push(reviewStatus)
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    queryParams.push(pageSize, offset)

    const rows = await db.query(sql, queryParams)

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM kinship_terms WHERE 1=1'
    const countParams = []

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

  // 管理端 - 创建称呼
  async create(data) {
    const { title, pinyin, relation, description } = data

    const result = await db.query(
      `INSERT INTO kinship_terms (title, pinyin, relation, description, review_status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [title, pinyin, relation, description]
    )

    return { id: result.insertId }
  }

  // 管理端 - 更新称呼
  async update(id, data) {
    const { title, pinyin, relation, description } = data

    await db.query(
      `UPDATE kinship_terms
       SET title = ?, pinyin = ?, relation = ?, description = ?
       WHERE id = ?`,
      [title, pinyin, relation, description, id]
    )

    return true
  }

  // 管理端 - 删除称呼
  async delete(id) {
    await db.query('DELETE FROM kinship_terms WHERE id = ?', [id])
    return true
  }
}

module.exports = new KinshipService()
