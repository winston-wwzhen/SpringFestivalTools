<template>
  <div class="dashboard-page">
    <h2 class="page-title">仪表盘</h2>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card pending">
          <div class="stat-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pending || 0 }}</div>
            <div class="stat-label">待审核</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card approved">
          <div class="stat-icon">
            <el-icon><Select /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.approved || 0 }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card rejected">
          <div class="stat-icon">
            <el-icon><CloseBold /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.rejected || 0 }}</div>
            <div class="stat-label">已拒绝</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total">
          <div class="stat-icon">
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total || 0 }}</div>
            <div class="stat-label">总数据</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-row :gutter="20" class="actions-row">
      <el-col :span="24">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">快捷操作</h3>
          </div>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/audit')">
              <el-icon><Document /></el-icon>
              处理待审核
            </el-button>
            <el-button @click="$router.push('/crawler')">
              <el-icon><Connection /></el-icon>
              爬虫管理
            </el-button>
            <el-button @click="$router.push('/content/redpack')">
              <el-icon><Folder /></el-icon>
              红包管理
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 最新审核日志 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">最新审核日志</h3>
            <el-button text type="primary" @click="$router.push('/audit/logs')">
              查看全部
            </el-button>
          </div>
          <el-table :data="recentLogs" style="width: 100%">
            <el-table-column prop="resourceType" label="资源类型" width="120">
              <template #default="{ row }">
                <el-tag size="small">{{ resourceTypeMap[row.resourceType] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="100">
              <template #default="{ row }">
                <el-tag :type="actionTypeMap[row.action].type" size="small">
                  {{ actionTypeMap[row.action].text }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="备注" show-overflow-tooltip />
            <el-table-column prop="createdAt" label="时间" width="180">
              <template #default="{ row }">
                {{ formatTime(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getAuditStats, getAuditLogs } from '@/api/audit'
import type { AuditLog } from '@/types'
import dayjs from 'dayjs'

const stats = reactive({
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0
})

const recentLogs = ref<AuditLog[]>([])

const resourceTypeMap: Record<string, string> = {
  redpack: '红包活动',
  gala_platform: '春晚平台',
  gala_program: '春晚节目',
  emoticon: '表情包',
  kinship: '亲戚称呼'
}

const actionTypeMap: Record<string, any> = {
  approve: { text: '通过', type: 'success' },
  reject: { text: '拒绝', type: 'danger' },
  delete: { text: '删除', type: 'warning' },
  edit: { text: '编辑', type: 'info' }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const data = await getAuditStats()

    // 汇总统计
    let pending = 0
    let approved = 0
    let rejected = 0

    Object.values(data).forEach((item: any) => {
      pending += item.pending || 0
      approved += item.approved || 0
      rejected += item.rejected || 0
    })

    stats.pending = pending
    stats.approved = approved
    stats.rejected = rejected
    stats.total = pending + approved + rejected
  } catch (error) {
    console.error('加载统计失败:', error)
  }
}

// 加载最新日志
const loadRecentLogs = async () => {
  try {
    const data = await getAuditLogs({ page: 1, pageSize: 5 })
    recentLogs.value = data.list
  } catch (error) {
    console.error('加载日志失败:', error)
  }
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  loadStats()
  loadRecentLogs()
})
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-4px);
  }

  &.pending .stat-icon {
    background: #fef0f0;
    color: #f56c6c;
  }

  &.approved .stat-icon {
    background: #f0f9ff;
    color: #409eff;
  }

  &.rejected .stat-icon {
    background: #f4f4f5;
    color: #909399;
  }

  &.total .stat-icon {
    background: #f0f9ff;
    color: #67c23a;
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 28px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.actions-row {
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-actions .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
