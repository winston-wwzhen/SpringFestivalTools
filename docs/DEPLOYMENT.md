# 后端服务部署指南

本文档介绍如何将春节攻略小程序后端服务部署到生产环境。

---

## 📋 目录

- [环境要求](#环境要求)
- [服务器准备](#服务器准备)
- [后端服务部署](#后端服务部署)
- [数据库配置](#数据库配置)
- [Nginx 配置](#nginx-配置)
- [PM2 进程管理](#pm2-进程管理)
- [SSL 证书配置](#ssl-证书配置)

---

## 环境要求

### 软件版本

| 软件 | 版本要求 |
|------|----------|
| Node.js | >= 18.0.0 |
| MySQL | >= 8.0 |
| Nginx | >= 1.18 |
| PM2 | 最新版 |

### 硬件要求

- CPU: 1 核心以上
- 内存: 1GB 以上
- 磁盘: 10GB 以上

---

## 服务器准备

### 1. 安装 Node.js

#### Ubuntu/Debian

```bash
# 使用 NodeSource 仓库安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

#### CentOS/RHEL

```bash
# 安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

### 2. 安装 MySQL

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install -y mysql-server

# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation
```

#### CentOS/RHEL

```bash
sudo yum install -y mysql-server

# 启动 MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 安全配置
sudo mysql_secure_installation
```

### 3. 安装 PM2

```bash
sudo npm install -g pm2

# 设置开机自启
pm2 startup
pm2 save
```

### 4. 安装 Nginx

#### Ubuntu/Debian

```bash
sudo apt-get install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### CentOS/RHEL

```bash
sudo yum install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 后端服务部署

### 1. 上传代码到服务器

```bash
# 方式一：使用 git
cd /var/www
git clone https://github.com/winston-wwzhen/SpringFestivalTools.git

# 方式二：手动上传
# 在本地打包
tar -czf spring-festival-server.tar.gz server/

# 上传到服务器
scp spring-festival-server.tar.gz user@your-server:/var/www/

# 在服务器上解压
cd /var/www
tar -xzf spring-festival-server.tar.gz
```

### 2. 安装依赖

```bash
cd /var/www/SpringFestivalTools/server

# 安装生产依赖
npm install --production
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

配置内容：

```bash
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=sfg_user
DB_PASSWORD=your_secure_password
DB_NAME=spring_festival_guide

# JWT 配置（生产环境务必修改）
JWT_SECRET=your_jwt_secret_key_change_in_production

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# API 地址
SERVER_URL=https://your-domain.com

# 日志配置
LOG_LEVEL=info
LOG_PATH=./logs
```

### 4. 创建必要目录

```bash
# 创建上传文件目录
mkdir -p uploads

# 创建日志目录
mkdir -p logs
```

### 5. 使用 PM2 启动服务

```bash
# 启动服务
pm2 start src/app.js --name spring-festival-api

# 保存 PM2 配置
pm2 save
```

### 6. 验证服务状态

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs spring-festival-api

# 测试 API
curl http://localhost:3000/health
```

---

## 数据库配置

### 1. 创建数据库和用户

```bash
# 登录 MySQL
mysql -u root -p

# 执行以下 SQL
```

```sql
-- 创建数据库
CREATE DATABASE spring_festival_guide
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'sfg_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 授权
GRANT ALL PRIVILEGES ON spring_festival_guide.* TO 'sfg_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 2. 初始化数据库表

后端服务首次启动时会自动创建数据表，包括：
- `admin_users` - 管理员表
- `audit_logs` - 审核日志表
- `crawler_tasks` - 爬虫任务表
- `crawler_logs` - 爬虫执行记录
- `redpack_activities` - 红包活动表
- `gala_platforms` - 春晚平台表
- `gala_programs` - 春晚节目表
- `emoticons` - 表情包表
- `kinship_terms` - 亲戚称呼表

### 3. 默认管理员账号

- 用户名: `admin`
- 密码: `admin123`

**⚠️ 部署后请立即修改默认密码！**

---

## Nginx 配置

### 1. 创建配置文件

```bash
sudo nano /etc/nginx/sites-available/spring-festival
```

### 2. 配置内容

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 小程序端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 管理端 API
    location /admin/api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 管理后台前端
    location / {
        root /var/www/SpringFestivalTools/admin-frontend/dist;
        try_files $uri $uri/ /index.html;

        # 缓存配置
        add_header Cache-Control "public, max-age=3600";
    }

    # 文件上传大小限制
    client_max_body_size 10M;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/spring-festival /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

---

## PM2 进程管理

### 常用命令

```bash
# 查看所有进程
pm2 list

# 查看服务状态
pm2 status

# 查看日志
pm2 logs spring-festival-api

# 查看实时日志
pm2 logs spring-festival-api --lines 100

# 重启服务
pm2 restart spring-festival-api

# 平滑重启（零停机）
pm2 reload spring-festival-api

# 停止服务
pm2 stop spring-festival-api

# 删除进程
pm2 delete spring-festival-api

# 监控面板
pm2 monit
```

### 日志管理

```bash
# 清理旧日志
pm2 flush

# 日志轮转配置
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## SSL 证书配置

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 测试自动续期
sudo certbot renew --dry-run
```

### 自动续期

Certbot 会自动配置续期任务，可以通过以下命令验证：

```bash
sudo systemctl status certbot.timer
```

---

## 防火墙配置

```bash
# Ubuntu UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## 常见问题

### 1. 端口被占用

```bash
# 查看端口占用
sudo lsof -i :3000

# 杀死进程
sudo kill -9 <PID>
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 状态
sudo systemctl status mysql

# 检查端口
sudo netstat -tlnp | grep 3306

# 测试连接
mysql -u sfg_user -p -h localhost
```

### 3. 权限问题

```bash
# 确保 uploads 目录有写权限
chmod 755 uploads

# 日志目录
chmod 755 logs
```

### 4. 服务无法启动

```bash
# 查看详细日志
pm2 logs spring-festival-api --lines 50

# 检查环境变量
cat .env
```

---

## 监控和维护

### 设置监控

```bash
# 安装监控模块
pm2 install pm2-logrotate
pm2 install pm2-server-monit
```

### 备份数据

```bash
# 数据库备份脚本
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u sfg_user -p spring_festival_guide > $BACKUP_DIR/spring_festival_guide_$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "spring_festival_guide_*.sql" -mtime +7 -delete
```

---

## 附录：完整部署检查清单

- [ ] Node.js 18+ 已安装
- [ ] MySQL 8.0+ 已安装并启动
- [ ] PM2 已安装并配置开机自启
- [ ] Nginx 已安装并启动
- [ ] 防火墙规则已配置
- [ ] 环境变量已配置
- [ ] 数据库和用户已创建
- [ ] 后端服务已启动
- [ ] Nginx 反向代理已配置
- [ ] SSL 证书已配置
- [ ] 管理后台已构建
- [ ] 默认管理员密码已修改
