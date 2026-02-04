// src/database/db.js - 数据库连接
const mysql = require('mysql2/promise')

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'spring_festival_guide',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// 查询方法
const query = async (sql, params = []) => {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.query(sql, params)
    connection.release()
    return rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// 初始化数据库表
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection()

    // ============================================
    // 新增表 - 管理员表
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
        password VARCHAR(255) NOT NULL COMMENT '密码(bcrypt)',
        real_name VARCHAR(50) COMMENT '真实姓名',
        role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin' COMMENT '角色',
        status ENUM('active', 'disabled') DEFAULT 'active' COMMENT '状态',
        last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
        last_login_ip VARCHAR(50) COMMENT '最后登录IP',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_admin_username (username),
        INDEX idx_admin_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表'
    `)

    // ============================================
    // 新增表 - 审核日志表
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL COMMENT '管理员ID',
        resource_type ENUM('redpack', 'gala_platform', 'gala_program', 'emoticon', 'kinship') NOT NULL COMMENT '资源类型',
        resource_id INT NOT NULL COMMENT '资源ID',
        action ENUM('approve', 'reject', 'delete', 'edit') NOT NULL COMMENT '操作类型',
        old_status VARCHAR(20) COMMENT '原状态',
        new_status VARCHAR(20) COMMENT '新状态',
        reason TEXT COMMENT '审核理由/备注',
        ip_address VARCHAR(50) COMMENT '操作IP',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_audit_resource (resource_type, resource_id),
        INDEX idx_audit_admin (admin_id),
        INDEX idx_audit_time (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审核日志表'
    `)

    // ============================================
    // 新增表 - 爬虫任务表
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS crawler_tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL COMMENT '任务名称',
        type ENUM('redpack', 'gala', 'emoticon', 'kinship') NOT NULL COMMENT '爬取类型',
        source_url VARCHAR(500) COMMENT '源地址',
        config JSON COMMENT '爬虫配置',
        cron_expression VARCHAR(100) COMMENT 'Cron表达式',
        status ENUM('active', 'paused', 'disabled') DEFAULT 'active' COMMENT '任务状态',
        last_run_at TIMESTAMP NULL COMMENT '最后运行时间',
        next_run_at TIMESTAMP NULL COMMENT '下次运行时间',
        success_count INT DEFAULT 0 COMMENT '成功次数',
        fail_count INT DEFAULT 0 COMMENT '失败次数',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='爬虫任务表'
    `)

    // ============================================
    // 新增表 - 爬虫执行记录表
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS crawler_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL COMMENT '任务ID',
        start_time TIMESTAMP NOT NULL COMMENT '开始时间',
        end_time TIMESTAMP NULL COMMENT '结束时间',
        status ENUM('running', 'success', 'failed') DEFAULT 'running' COMMENT '执行状态',
        items_fetched INT DEFAULT 0 COMMENT '抓取数量',
        items_created INT DEFAULT 0 COMMENT '新增数量',
        items_updated INT DEFAULT 0 COMMENT '更新数量',
        error_message TEXT COMMENT '错误信息',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_crawler_task (task_id),
        INDEX idx_crawler_status (status),
        INDEX idx_crawler_time (start_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='爬虫执行记录表'
    `)

    // ============================================
    // 修改现有表 - 添加审核状态字段
    // ============================================

    // 红包活动表 - 添加审核状态
    await connection.query(`
      ALTER TABLE redpack_activities
      ADD COLUMN IF NOT EXISTS review_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态' AFTER status,
      ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL COMMENT '审核时间' AFTER review_status,
      ADD COLUMN IF NOT EXISTS reviewed_by INT NULL COMMENT '审核人ID' AFTER reviewed_at,
      ADD COLUMN IF NOT EXISTS reviewer_note TEXT COMMENT '审核备注' AFTER reviewed_by,
      ADD INDEX IF NOT EXISTS idx_review_status (review_status)
    `)

    // 春晚平台表 - 添加审核状态
    await connection.query(`
      ALTER TABLE gala_platforms
      ADD COLUMN IF NOT EXISTS review_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态' AFTER description,
      ADD COLUMN IF NOT EXISTS source_url VARCHAR(500) COMMENT '数据来源' AFTER review_status,
      ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL COMMENT '审核时间' AFTER source_url,
      ADD COLUMN IF NOT EXISTS reviewed_by INT NULL COMMENT '审核人ID' AFTER reviewed_at,
      ADD INDEX IF NOT EXISTS idx_review_status (review_status)
    `)

    // 春晚节目表 - 添加审核状态
    await connection.query(`
      ALTER TABLE gala_programs
      ADD COLUMN IF NOT EXISTS review_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态' AFTER order_num,
      ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL COMMENT '审核时间',
      ADD INDEX IF NOT EXISTS idx_review_status (review_status)
    `)

    // 表情包表 - 添加审核状态
    await connection.query(`
      ALTER TABLE emoticons
      ADD COLUMN IF NOT EXISTS review_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态' AFTER downloads,
      ADD COLUMN IF NOT EXISTS source_url VARCHAR(500) COMMENT '数据来源' AFTER review_status,
      ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL COMMENT '审核时间',
      ADD COLUMN IF NOT EXISTS reviewed_by INT NULL COMMENT '审核人ID',
      ADD INDEX IF NOT EXISTS idx_review_status (review_status)
    `)

    // ============================================
    // 新增表 - 亲戚称呼表
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kinship_terms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL COMMENT '称呼',
        gender ENUM('male', 'female') NOT NULL COMMENT '性别',
        category VARCHAR(50) COMMENT '分类',
        relation_code VARCHAR(100) COMMENT '关系代码',
        description TEXT COMMENT '说明',
        usage_example VARCHAR(200) COMMENT '使用示例',
        region VARCHAR(50) COMMENT '地区',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_kinship_name (name),
        INDEX idx_kinship_gender (gender),
        INDEX idx_kinship_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='亲戚称呼表'
    `)

    // ============================================
    // 创建默认管理员账号 (如果不存在)
    // ============================================
    const bcrypt = require('bcrypt')
    const hashedPassword = await bcrypt.hash('admin123', 10)

    await connection.query(`
      INSERT IGNORE INTO admin_users (username, password, real_name, role)
      VALUES ('admin', ?, '系统管理员', 'super_admin')
    `, [hashedPassword])

    connection.release()
    console.log('✅ Database tables initialized')
    console.log('📝 Default admin account: username=admin, password=admin123')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
  }
}

// 启动时初始化数据库
initDatabase()

module.exports = { query, pool }
