<template>
  <div class="crawler-page page-container">
    <h2 class="page-title">爬虫管理</h2>

    <!-- 操作按钮 -->
    <div class="actions-bar">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建任务
      </el-button>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="name" label="任务名称" min-width="200" />

        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ typeMap[row.type] }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sourceUrl" label="数据源" min_width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link :href="row.sourceUrl" target="_blank" type="primary" :underline="false">
              {{ row.sourceUrl }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="cronExpression" label="Cron表达式" width="150" />

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]" size="small">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="统计" width="150">
          <template #default="{ row }">
            <span>成功 {{ row.successCount }} 次</span><br>
            <span style="color: #f56c6c">失败 {{ row.failCount }} 次</span>
          </template>
        </el-table-column>

        <el-table-column prop="lastRunAt" label="最后运行" width="180">
          <template #default="{ row }">
            {{ row.lastRunAt ? formatTime(row.lastRunAt) : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleRun(row)">
              <el-icon><VideoPlay /></el-icon>
              运行
            </el-button>
            <el-button
              v-if="row.status === 'active'"
              size="small"
              type="warning"
              @click="handlePause(row)"
            >
              <el-icon><VideoPause /></el-icon>
              暂停
            </el-button>
            <el-button
              v-else
              size="small"
              type="success"
              @click="handleResume(row)"
            >
              <el-icon><VideoPlay /></el-icon>
              恢复
            </el-button>
            <el-button size="small" @click="handleLogs(row)">
              <el-icon><Document /></el-icon>
              日志
            </el-button>
            <el-button size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              删除
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
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </div>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item label="爬取类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="红包活动" value="redpack" />
            <el-option label="春晚节目" value="gala" />
            <el-option label="表情包" value="emoticon" />
            <el-option label="亲戚称呼" value="kinship" />
          </el-select>
        </el-form-item>

        <el-form-item label="数据源URL" prop="sourceUrl">
          <el-input v-model="formData.sourceUrl" placeholder="请输入数据源URL" />
        </el-form-item>

        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input
            v-model="formData.cronExpression"
            placeholder="如: 0 */2 * * * (每2小时)"
          />
          <div class="form-tip">
            常用表达式：0 */2 * * * (每2小时) | 0 0 * * * (每天0点) | 0 0 */6 * * (每6小时)
          </div>
        </el-form-item>

        <el-form-item label="爬虫配置">
          <el-input
            v-model="configJson"
            type="textarea"
            :rows="6"
            placeholder='JSON格式，如: {"selectors": {"container": ".item", "title": ".title"}}'
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">激活</el-radio>
            <el-radio label="paused">暂停</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 执行日志对话框 -->
    <el-dialog v-model="logsDialogVisible" title="执行日志" width="900px">
      <el-table v-loading="logsLoading" :data="logsData" max-height="500">
        <el-table-column prop="startTime" label="开始时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.startTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="endTime" label="结束时间" width="180">
          <template #default="{ row }">
            {{ row.endTime ? formatTime(row.endTime) : '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="logStatusTypeMap[row.status]" size="small">
              {{ logStatusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="数据统计" width="200">
          <template #default="{ row }">
            <span>抓取 {{ row.itemsFetched }} 条</span><br>
            <span style="color: #67c23a">新增 {{ row.itemsCreated }} 条</span><br>
            <span style="color: #409eff">更新 {{ row.itemsUpdated }} 条</span>
          </template>
        </el-table-column>

        <el-table-column prop="errorMessage" label="错误信息" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.errorMessage" style="color: #f56c6c">{{ row.errorMessage }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="logsPagination.page"
          v-model:page-size="logsPagination.pageSize"
          :total="logsPagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadLogs"
          @current-change="loadLogs"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { getTaskList, createTask, updateTask, deleteTask, runTask, pauseTask, resumeTask, getTaskLogs } from '@/api/crawler'
import dayjs from 'dayjs'

const loading = ref(false)
const tableData = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新建任务')
const formRef = ref<FormInstance>()
const submitting = ref(false)
const editId = ref<number | null>(null)

const formData = reactive({
  name: '',
  type: 'redpack',
  sourceUrl: '',
  cronExpression: '',
  config: {},
  status: 'active'
})

const configJson = computed({
  get: () => JSON.stringify(formData.config, null, 2),
  set: (val) => {
    try {
      formData.config = JSON.parse(val)
    } catch {
      formData.config = {}
    }
  }
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  sourceUrl: [{ required: true, message: '请输入数据源URL', trigger: 'blur' }],
  cronExpression: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }]
}

// 日志对话框
const logsDialogVisible = ref(false)
const logsLoading = ref(false)
const logsData = ref<any[]>([])
const currentTaskId = ref<number | null>(null)

const logsPagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const typeMap: Record<string, string> = {
  redpack: '红包活动',
  gala: '春晚节目',
  emoticon: '表情包',
  kinship: '亲戚称呼'
}

const statusMap: Record<string, string> = {
  active: '运行中',
  paused: '已暂停',
  disabled: '已禁用'
}

const statusTypeMap: Record<string, any> = {
  active: 'success',
  paused: 'warning',
  disabled: 'info'
}

const logStatusMap: Record<string, string> = {
  running: '运行中',
  success: '成功',
  failed: '失败'
}

const logStatusTypeMap: Record<string, any> = {
  running: 'warning',
  success: 'success',
  failed: 'danger'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const data = await getTaskList(params)
    tableData.value = data.list
    pagination.total = data.total
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 创建任务
const handleCreate = () => {
  dialogTitle.value = '新建任务'
  editId.value = null
  Object.assign(formData, {
    name: '',
    type: 'redpack',
    sourceUrl: '',
    cronExpression: '0 */2 * * *',
    config: {},
    status: 'active'
  })
  dialogVisible.value = true
}

// 编辑任务
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑任务'
  editId.value = row.id
  Object.assign(formData, {
    name: row.name,
    type: row.type,
    sourceUrl: row.sourceUrl,
    cronExpression: row.cronExpression,
    config: row.config || {},
    status: row.status
  })
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (editId.value) {
        await updateTask(editId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await createTask(formData)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 删除任务
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除任务 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteTask(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    // 用户取消
  }
}

// 运行任务
const handleRun = async (row: any) => {
  try {
    await runTask(row.id)
    ElMessage.success('任务已启动')
  } catch (error: any) {
    ElMessage.error(error.message || '启动失败')
  }
}

// 暂停任务
const handlePause = async (row: any) => {
  try {
    await pauseTask(row.id)
    ElMessage.success('任务已暂停')
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '暂停失败')
  }
}

// 恢复任务
const handleResume = async (row: any) => {
  try {
    await resumeTask(row.id)
    ElMessage.success('任务已恢复')
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '恢复失败')
  }
}

// 查看日志
const handleLogs = (row: any) => {
  currentTaskId.value = row.id
  logsPagination.page = 1
  logsDialogVisible.value = true
  loadLogs()
}

// 加载日志
const loadLogs = async () => {
  if (!currentTaskId.value) return

  logsLoading.value = true
  try {
    const params = {
      page: logsPagination.page,
      pageSize: logsPagination.pageSize
    }
    const data = await getTaskLogs(currentTaskId.value, params)
    logsData.value = data.list
    logsPagination.total = data.total
  } catch (error) {
    console.error('加载日志失败:', error)
  } finally {
    logsLoading.value = false
  }
}

// 对话框关闭
const handleDialogClosed = () => {
  formRef.value?.resetFields()
  editId.value = null
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
.crawler-page {
  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }

  .actions-bar {
    margin-bottom: 20px;
  }

  .form-tip {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}
</style>
