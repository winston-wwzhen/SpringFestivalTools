// src/crawler/redpack.js - 红包爬虫
const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../database/db')

class RedpackCrawler {
  /**
   * 执行爬虫
   * @param {Object} options - 爬虫配置
   * @returns {Object} - 爬取结果
   */
  async run(options) {
    const { sourceUrl, config } = options

    try {
      console.log(`🔍 开始爬取: ${sourceUrl}`)

      // 1. 获取页面内容
      const response = await axios.get(sourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      })

      const $ = cheerio.load(response.data)

      // 2. 解析数据（根据实际页面结构调整选择器）
      const items = []
      const selectors = config?.selectors || {}

      // 默认选择器配置（可根据实际网站调整）
      const defaultSelectors = {
        container: '.activity-item, .redpack-item, .event-item',
        platform: '.platform, .source, .app-name',
        title: '.title, .name, .event-title',
        description: '.desc, .description, .content',
        rules: '.rules, .rule-list',
        startTime: '.start-time, .begin-time, [data-start]',
        endTime: '.end-time, .finish-time, [data-end]',
        link: 'a[href]'
      }

      const s = { ...defaultSelectors, ...selectors }

      // 查找所有活动项
      $(s.container).each((i, el) => {
        const platform = $(el).find(s.platform).text().trim() ||
                         $(el).attr('data-platform') ||
                         config?.defaultPlatform ||
                         '未知平台'

        const title = $(el).find(s.title).text().trim()

        if (!title) return

        items.push({
          platform,
          title,
          description: $(el).find(s.description).text().trim(),
          rules: $(el).find(s.rules).text().trim(),
          start_time: this.parseDateTime($(el).find(s.startTime).attr('datetime') ||
                                        $(el).find(s.startTime).text().trim()),
          end_time: this.parseDateTime($(el).find(s.endTime).attr('datetime') ||
                                      $(el).find(s.endTime).text().trim()),
          source_url: $(el).find(s.link).attr('href') || sourceUrl,
          status: 'active',
          review_status: 'pending' // 默认待审核
        })
      })

      console.log(`📊 解析到 ${items.length} 条数据`)

      // 3. 存入数据库
      let created = 0
      let updated = 0

      for (const item of items) {
        try {
          // 检查是否已存在（根据平台和标题判断）
          const [existing] = await db.query(
            'SELECT id FROM redpack_activities WHERE platform = ? AND title = ?',
            [item.platform, item.title]
          )

          if (existing.length > 0) {
            // 更新已存在的记录
            await db.query(
              `UPDATE redpack_activities
               SET description = ?, rules = ?, start_time = ?, end_time = ?,
                   source_url = ?, review_status = 'pending'
               WHERE id = ?`,
              [item.description, item.rules, item.start_time, item.end_time,
               item.source_url, existing[0].id]
            )
            updated++
          } else {
            // 新增记录
            await db.query('INSERT INTO redpack_activities SET ?', [item])
            created++
          }
        } catch (err) {
          console.error(`❌ 保存数据失败: ${item.title}`, err.message)
        }
      }

      console.log(`✅ 爬取完成: 新增 ${created} 条，更新 ${updated} 条`)

      return {
        fetched: items.length,
        created,
        updated
      }

    } catch (error) {
      console.error('❌ 爬虫执行错误:', error.message)
      throw new Error(`爬虫执行失败: ${error.message}`)
    }
  }

  /**
   * 解析日期时间
   * @param {String} dateTimeStr - 日期时间字符串
   * @returns {String|null} - 格式化的日期时间
   */
  parseDateTime(dateTimeStr) {
    if (!dateTimeStr) return null

    try {
      const date = new Date(dateTimeStr)
      if (isNaN(date.getTime())) return null

      return date.toISOString().slice(0, 19).replace('T', ' ')
    } catch {
      return null
    }
  }
}

module.exports = new RedpackCrawler()
