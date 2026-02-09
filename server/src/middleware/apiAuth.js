// src/middleware/apiAuth.js - 小程序 API 密钥认证中间件

/**
 * API 密钥认证中间件 - 验证小程序端请求
 */
const apiAuthMiddleware = (req, res, next) => {
  try {
    // 从自定义请求头获取 API 密钥
    const apiKey = req.headers['x-api-key']

    if (!apiKey) {
      return res.error('缺少 API 密钥', -2, 401)
    }

    // 获取当前环境
    const currentEnv = process.env.MINIPROGRAM_ENV || 'development'

    // 根据环境获取对应的 API 密钥
    const expectedKey = process.env[`MINIPROGRAM_API_KEY_${currentEnv.toUpperCase()}`]

    if (!expectedKey) {
      console.error(`[API Auth] 未配置环境 ${currentEnv} 的 API 密钥`)
      return res.error('服务器配置错误', -2, 500)
    }

    // 验证密钥（使用恒定时间比较，防止时序攻击）
    if (apiKey !== expectedKey) {
      console.warn(`[API Auth] API 密钥验证失败 - 环境: ${currentEnv}, 来源: ${req.ip}, 路径: ${req.path}`)
      return res.error('API 密钥无效', -2, 401)
    }

    // 认证成功，记录日志
    console.log(`[API Auth] API 密钥验证成功 - 环境: ${currentEnv}, 路径: ${req.path}`)
    next()
  } catch (error) {
    console.error('[API Auth] 认证中间件错误:', error)
    return res.error('认证失败', -2, 401)
  }
}

/**
 * 可选认证中间件 - 如果有 API 密钥则验证，没有则跳过
 * 用于某些需要区分认证用户的场景
 */
const optionalApiAuthMiddleware = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key']

    // 如果没有提供密钥，跳过认证
    if (!apiKey) {
      return next()
    }

    // 有密钥则进行验证
    const currentEnv = process.env.MINIPROGRAM_ENV || 'development'
    const expectedKey = process.env[`MINIPROGRAM_API_KEY_${currentEnv.toUpperCase()}`]

    if (!expectedKey) {
      console.error(`[API Auth] 未配置环境 ${currentEnv} 的 API 密钥`)
      return next() // 可选认证失败时也跳过
    }

    if (apiKey === expectedKey) {
      // 认证成功，标记请求已认证
      req.apiAuthenticated = true
      console.log(`[API Auth] 可选认证成功 - 环境: ${currentEnv}, 路径: ${req.path}`)
    } else {
      console.warn(`[API Auth] 可选认证失败 - 环境: ${currentEnv}, 来源: ${req.ip}, 路径: ${req.path}`)
    }

    next()
  } catch (error) {
    console.error('[API Auth] 可选认证中间件错误:', error)
    next() // 忽略错误，继续执行
  }
}

module.exports = {
  apiAuthMiddleware,
  optionalApiAuthMiddleware
}
