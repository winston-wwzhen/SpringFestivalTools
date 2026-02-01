// src/app.js - 后端服务入口
const express = require('express')
const cors = require('cors')
const path = require('path')

// 加载环境变量（从server目录）
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// 小程序端路由
const redpackRoutes = require('./routes/redpack')
const galaRoutes = require('./routes/gala')
const kinshipRoutes = require('./routes/kinship')
const emoticonRoutes = require('./routes/emoticon')
const commonRoutes = require('./routes/common')

// 管理端路由
const authRoutes = require('./routes/auth')
const auditRoutes = require('./routes/audit')
const crawlerRoutes = require('./routes/crawler')

// 爬虫调度器
const crawlerService = require('./services/crawler')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// 统一响应格式
app.use((req, res, next) => {
  res.success = (data, message = 'success') => {
    res.json({
      code: 0,
      message,
      data
    })
  }

  res.error = (message = 'error', code = -1, statusCode = 200) => {
    res.status(statusCode).json({
      code,
      message,
      data: null
    })
  }

  next()
})

// ============================================================
// 小程序端 API (公开访问)
// ============================================================
app.use('/api/redpack', redpackRoutes)
app.use('/api/gala', galaRoutes)
app.use('/api/kinship', kinshipRoutes)
app.use('/api/emoticon', emoticonRoutes)
app.use('/api/common', commonRoutes)

// ============================================================
// 管理端 API (需要认证)
// ============================================================
app.use('/admin/api/auth', authRoutes)
app.use('/admin/api/audit', auditRoutes)
app.use('/admin/api/crawler', crawlerRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.success({ status: 'ok', timestamp: Date.now() })
})

// 404 处理
app.use((req, res) => {
  res.error('API not found', -1, 404)
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.error(err.message || 'Internal server error', -1, 500)
})

// 启动服务器
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📝 Health check: http://localhost:${PORT}/health`)
  console.log(`📱 Mini Program API: http://localhost:${PORT}/api`)
  console.log(`🔐 Admin API: http://localhost:${PORT}/admin/api`)

  // 初始化爬虫调度器
  try {
    await crawlerService.init()
  } catch (error) {
    console.error('❌ 爬虫调度器初始化失败:', error)
  }
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

module.exports = app
