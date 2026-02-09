// config/index.js - 小程序配置文件

const ENV = {
  // 开发环境
  development: {
    serverUrl: 'http://localhost:3000/api',
    isDev: true,
    apiKey: 'dev_f5b9b723bd0ae0c52070dc04c5bc067097a96519e517e6e7cbc4fa20d86d2b0f'
  },
  // 测试环境
  test: {
    serverUrl: 'http://49.234.120.81/api',
    isDev: false,
    apiKey: 'test_bdd6cdd098946e472fa293a58a38d6e8f12da8b850cea42e9abc958f535e61d6'
  },
  // 生产环境
  production: {
    serverUrl: 'https://api.spring-festival.com/api',
    isDev: false,
    apiKey: 'prod_af7c5df138a2f77990b17268b73f7ae1289707b266f9d013b1bca6f277e5e9dd'
  }
}

// 当前环境（可通过修改此处切换）
const CURRENT_ENV = 'production' // development | test | production

module.exports = {
  // 当前环境配置
  ...ENV[CURRENT_ENV],
  
  // 常量定义
  CONSTANTS: {
    // 缓存时间（毫秒）
    CACHE_TTL: {
      SHORT: 5 * 60 * 1000,      // 5分钟
      MEDIUM: 30 * 60 * 1000,    // 30分钟
      LONG: 24 * 60 * 60 * 1000  // 24小时
    },
    
    // 请求超时时间
    TIMEOUT: {
      DEFAULT: 30000,  // 30秒
      LONG: 60000      // 60秒
    },
    
    // 分页配置
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 20,
      MAX_LIMIT: 50
    }
  },
  
  // 春节日期配置（每年更新）
  SPRING_FESTIVAL_DATES: {
    2025: '2025-01-29',
    2026: '2026-02-17',
    2027: '2027-02-06'
  }
}
