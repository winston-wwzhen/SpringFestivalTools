// src/controllers/auth.js - 认证控制器
const authService = require('../services/auth')

class AuthController {
  // 管理员登录
  async login(req, res) {
    try {
      const { username, password } = req.body
      const ip = req.ip || req.connection.remoteAddress || 'unknown'

      if (!username || !password) {
        return res.error('用户名和密码不能为空')
      }

      const result = await authService.login(username, password, ip)
      res.success(result, '登录成功')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取当前用户信息
  async getProfile(req, res) {
    try {
      const profile = await authService.getProfile(req.admin.id)
      res.success(profile)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 修改密码
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body

      if (!oldPassword || !newPassword) {
        return res.error('请输入原密码和新密码')
      }

      if (newPassword.length < 6) {
        return res.error('新密码长度不能少于6位')
      }

      await authService.changePassword(req.admin.id, oldPassword, newPassword)
      res.success(null, '密码修改成功')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 获取管理员列表
  async getList(req, res) {
    try {
      const { page = 1, pageSize = 20 } = req.query
      const result = await authService.getList(
        parseInt(page),
        parseInt(pageSize)
      )
      res.success(result)
    } catch (error) {
      res.error(error.message)
    }
  }

  // 创建管理员
  async create(req, res) {
    try {
      const { username, password, realName, role } = req.body

      if (!username || !password) {
        return res.error('用户名和密码不能为空')
      }

      if (password.length < 6) {
        return res.error('密码长度不能少于6位')
      }

      const result = await authService.create({ username, password, realName, role })
      res.success(result, '创建成功')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 更新管理员
  async update(req, res) {
    try {
      const { id } = req.params
      const { realName, role, status } = req.body

      await authService.update(id, { realName, role, status })
      res.success(null, '更新成功')
    } catch (error) {
      res.error(error.message)
    }
  }

  // 删除管理员
  async delete(req, res) {
    try {
      const { id } = req.params

      // 不能删除自己
      if (parseInt(id) === req.admin.id) {
        return res.error('不能删除自己的账号')
      }

      await authService.delete(id)
      res.success(null, '删除成功')
    } catch (error) {
      res.error(error.message)
    }
  }
}

module.exports = new AuthController()
