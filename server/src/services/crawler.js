// src/services/crawler.js - 爬虫服务
const db = require('../database/db')
const cron = require('node-cron')
const RedpackCrawler = require('../crawler/redpack')

class CrawlerService {
  constructor() {
    this.scheduledTasks = new Map() // 存储已调度的任务
  }

  /**
   * 初始化调度器
   */
  async init() {
    const tasks = await this.getActiveTasks()

    for (const task of tasks) {
      this.scheduleTask(task)
    }

    console.log(`✅ 爬虫调度器已启动，活跃任务数: ${this.scheduledTasks.size}`)
  }

  /**
   * 获取活跃任务
   */
  async getActiveTasks() {
    const tasks = await db.query(
      'SELECT * FROM crawler_tasks WHERE status = "active"'
    )
    return tasks
  }

  /**
   * 调度单个任务
   */
  scheduleTask(task) {
    const { id, cron_expression, type } = task

    try {
      // 验证 cron 表达式
      if (!cron.validate(cron_expression)) {
        console.error(`❌ 爬虫任务 ${task.name} 的 cron 表达式无效: ${cron_expression}`)
        return
      }

      const cronTask = cron.schedule(cron_expression, async () => {
        await this.executeTask(id)
      }, {
        scheduled: false
      })

      this.scheduledTasks.set(id, cronTask)
      cronTask.start()

      console.log(`📋 爬虫任务已调度: ${task.name} (${cron_expression})`)
    } catch (error) {
      console.error(`❌ 调度爬虫任务失败:`, error)
    }
  }

  /**
   * 执行爬虫任务
   */
  async executeTask(taskId) {
    const connection = await db.pool.getConnection()
    let logId

    try {
      // 获取任务信息
      const tasks = await db.query(
        'SELECT * FROM crawler_tasks WHERE id = ?',
        [taskId]
      )

      if (tasks.length === 0) {
        throw new Error('任务不存在')
      }

      const task = tasks[0]

      // 检查任务状态
      if (task.status !== 'active') {
        console.log(`⏸️ 任务 ${task.name} 未激活，跳过执行`)
        return
      }

      // 创建执行日志
      const [logResult] = await connection.query(
        'INSERT INTO crawler_logs (task_id, start_time, status) VALUES (?, NOW(), "running")',
        [taskId]
      )
      logId = logResult.insertId

      console.log(`🚀 开始执行爬虫任务: ${task.name}`)

      // 执行爬虫
      const crawler = this.getCrawler(task.type)
      const result = await crawler.run({
        sourceUrl: task.source_url,
        config: task.config
      })

      // 更新日志
      await connection.query(
        `UPDATE crawler_logs
         SET end_time = NOW(),
             status = 'success',
             items_fetched = ?,
             items_created = ?,
             items_updated = ?
         WHERE id = ?`,
        [result.fetched || 0, result.created || 0, result.updated || 0, logId]
      )

      // 更新任务统计
      await connection.query(
        `UPDATE crawler_tasks
         SET last_run_at = NOW(),
             success_count = success_count + 1
         WHERE id = ?`,
        [taskId]
      )

      console.log(`✅ 爬虫任务 ${task.name} 执行成功: 新增${result.created}条，更新${result.updated}条`)

    } catch (error) {
      console.error(`❌ 爬虫任务执行失败:`, error)

      await connection.query(
        `UPDATE crawler_logs
         SET end_time = NOW(),
             status = 'failed',
             error_message = ?
         WHERE id = ?`,
        [error.message, logId]
      )

      await connection.query(
        'UPDATE crawler_tasks SET fail_count = fail_count + 1 WHERE id = ?',
        [taskId]
      )

    } finally {
      connection.release()
    }
  }

  /**
   * 获取爬虫实例
   */
  getCrawler(type) {
    const crawlers = {
      'redpack': RedpackCrawler
    }
    return crawlers[type]
  }

  /**
   * 获取任务列表
   */
  async getList(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize

    const list = await db.query(
      `SELECT * FROM crawler_tasks
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    )

    const countResult = await db.query('SELECT COUNT(*) as total FROM crawler_tasks')

    return {
      list,
      total: countResult[0].total,
      page,
      pageSize
    }
  }

  /**
   * 获取任务详情
   */
  async getDetail(id) {
    const tasks = await db.query('SELECT * FROM crawler_tasks WHERE id = ?', [id])

    if (tasks.length === 0) {
      throw new Error('任务不存在')
    }

    return tasks[0]
  }

  /**
   * 创建任务
   */
  async create(data) {
    const { name, type, sourceUrl, cronExpression, config } = data

    // 验证 cron 表达式
    if (!cron.validate(cronExpression)) {
      throw new Error('Cron 表达式无效')
    }

    const result = await db.query(
      `INSERT INTO crawler_tasks (name, type, source_url, cron_expression, config)
       VALUES (?, ?, ?, ?, ?)`,
      [name, type, sourceUrl, cronExpression, JSON.stringify(config || {})]
    )

    // 获取创建的任务
    const tasks = await db.query('SELECT * FROM crawler_tasks WHERE id = ?', [result.insertId])

    // 如果状态是 active，立即调度
    if (tasks[0].status === 'active') {
      this.scheduleTask(tasks[0])
    }

    return tasks[0]
  }

  /**
   * 更新任务
   */
  async update(id, data) {
    const { name, sourceUrl, cronExpression, config, status } = data

    // 验证 cron 表达式
    if (cronExpression && !cron.validate(cronExpression)) {
      throw new Error('Cron 表达式无效')
    }

    // 暂停现有调度
    this.pauseTask(id)

    const updateFields = []
    const values = []

    if (name) {
      updateFields.push('name = ?')
      values.push(name)
    }
    if (sourceUrl) {
      updateFields.push('source_url = ?')
      values.push(sourceUrl)
    }
    if (cronExpression) {
      updateFields.push('cron_expression = ?')
      values.push(cronExpression)
    }
    if (config) {
      updateFields.push('config = ?')
      values.push(JSON.stringify(config))
    }
    if (status) {
      updateFields.push('status = ?')
      values.push(status)
    }

    values.push(id)

    await db.query(
      `UPDATE crawler_tasks SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    )

    // 获取更新后的任务
    const tasks = await db.query('SELECT * FROM crawler_tasks WHERE id = ?', [id])

    // 如果状态是 active，重新调度
    if (tasks[0].status === 'active') {
      this.scheduleTask(tasks[0])
    }

    return tasks[0]
  }

  /**
   * 删除任务
   */
  async delete(id) {
    // 暂停任务
    this.pauseTask(id)

    await db.query('DELETE FROM crawler_tasks WHERE id = ?', [id])
    return true
  }

  /**
   * 手动触发任务
   */
  async manualRun(id) {
    // 异步执行，不阻塞
    this.executeTask(id).catch(error => {
      console.error('手动触发任务失败:', error)
    })

    return { message: '任务已启动' }
  }

  /**
   * 暂停任务
   */
  pauseTask(id) {
    const task = this.scheduledTasks.get(id)
    if (task) {
      task.stop()
      this.scheduledTasks.delete(id)
    }
  }

  /**
   * 恢复任务
   */
  async resumeTask(id) {
    const tasks = await db.query('SELECT * FROM crawler_tasks WHERE id = ?', [id])

    if (tasks.length > 0 && tasks[0].status === 'active') {
      this.scheduleTask(tasks[0])
    }
  }

  /**
   * 获取执行日志
   */
  async getLogs(taskId, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize

    const list = await db.query(
      `SELECT * FROM crawler_logs
       WHERE task_id = ?
       ORDER BY start_time DESC
       LIMIT ? OFFSET ?`,
      [taskId, pageSize, offset]
    )

    const countResult = await db.query(
      'SELECT COUNT(*) as total FROM crawler_logs WHERE task_id = ?',
      [taskId]
    )

    return {
      list,
      total: countResult[0].total,
      page,
      pageSize
    }
  }
}

module.exports = new CrawlerService()
