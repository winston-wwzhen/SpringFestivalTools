<template>
  <div class="redpack-list-page page-container">
    <h2 class="page-title">红包活动管理</h2>

    <!-- 操作按钮 -->
    <div class="actions-bar">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建活动
      </el-button>
    </div>

    <!-- 搜索表单 -->
    <div class="search-form">
      <div class="search-form-item">
        <label>审核状态</label>
        <el-select v-model="filters.reviewStatus" placeholder="全部" clearable style="width: 150px">
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
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
        <el-table-column prop="platform" label="平台" width="120" />
        <el-table-column prop="title" label="活动标题" min-width="200" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="reviewStatus" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="reviewStatusTypeMap[row.reviewStatus]" size="small">
              {{ reviewStatusMap[row.reviewStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
      width="700px"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="平台" prop="platform">
          <el-input v-model="formData.platform" placeholder="如：微信、支付宝、抖音等" />
        </el-form-item>

        <el-form-item label="活动标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入活动标题" />
        </el-form-item>

        <el-form-item label="活动描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入活动描述"
          />
        </el-form-item>

        <el-form-item label="活动规则">
          <el-input
            v-model="formData.rules"
            type="textarea"
            :rows="4"
            placeholder="请输入活动规则"
          />
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="活动状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="pending">未开始</el-radio>
            <el-radio label="active">进行中</el-radio>
            <el-radio label="ended">已结束</el-radio>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { redpackService } from '@/api/redpack'

const loading = ref(false)
const tableData = ref<any[]>([])

const filters = reactive({
  reviewStatus: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新建活动')
const formRef = ref<FormInstance>()
const submitting = ref(false)
const editId = ref<number | null>(null)

const formData = reactive({
  platform: '',
  title: '',
  description: '',
  rules: '',
  startTime: '',
  endTime: '',
  status: 'active'
})

const formRules: FormRules = {
  platform: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const reviewStatusMap: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝'
}

const reviewStatusTypeMap: Record<string, any> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      reviewStatus: filters.reviewStatus || undefined
    }
    const data = await redpackService.adminGetList(params)
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
  filters.reviewStatus = ''
  pagination.page = 1
  loadData()
}

// 创建活动
const handleCreate = () => {
  dialogTitle.value = '新建活动'
  editId.value = null
  Object.assign(formData, {
    platform: '',
    title: '',
    description: '',
    rules: '',
    startTime: '',
    endTime: '',
    status: 'active'
  })
  dialogVisible.value = true
}

// 编辑活动
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑活动'
  editId.value = row.id
  Object.assign(formData, {
    platform: row.platform,
    title: row.title,
    description: row.description || '',
    rules: row.rules || '',
    startTime: row.startTime,
    endTime: row.endTime,
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
        await redpackService.update(editId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await redpackService.create(formData)
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

// 删除活动
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除活动 "${row.title}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await redpackService.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    // 用户取消
  }
}

// 对话框关闭
const handleDialogClosed = () => {
  formRef.value?.resetFields()
  editId.value = null
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.redpack-list-page {
  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }

  .actions-bar {
    margin-bottom: 20px;
  }
}
</style>
