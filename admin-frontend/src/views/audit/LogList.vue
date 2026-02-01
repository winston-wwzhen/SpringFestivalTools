<template>
  <div class="log-list-page page-container">
    <h2 class="page-title">审核日志</h2>

    <!-- 搜索表单 -->
    <div class="search-form">
      <div class="search-form-item">
        <label>资源类型</label>
        <el-select v-model="filters.resourceType" placeholder="全部" clearable style="width: 150px">
          <el-option label="红包活动" value="redpack" />
          <el-option label="春晚平台" value="gala_platform" />
          <el-option label="春晚节目" value="gala_program" />
          <el-option label="表情包" value="emoticon" />
          <el-option label="亲戚称呼" value="kinship" />
        </el-select>
      </div>
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>
        搜索
      </el-button>
      <el-button @click="handleReset">
        <el-icon><RefreshLeft /></el-icon>
        重置
      </el-button>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="resourceType" label="资源类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ resourceTypeMap[row.resourceType] }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="resourceId" label="资源ID" width="100" />

        <el-table-column prop="action" label="操作" width="100">
          <template #default="{ row }">
            <el-tag :type="actionTypeMap[row.action].type" size="small">
              {{ actionTypeMap[row.action].text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="oldStatus" label="原状态" width="100">
          <template #default="{ row }">
            <span v-if="row.oldStatus">{{ statusMap[row.oldStatus] }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column prop="newStatus" label="新状态" width="100">
          <template #default="{ row }">
            <span v-if="row.newStatus">{{ statusMap[row.newStatus] }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column prop="reason" label="备注/理由" min-width="200" show-overflow-tooltip />

        <el-table-column prop="reviewerName" label="审核人" width="120" />

        <el-table-column prop="ipAddress" label="IP地址" width="140" />

        <el-table-column prop="createdAt" label="操作时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getAuditLogs } from '@/api/audit'
import dayjs from 'dayjs'

const loading = ref(false)
const tableData = ref<any[]>([])

const filters = reactive({
  resourceType: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

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

const statusMap: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      resourceType: filters.resourceType || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const data = await getAuditLogs(params)
    tableData.value = data.list
    pagination.total = data.total
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  filters.resourceType = ''
  pagination.page = 1
  loadData()
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.log-list-page {
  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }
}
</style>
