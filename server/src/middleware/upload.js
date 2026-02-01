// src/middleware/upload.js - 文件上传中间件
const multer = require('multer')

// 配置存储
const storage = multer.memoryStorage()

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只允许图片
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('只支持图片文件'))
  }
}

// 创建上传实例
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  }
})

module.exports = upload
