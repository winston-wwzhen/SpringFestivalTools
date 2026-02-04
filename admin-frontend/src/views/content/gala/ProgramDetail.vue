<template>
  <div class="program-detail-page page-container">
    <!-- 头部操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
        <div class="header-info">
          <h2 class="page-title">{{ isEditMode ? '编辑节目' : '节目详情' }}</h2>
          <span v-if="!isEditMode" class="page-subtitle">{{ programInfo.title || '加载中...' }}</span>
        </div>
      </div>
      <div class="header-actions">
        <template v-if="!isEditMode">
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button type="danger" @click="handleDelete">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
        <template v-else>
          <el-button @click="handleCancelEdit">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            保存
          </el-button>
        </template>
      </div>
    </div>

    <!-- 详情内容 -->
    <el-tabs v-model="activeTab" class="detail-tabs">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="basic">
        <div class="detail-section">
          <div v-if="!isEditMode" class="info-grid">
            <div class="info-item">
              <label>节目名称</label>
              <span class="value">{{ programInfo.title || '-' }}</span>
            </div>
            <div class="info-item">
              <label>节目序号</label>
              <span class="value">{{ programInfo.orderNum ?? '-' }}</span>
            </div>
            <div class="info-item">
              <label>节目类型</label>
              <el-tag size="small">{{ programInfo.type || '-' }}</el-tag>
            </div>
            <div class="info-item">
              <label>时长</label>
              <span class="value">{{ formatDuration(programInfo.duration) }}</span>
            </div>
            <div class="info-item full-width">
              <label>表演者</label>
              <span class="value">{{ programInfo.performers || '-' }}</span>
            </div>
            <div class="info-item full-width">
              <label>节目描述</label>
              <span class="value">{{ programInfo.description || '-' }}</span>
            </div>
          </div>
          <el-form v-else ref="formRef" :model="form" :rules="formRules" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="14">
                <el-form-item label="节目名称" prop="title">
                  <el-input v-model="form.title" placeholder="请输入节目名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="节目序号">
                  <el-input-number v-model="form.orderNum" :min="0" controls-position="right" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="14">
                <el-form-item label="节目类型">
                  <el-select
                    v-model="form.type"
                    placeholder="选择节目类型"
                    style="width: 100%"
                    filterable
                    allow-create
                    clearable
                  >
                    <el-option label="歌舞" value="歌舞" />
                    <el-option label="歌曲" value="歌曲" />
                    <el-option label="小品" value="小品" />
                    <el-option label="相声" value="相声" />
                    <el-option label="魔术" value="魔术" />
                    <el-option label="杂技" value="杂技" />
                    <el-option label="戏曲" value="戏曲" />
                    <el-option label="综艺" value="综艺" />
                    <el-option label="语言" value="语言" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="时长(秒)">
                  <el-input-number
                    v-model="form.duration"
                    :min="0"
                    :step="60"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="表演者">
              <el-input
                v-model="form.performers"
                placeholder="请输入表演者，多个用逗号分隔"
                clearable
              />
            </el-form-item>
            <el-form-item label="节目描述">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请输入节目描述（可选）"
                show-word-limit
                maxlength="500"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 播出信息 -->
      <el-tab-pane label="播出信息" name="broadcast">
        <div class="detail-section">
          <div v-if="!isEditMode" class="info-grid">
            <div class="info-item">
              <label>播出时间</label>
              <span class="value">{{ programInfo.airTime || '-' }}</span>
            </div>
            <div class="info-item">
              <label>所属平台</label>
              <span class="value">
                <span v-if="platformInfo" style="font-size: 20px; margin-right: 8px;">
                  {{ platformInfo.emoji || '📺' }}
                </span>
                {{ platformInfo?.name || '-' }}
              </span>
            </div>
            <div class="info-item">
              <label>平台播出时间</label>
              <span class="value">{{ platformBroadcastTime }}</span>
            </div>
          </div>
          <el-form v-else label-width="100px">
            <el-form-item label="播出时间">
              <el-time-picker
                v-model="form.airTime"
                placeholder="选择播出时间"
                style="width: 100%"
                value-format="HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="所属平台">
              <div class="platform-info">
                <span v-if="platformInfo" style="font-size: 24px; margin-right: 8px;">
                  {{ platformInfo.emoji || '📺' }}
                </span>
                <span>{{ platformInfo?.name || '-' }}</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 审核信息 -->
      <el-tab-pane label="审核信息" name="review">
        <div class="detail-section">
          <div class="info-grid">
            <div class="info-item">
              <label>审核状态</label>
              <el-tag :type="reviewStatusTypeMap[programInfo.reviewStatus]" size="small">
                {{ reviewStatusMap[programInfo.reviewStatus] }}
              </el-tag>
            </div>
            <div class="info-item">
              <label>创建时间</label>
              <span class="value">{{ formatDateTime(programInfo.createdAt) }}</span>
            </div>
            <div class="info-item">
              <label>更新时间</label>
              <span class="value">{{ formatDateTime(programInfo.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Edit, Delete } from '@element-plus/icons-vue'
import { galaService } from '@/api/gala'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const programId = ref<number>(parseInt(route.params.id as string))
const platformId = ref<number>(parseInt(route.params.platformId as string))

const activeTab = ref('basic')
const isEditMode = ref(false)
const submitting = ref(false)

const formRef = ref<FormInstance>()

// 节目信息
const programInfo = reactive({
  id: 0,
  title: '',
  type: '',
  performers: '',
  airTime: '',
  orderNum: 0,
  duration: 0,
  description: '',
  reviewStatus: '',
  createdAt: '',
  updatedAt: ''
})

// 平台信息
const platformInfo = ref<any>(null)

// 表单数据
const form = reactive({
  title: '',
  type: '',
  performers: '',
  airTime: '',
  orderNum: 0,
  duration: 0,
  description: ''
})

const formRules: FormRules = {
  title: [{ required: true, message: '请输入节目名称', trigger: 'blur' }]
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

// 平台播出时间
const platformBroadcastTime = computed(() => {
  if (!platformInfo.value) return '-'
  const date = platformInfo.value.airDate
  const time = platformInfo.value.airTime
  if (!date && !time) return '-'
  if (date && time) {
    return `${date} ${time.substring(0, 5)}`
  }
  return date || time || '-'
})

/**
 * 格式化时长
 */
const formatDuration = (seconds: number) => {
  if (!seconds) return '-'
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes > 0) {
    return `${minutes}分${secs}秒`
  }
  return `${secs}秒`
}

/**
 * 格式化日期时间
 */
const formatDateTime = (date: string) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

/**
 * 加载节目详情
 */
const loadProgramDetail = async () => {
  try {
    const result = await galaService.adminGetPrograms({
      platformId: platformId.value,
      reviewStatus: undefined
    })
    const program = result.list?.find((p: any) => p.id === programId.value)
    if (program) {
      Object.assign(programInfo, {
        id: program.id,
        title: program.title,
        type: program.type,
        performers: program.performer || program.performers || '',
        airTime: program.airTime || program.startTime || '',
        orderNum: program.orderNum || 0,
        duration: program.duration || 0,
        description: program.description || '',
        reviewStatus: program.reviewStatus || '',
        createdAt: program.createdAt,
        updatedAt: program.updatedAt
      })
      // 重置表单数据
      Object.assign(form, {
        title: program.title,
        type: program.type || '',
        performers: program.performer || program.performers || '',
        airTime: program.airTime || program.startTime || '',
        orderNum: program.orderNum || 0,
        duration: program.duration || 0,
        description: program.description || ''
      })
    }
  } catch (error) {
    console.error('加载节目详情失败:', error)
    ElMessage.error('加载节目详情失败')
  }
}

/**
 * 加载平台信息
 */
const loadPlatformInfo = async () => {
  try {
    const result = await galaService.adminGetPlatforms({})
    const platform = result.list?.find((p: any) => p.id === platformId.value)
    if (platform) {
      platformInfo.value = platform
    }
  } catch (error) {
    console.error('加载平台信息失败:', error)
  }
}

/**
 * 返回列表
 */
const handleBack = () => {
  router.push('/content/gala')
}

/**
 * 进入编辑模式
 */
const handleEdit = () => {
  isEditMode.value = true
  activeTab.value = 'basic'
}

/**
 * 取消编辑
 */
const handleCancelEdit = () => {
  isEditMode.value = false
  // 恢复原始数据
  Object.assign(form, {
    title: programInfo.title,
    type: programInfo.type,
    performers: programInfo.performers,
    airTime: programInfo.airTime,
    orderNum: programInfo.orderNum,
    duration: programInfo.duration,
    description: programInfo.description
  })
}

/**
 * 提交编辑
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await galaService.updateProgram(programId.value, form)
      ElMessage.success('更新成功')
      isEditMode.value = false
      // 重新加载数据
      await loadProgramDetail()
    } catch (error: any) {
      ElMessage.error(error.message || '更新失败')
    } finally {
      submitting.value = false
    }
  })
}

/**
 * 删除节目
 */
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除节目 "${programInfo.title}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await galaService.deleteProgram(programId.value)
    ElMessage.success('删除成功')
    router.push('/content/gala')
  } catch (error) {
    // 用户取消
  }
}

onMounted(async () => {
  await Promise.all([loadProgramDetail(), loadPlatformInfo()])
})
</script>

<style scoped lang="scss">
.program-detail-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .header-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .page-subtitle {
          font-size: 14px;
          color: #666;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .detail-tabs {
    :deep(.el-tabs__content) {
      padding-top: 20px;
    }
  }

  .detail-section {
    background: #fff;
    border-radius: 8px;
    padding: 24px;

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 8px;

        &.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .value {
          font-size: 16px;
          color: #333;
          word-break: break-all;
        }
      }
    }

    .platform-info {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: #f5f7fa;
      border-radius: 4px;
      font-size: 16px;
      color: #333;
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}
</style>
