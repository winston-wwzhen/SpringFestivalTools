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
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 60px);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-right: 12px;
    border-radius: 2px;
  }
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 28px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);

    &::before {
      opacity: 1;
    }
  }

  &.pending {
    background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
    border-color: rgba(245, 108, 108, 0.2);

    .stat-icon {
      background: linear-gradient(135deg, #ff6b6b 0%, #f56c6c 100%);
      color: #fff;
      box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
    }
  }

  &.approved {
    background: linear-gradient(135deg, #f0f9ff 0%, #fff 100%);
    border-color: rgba(64, 158, 255, 0.2);

    .stat-icon {
      background: linear-gradient(135deg, #4facfe 0%, #409eff 100%);
      color: #fff;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
  }

  &.rejected {
    background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
    border-color: rgba(144, 147, 153, 0.2);

    .stat-icon {
      background: linear-gradient(135deg, #a8a8a8 0%, #909399 100%);
      color: #fff;
      box-shadow: 0 4px 12px rgba(144, 147, 153, 0.3);
    }
  }

  &.total {
    background: linear-gradient(135deg, #f0f9ff 0%, #fff 100%);
    border-color: rgba(103, 194, 58, 0.2);

    .stat-icon {
      background: linear-gradient(135deg, #67c23a 0%, #5daf34 100%);
      color: #fff;
      box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
    }
  }
}

.stat-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  font-size: 32px;
  margin-right: 20px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #333 0%, #666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.stat-card:hover .stat-value {
  transform: scale(1.05);
}

.stat-label {
  font-size: 15px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.actions-row {
  margin-bottom: 24px;
}

.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
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
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 18px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-right: 10px;
    border-radius: 2px;
  }
}

.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.quick-actions .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;

  th {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    font-weight: 600;
    color: #333;
  }

  tr:hover {
    background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
  }
}

:deep(.el-tag) {
  border-radius: 8px;
  font-weight: 500;
  padding: 4px 12px;
}
</style>
