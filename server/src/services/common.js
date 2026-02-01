// src/services/common.js - 通用服务
const fs = require('fs').promises
const path = require('path')

class CommonService {
  // 获取每日推荐
  async getDaily() {
    // 这里可以接入推荐算法，暂时返回模拟数据
    return {
      items: [
        {
          id: 1,
          icon: '🧧',
          title: '微信五福红包',
          description: '集五福活动已经开始，快来集福卡吧',
          category: '红包活动',
          type: 'primary',
          time: '今天 10:00'
        },
        {
          id: 2,
          icon: '📺',
          title: '央视春晚节目单',
          description: '2026年央视春晚完整节目单已公布',
          category: '春晚',
          type: 'secondary',
          time: '昨天 18:00'
        },
        {
          id: 3,
          icon: '🧧',
          title: '支付宝集五福',
          description: 'AR扫福、森林浇水，多种方式集福卡',
          category: '红包活动',
          type: 'primary',
          time: '2天前'
        }
      ]
    }
  }

  // 获取轮播图
  async getBanners() {
    return {
      items: [
        {
          id: 1,
          image: 'https://example.com/banner1.jpg',
          title: '春节红包攻略',
          link: '/pages/redpack/list/index'
        },
        {
          id: 2,
          image: 'https://example.com/banner2.jpg',
          title: '春晚节目单',
          link: '/pages/gala/platforms/index'
        },
        {
          id: 3,
          image: 'https://example.com/banner3.jpg',
          title: '拜年称呼指南',
          link: '/pages/kinship/index/index'
        }
      ]
    }
  }

  // 保存图片
  async saveImage(file) {
    const uploadDir = path.join(__dirname, '../../uploads')

    // 确保上传目录存在
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`
    const filepath = path.join(uploadDir, filename)

    // 保存文件
    await fs.writeFile(filepath, file.buffer)

    // 返回文件URL
    return {
      url: `/uploads/${filename}`,
      filename
    }
  }
}

module.exports = new CommonService()
