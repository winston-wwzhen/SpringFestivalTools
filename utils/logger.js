// utils/logger.js - 统一日志工具
const app = getApp()

// 开发环境检测
const isDev = typeof getApp === 'function' && getApp().globalData?.isDev !== false

/**
 * 日志级别枚举
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
}

// 当前日志级别（生产环境默认只显示 ERROR）
let currentLevel = isDev ? LogLevel.DEBUG : LogLevel.ERROR

/**
 * 设置日志级别
 */
function setLevel(level) {
  if (typeof level === 'string') {
    level = LogLevel[level.toUpperCase()] || LogLevel.INFO
  }
  currentLevel = level
}

/**
 * 格式化日志输出
 */
function formatLog(type, args) {
  const timestamp = new Date().toLocaleTimeString()
  const prefix = `[${timestamp}][${type}]`

  if (args.length === 1 && typeof args[0] === 'object') {
    return [prefix, args[0]]
  }
  return [prefix, ...args]
}

/**
 * 日志输出函数
 */
function log(level, levelName, args) {
  if (level < currentLevel) return

  const formatted = formatLog(levelName, args)

  switch (level) {
    case LogLevel.DEBUG:
    case LogLevel.INFO:
      console.log(...formatted)
      break
    case LogLevel.WARN:
      console.warn(...formatted)
      break
    case LogLevel.ERROR:
      console.error(...formatted)
      break
  }
}

/**
 * 导出的日志API
 */
const logger = {
  // 设置日志级别
  setLevel,

  // 开发日志
  debug(...args) {
    log(LogLevel.DEBUG, 'DEBUG', args)
  },

  // 信息日志
  info(...args) {
    log(LogLevel.INFO, 'INFO', args)
  },

  // 警告日志
  warn(...args) {
    log(LogLevel.WARN, 'WARN', args)
  },

  // 错误日志（始终显示）
  error(...args) {
    log(LogLevel.ERROR, 'ERROR', args)
  },

  // 条件日志
  assert(condition, ...args) {
    if (!condition) {
      this.error('Assertion failed:', ...args)
    }
  }
}

module.exports = logger
