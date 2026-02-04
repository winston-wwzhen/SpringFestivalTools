<template>
  <div class="dashboard-page">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">🎊 春节工具管理后台</h1>
        <p class="welcome-subtitle">欢迎使用春节数据管理系统</p>
      </div>
      <div class="user-info">
        <el-avatar :size="48" class="user-avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <div class="user-details">
          <div class="user-name">{{ authStore.user?.realName || '管理员' }}</div>
          <div class="user-role">{{ roleMap[authStore.user?.role] || '管理员' }}</div>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card redpack">
          <div class="stat-icon">🧧</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.redpack }}</div>
            <div class="stat-label">红包活动</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card gala-platform">
          <div class="stat-icon">📺</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.galaPlatform }}</div>
            <div class="stat-label">春晚平台</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card gala-program">
          <div class="stat-icon">🎭</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.galaProgram }}</div>
            <div class="stat-label">春晚节目</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">总数据</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="20" class="quick-nav-row">
      <el-col :xs="24" :sm="12" :md="8">
        <div class="nav-card" @click="$router.push('/content/redpack')">
          <div class="nav-icon redpack">
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="nav-content">
            <div class="nav-title">红包管理</div>
            <div class="nav-desc">管理红包活动信息</div>
          </div>
          <div class="nav-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <div class="nav-card" @click="$router.push('/content/gala')">
          <div class="nav-icon gala">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="nav-content">
            <div class="nav-title">春晚管理</div>
            <div class="nav-desc">管理平台和节目</div>
          </div>
          <div class="nav-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <div class="nav-card" @click="$router.push('/crawler')">
          <div class="nav-icon crawler">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="nav-content">
            <div class="nav-title">爬虫管理</div>
            <div class="nav-desc">数据采集任务</div>
          </div>
          <div class="nav-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 最新动态 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="card activity-card">
          <div class="card-header">
            <h3 class="card-title">📅 春节倒计时</h3>
            <el-tag type="danger" size="large" effect="dark">{{ countdownText }}</el-tag>
          </div>

          <div class="countdown-info">
            <div class="countdown-grid">
              <div class="countdown-item">
                <div class="countdown-value">{{ countdown.days }}</div>
                <div class="countdown-label">天</div>
              </div>
              <div class="countdown-separator">:</div>
              <div class="countdown-item">
                <div class="countdown-value">{{ countdown.hours }}</div>
                <div class="countdown-label">时</div>
              </div>
              <div class="countdown-separator">:</div>
              <div class="countdown-item">
                <div class="countdown-value">{{ countdown.minutes }}</div>
                <div class="countdown-label">分</div>
              </div>
              <div class="countdown-separator">:</div>
              <div class="countdown-item">
                <div class="countdown-value">{{ countdown.seconds }}</div>
                <div class="countdown-label">秒</div>
              </div>
            </div>
            <div class="countdown-date">距离 {{ currentYear }}年春节（{{ lunarNewYear }}）</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据总览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :xs="24" :md="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🧧 红包活动</h3>
            <el-button type="primary" size="small" @click="$router.push('/content/redpack')">
              查看全部
            </el-button>
          </div>
          <el-table :data="recentRedpacks" style="width: 100%" v-loading="loading">
            <el-table-column prop="platform" label="平台" width="120" />
            <el-table-column prop="title" label="活动名称" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="statusTypeMap[row.status]" size="small">
                  {{ statusMap[row.status] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="120">
              <template #default="{ row }">
                {{ formatDate(row.endTime) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :xs="24" :md="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📺 春晚平台</h3>
            <el-button type="primary" size="small" @click="$router.push('/content/gala')">
              查看全部
            </el-button>
          </div>
          <el-table :data="recentPlatforms" style="width: 100%" v-loading="loading">
            <el-table-column label="图标" width="60">
              <template #default="{ row }">
                <span style="font-size: 24px">{{ row.emoji || '📺' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="平台名称" />
            <el-table-column prop="programCount" label="节目数" width="80" />
            <el-table-column prop="broadcastTime" label="播出时间" width="150">
              <template #default="{ row }">
                {{ formatDateTime(row.airDate, row.airTime) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { http } from '@/utils/request'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)

// 统计数据
const stats = reactive({
  redpack: 0,
  galaPlatform: 0,
  galaProgram: 0,
  total: 0
})

// 倒计时
const countdown = reactive({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const currentYear = new Date().getFullYear()
const lunarNewYear = '马年'

// 计算倒计时文本
const countdownText = computed(() => {
  const totalSeconds = countdown.days * 86400 + countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds
  if (totalSeconds <= 0) return '春节快乐！'
  return '距离春节还有'
})

// 角色映射
const roleMap: Record<string, string> = {
  super_admin: '超级管理员',
  admin: '管理员',
  editor: '编辑'
}

// 状态映射
const statusMap: Record<string, string> = {
  upcoming: '未开始',
  ongoing: '进行中',
  ended: '已结束'
}

const statusTypeMap: Record<string, string> = {
  upcoming: 'info',
  ongoing: 'success',
  ended: 'info'
}

// 最新数据
const recentRedpacks = ref<any[]>([])
const recentPlatforms = ref<any[]>([])

let countdownTimer: number | null = null

// 加载统计数据
const loadStats = async () => {
  loading.value = true
  try {
    // 加载红包统计
    const redpackData = await http.get('/admin/redpack/list', { page: 1, pageSize: 1 })
    stats.redpack = redpackData.total || 0

    // 加载春晚平台统计
    const platformData = await http.get('/admin/gala/platforms', { page: 1, pageSize: 1 })
    stats.galaPlatform = platformData.total || 0

    // 计算节目总数
    stats.galaProgram = 0 // TODO: 需要从后端获取

    stats.total = stats.redpack + stats.galaPlatform + stats.galaProgram

    // 加载最新红包活动
    const recentRedpackData = await http.get('/admin/redpack/list', { page: 1, pageSize: 5 })
    recentRedpacks.value = recentRedpackData.list || []

    // 加载最新春晚平台
    const recentPlatformData = await http.get('/admin/gala/platforms', { page: 1, pageSize: 5 })
    recentPlatforms.value = recentPlatformData.list || []
      .map((p: any) => ({
        ...p,
        programCount: 0 // TODO: 需要从后端获取
      }))
  } catch (error) {
    console.error('加载统计失败:', error)
  } finally {
    loading.value = false
  }
}

// 计算春节倒计时
const updateCountdown = () => {
  const now = dayjs()
  const springFestival = dayjs(`${currentYear}-01-29 00:00:00`) // 假设春节是1月29日

  const diff = springFestival.diff(now, 'second')

  if (diff > 0) {
    countdown.days = Math.floor(diff / 86400)
    countdown.hours = Math.floor((diff % 86400) / 3600)
    countdown.minutes = Math.floor((diff % 3600) / 60)
    countdown.seconds = diff % 60
  } else {
    countdown.days = 0
    countdown.hours = 0
    countdown.minutes = 0
    countdown.seconds = 0
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化日期时间
const formatDateTime = (date: string | null, time: string | null) => {
  if (!date && !time) return '-'

  let dateStr = ''
  if (date) {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    dateStr = `${year}-${month}-${day}`
  }

  const timeStr = time || ''

  if (dateStr && timeStr) {
    return `${dateStr} ${timeStr.substring(0, 5)}`
  }
  return dateStr || timeStr
}

onMounted(() => {
  loadStats()
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000) as unknown as number
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf5 100%);
  min-height: calc(100vh - 60px);
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  color: #fff;
}

.welcome-content {
  flex: 1;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.95;
  font-weight: 400;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  text-align: right;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-role {
  font-size: 14px;
  opacity: 0.9;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &.redpack { border-color: rgba(245, 108, 108, 0.1); }
  &.gala-platform { border-color: rgba(64, 158, 255, 0.1); }
  &.gala-program { border-color: rgba(103, 194, 58, 0.1); }
  &.total { border-color: rgba(139, 92, 246, 0.1); }
}

.stat-icon {
  font-size: 40px;
  margin-right: 16px;
  line-height: 1;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

.quick-nav-row {
  margin-bottom: 24px;
}

.nav-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: rgba(102, 126, 234, 0.2);
  }
}

.nav-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;

  &.redpack { background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); }
  &.gala { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); }
  &.crawler { background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); }
}

.nav-content {
  flex: 1;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.nav-desc {
  font-size: 14px;
  color: #999;
}

.nav-arrow {
  color: #ccc;
  font-size: 20px;
}

.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f7fa;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.overview-row {
  margin-bottom: 24px;
}

// 倒计时样式
.activity-card {
  background: linear-gradient(135deg, #fff5f5 0%, #ffebee 100%);
}

.countdown-info {
  text-align: center;
}

.countdown-grid {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.countdown-item {
  text-align: center;
}

.countdown-value {
  font-size: 48px;
  font-weight: 800;
  color: #d32f2f;
  line-height: 1;
  min-width: 60px;
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.15);
}

.countdown-label {
  font-size: 12px;
  color: #d32f2f;
  margin-top: 4px;
  font-weight: 500;
}

.countdown-separator {
  font-size: 32px;
  font-weight: bold;
  color: #d32f2f;
  margin: 0 4px;
}

.countdown-date {
  font-size: 16px;
  color: #c62828;
  font-weight: 600;
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;

  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
  }
}

:deep(.el-tag) {
  border-radius: 8px;
  font-weight: 500;
}
</style>
