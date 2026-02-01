// src/services/auth.js - 认证服务
const db = require('../database/db')
const bcrypt = require('bcrypt')
const { generateToken } = require('../middleware/auth')

class AuthService {
  /**
   * 管理员登录
   */
  async login(username, password, ip) {
    // 查询管理员
    const [admins] = await db.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    )

    if (admins.length === 0) {
      throw new Error('用户名或密码错误')
    }

    const admin = admins[0]

    // 检查账号状态
    if (admin.status === 'disabled') {
      throw new Error('账号已被禁用')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      throw new Error('用户名或密码错误')
    }

    // 更新最后登录信息
    await db.query(
      'UPDATE admin_users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?',
      [ip, admin.id]
    )

    // 生成 token
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      role: admin.role
    })

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = admin

    return {
      token,
      userInfo
    }
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(adminId) {
    const [admins] = await db.query(
      'SELECT id, username, real_name, role, status, last_login_at, created_at FROM admin_users WHERE id = ?',
      [adminId]
    )

    if (admins.length === 0) {
      throw new Error('管理员不存在')
    }

    return admins[0]
  }

  /**
   * 修改密码
   */
  async changePassword(adminId, oldPassword, newPassword) {
    // 获取管理员信息
    const [admins] = await db.query(
      'SELECT password FROM admin_users WHERE id = ?',
      [adminId]
    )

    if (admins.length === 0) {
      throw new Error('管理员不存在')
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, admins[0].password)
    if (!isPasswordValid) {
      throw new Error('原密码错误')
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新密码
    await db.query(
      'UPDATE admin_users SET password = ? WHERE id = ?',
      [hashedPassword, adminId]
    )

    return true
  }

  /**
   * 获取管理员列表
   */
  async getList(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize

    const [list] = await db.query(
      `SELECT id, username, real_name, role, status, last_login_at, created_at
       FROM admin_users
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    )

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM admin_users')

    return {
      list,
      total: countResult[0].total,
      page,
      pageSize
    }
  }

  /**
   * 创建管理员
   */
  async create(data) {
    const { username, password, realName, role = 'admin' } = data

    // 检查用户名是否已存在
    const [existing] = await db.query('SELECT id FROM admin_users WHERE username = ?', [username])
    if (existing.length > 0) {
      throw new Error('用户名已存在')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建管理员
    const [result] = await db.query(
      'INSERT INTO admin_users (username, password, real_name, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, realName, role]
    )

    return {
      id: result.insertId,
      username,
      realName,
      role
    }
  }

  /**
   * 更新管理员
   */
  async update(id, data) {
    const { realName, role, status } = data

    await db.query(
      'UPDATE admin_users SET real_name = ?, role = ?, status = ? WHERE id = ?',
      [realName, role, status, id]
    )

    return true
  }

  /**
   * 删除管理员
   */
  async delete(id) {
    await db.query('DELETE FROM admin_users WHERE id = ?', [id])
    return true
  }
}

module.exports = new AuthService()
