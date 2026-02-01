// src/middleware/auth.js - 认证中间件
const jwt = require('jsonwebtoken')

/**
 * 生成 JWT Token
 * @param {Object} payload - 载荷数据
 * @returns {String} Token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  })
}

/**
 * 验证 JWT Token
 * @param {String} token - Token
 * @returns {Object|null} 解码后的载荷
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch (error) {
    return null
  }
}

/**
 * 认证中间件 - 验证管理员身份
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.error('未登录，请先登录', -2, 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.error('Token 无效或已过期', -2, 401)
    }

    // 查询管理员信息
    const db = require('../database/db')
    const [admins] = await db.query(
      'SELECT id, username, real_name, role, status FROM admin_users WHERE id = ? AND status = "active"',
      [decoded.id]
    )

    if (admins.length === 0) {
      return res.error('管理员不存在或已被禁用', -2, 401)
    }

    // 将管理员信息附加到请求对象
    req.admin = admins[0]
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.error('认证失败', -2, 401)
  }
}

/**
 * 角色权限中间件 - 验证管理员角色
 * @param {Array<String>} allowedRoles - 允许的角色列表
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.error('未登录', -2, 401)
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.error('权限不足', -3, 403)
    }

    next()
  }
}

/**
 * 可选认证中间件 - 如果有 token 则验证，没有则跳过
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const decoded = verifyToken(token)

      if (decoded) {
        const db = require('../database/db')
        const [admins] = await db.query(
          'SELECT id, username, real_name, role, status FROM admin_users WHERE id = ? AND status = "active"',
          [decoded.id]
        )

        if (admins.length > 0) {
          req.admin = admins[0]
        }
      }
    }

    next()
  } catch (error) {
    // 忽略错误，继续执行
    next()
  }
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  roleMiddleware,
  optionalAuthMiddleware
}
