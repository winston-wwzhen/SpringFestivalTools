#!/usr/bin/env node
// scripts/generate-api-key.js - API 密钥生成工具

const crypto = require('crypto')

/**
 * 生成 64 位随机密钥（Hex 格式）
 * @param {String} prefix 密钥前缀（用于标识环境）
 * @returns {String} 64 位密钥
 */
function generateApiKey(prefix = '') {
  // 生成 32 字节随机数，转换为 64 位 Hex 字符串
  const randomBytes = crypto.randomBytes(32).toString('hex')

  // 添加环境前缀便于识别
  return prefix ? `${prefix}_${randomBytes}` : randomBytes
}

/**
 * 生成所有环境的 API 密钥
 */
function generateAllKeys() {
  console.log('\n=================================')
  console.log('  小程序 API 密钥生成工具')
  console.log('=================================\n')

  const keys = {
    development: generateApiKey('dev'),
    test: generateApiKey('test'),
    production: generateApiKey('prod')
  }

  console.log('请在 .env 文件中添加以下配置：\n')
  console.log('# 小程序 API 密钥配置')
  console.log(`MINIPROGRAM_API_KEY_DEVELOPMENT=${keys.development}`)
  console.log(`MINIPROGRAM_API_KEY_TEST=${keys.test}`)
  console.log(`MINIPROGRAM_API_KEY_PRODUCTION=${keys.production}`)
  console.log(`MINIPROGRAM_ENV=test\n`)

  console.log('请在 config/index.js 的 ENV 配置中添加对应的 apiKey 字段：\n')
  Object.entries(keys).forEach(([env, key]) => {
    console.log(`${env}: {`)
    console.log(`  // ... 其他配置`)
    console.log(`  apiKey: '${key}'`)
    console.log(`}`)
  })

  console.log('\n=================================')
  console.log('  配置说明')
  console.log('=================================\n')
  console.log('环境变量说明：')
  console.log('  MINIPROGRAM_ENV - 当前激活的环境 (development/test/production)')
  console.log('  MINIPROGRAM_API_KEY_DEVELOPMENT - 开发环境密钥')
  console.log('  MINIPROGRAM_API_KEY_TEST - 测试环境密钥')
  console.log('  MINIPROGRAM_API_KEY_PRODUCTION - 生产环境密钥\n')

  console.log('使用方式：')
  console.log('  1. 将上述配置复制到 server/.env 文件')
  console.log('  2. 将 apiKey 字段添加到小程序端 config/index.js')
  console.log('  3. 确保服务端和小程序端的 MINIPROGRAM_ENV 一致\n')

  console.log('安全提示：')
  console.log('  1. 请妥善保管生成的密钥，不要泄露到版本控制系统')
  console.log('  2. .env 文件已在 .gitignore 中，不会被提交')
  console.log('  3. 生产环境密钥泄露后请立即更换')
  console.log('  4. 建议定期轮换密钥（每 3-6 个月）\n')

  return keys
}

// 如果直接运行此脚本
if (require.main === module) {
  generateAllKeys()
}

module.exports = { generateApiKey, generateAllKeys }
