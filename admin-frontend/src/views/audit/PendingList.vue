<template>
  <div class="audit-page page-container">
    <h2 class="page-title">待审核列表</h2>

    <!-- 分类标签 -->
    <el-tabs v-model="activeType" @tab-change="handleTypeChange">
      <el-tab-pane label="红包活动" name="redpack">
        <template #label>
          <span>红包活动</span>
          <el-badge v-if="stats.redpack > 0" :value="stats.redpack" class="tab-badge" />
        </template>
      </el-tab-pane>
      <el-tab-pane label="春晚平台" name="gala_platform">
        <template #label>
          <span>春晚平台</span>
          <el-badge v-if="stats.gala_platform > 0" :value="stats.gala_platform" class="tab-badge" />
        </template>
      </el-tab-pane>
      <el-tab-pane label="春晚节目" name="gala_program">
        <template #label>
          <span>春晚节目</span>
          <el-badge v-if="stats.gala_program > 0" :value="stats.gala_program" class="tab-badge" />
        </template>
      </el-tab-pane>
      <el-tab-pane label="表情包" name="emoticon">
        <template #label>
          <span>表情包</span>
          <el-badge v-if="stats.emoticon > 0" :value="stats.emoticon" class="tab-badge" />
        </template>
      </el-tab-pane>
      <el-tab-pane label="亲戚称呼" name="kinship">
        <template #label>
          <span>亲戚称呼</span>
          <el-badge v-if="stats.kinship > 0" :value="stats.kinship" class="tab-badge" />
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 搜索和操作 -->
    <div class="search-form">
      <div class="search-form-item">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索标题/名称"
          clearable
          style="width: 200px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
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

    <!-- 批量操作 -->
    <div v-if="selection.length > 0" class="batch-actions">
      <span class="selection-info">已选择 {{ selection.length }} 项</span>
      <el-button type="success" @click="handleBatchApprove">
        <el-icon><Select /></el-icon>
        批量通过
      </el-button>
      <el-button @click="selection = []">
        取消选择
      </el-button>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column label="标题/名称" min-width="200">
          <template #default="{ row }">
            <div class="title-cell">
              <span class="title">{{ row.title || row.name }}</span>
              <el-tag v-if="row.platform" size="small" class="platform-tag">
                {{ row.platform }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="描述" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.description || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="数据来源" width="150">
          <template #default="{ row }">
            <el-link v-if="row.sourceUrl" :href="row.sourceUrl" target="_blank" type="primary" :underline="false">
              <el-icon><Link /></el-icon>
              查看来源
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="handleApprove(row)">
              通过
            </el-button>
            <el-button type="danger" size="small" @click="handleReject(row)">
              拒绝
            </el-button>
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

    <!-- 审核备注对话框 -->
    <el-dialog
      v-model="noteDialogVisible"
      :title="noteDialogTitle"
      width="500px"
    >
      <el-form :model="noteForm" label-width="80px">
        <el-form-item label="备注">
          <el-input
            v-model="noteForm.note"
            type="textarea"
            :rows="4"
            placeholder="请输入审核备注（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="noteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmApprove">确定</el-button>
      </template>
    </el-dialog>

    <!-- 拒绝理由对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒绝理由"
      width="500px"
    >
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="拒绝理由" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝理由"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确定拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPendingList, approve, reject, batchApprove } from '@/api/audit'
import { getAuditStats } from '@/api/audit'
import dayjs from 'dayjs'

const activeType = ref('redpack')
const loading = ref(false)
const tableData = ref<any[]>([])
const selection = ref<any[]>([])
const searchKeyword = ref('')

const stats = reactive<Record<string, number>>({
  redpack: 0,
  gala_platform: 0,
  gala_program: 0,
  emoticon: 0,
  kinship: 0
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 审核备注对话框
const noteDialogVisible = ref(false)
const noteDialogTitle = ref('审核备注')
const noteForm = reactive({
  note: '',
  currentId: null as number | null
})

// 拒绝理由对话框
const rejectDialogVisible = ref(false)
const rejectForm = reactive({
  reason: '',
  currentId: null as number | null
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      type: activeType.value,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const data = await getPendingList(params)
    tableData.value = data.list
    pagination.total = data.total

    // 更新统计
    if (data.stats) {
      Object.assign(stats, data.stats)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载统计
const loadStats = async () => {
  try {
    const data = await getAuditStats()
    Object.assign(stats, data)
  } catch (error) {
    console.error('加载统计失败:', error)
  }
}

// 切换类型
const handleTypeChange = () => {
  pagination.page = 1
  loadData()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  pagination.page = 1
  loadData()
}

// 选择变化
const handleSelectionChange = (val: any[]) => {
  selection.value = val
}

// 审核通过
const handleApprove = (row: any) => {
  noteForm.currentId = row.id
  noteForm.note = ''
  noteDialogTitle.value = `审核通过 - ${row.title || row.name}`
  noteDialogVisible.value = true
}

// 确认通过
const confirmApprove = async () => {
  try {
    await approve(activeType.value, noteForm.currentId!, noteForm.note)
    ElMessage.success('审核通过')
    noteDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('审核失败:', error)
  }
}

// 审核拒绝
const handleReject = (row: any) => {
  rejectForm.currentId = row.id
  rejectForm.reason = ''
  rejectDialogVisible.value = true
}

// 确认拒绝
const confirmReject = async () => {
  if (!rejectForm.reason) {
    ElMessage.warning('请输入拒绝理由')
    return
  }

  try {
    await reject(activeType.value, rejectForm.currentId!, rejectForm.reason)
    ElMessage.success('已拒绝')
    rejectDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('拒绝失败:', error)
  }
}

// 批量通过
const handleBatchApprove = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要批量通过 ${selection.value.length} 项内容吗？`,
      '批量审核',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selection.value.map(item => item.id)
    await batchApprove(activeType.value, ids)
    ElMessage.success(`已批量通过 ${ids.length} 项内容`)
    selection.value = []
    loadData()
  } catch (error) {
    // 用户取消
  }
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  loadData()
  loadStats()
})
</script>

<style scoped lang="scss">
.audit-page {
  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }

  .tab-badge {
    margin-left: 8px;
  }

  .batch-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
    background: #f0f9ff;
    border: 1px solid #d9ecff;
    border-radius: 8px;

    .selection-info {
      font-size: 14px;
      color: #409eff;
      font-weight: 500;
    }
  }

  .title-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    .title {
      font-weight: 500;
    }

    .platform-tag {
      flex-shrink: 0;
    }
  }
}
</style>
