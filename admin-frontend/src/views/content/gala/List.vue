<template>
  <div class="gala-list-page page-container">
    <h2 class="page-title">春晚管理</h2>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="春晚平台" name="platforms">
        <template #label>
          <span>春晚平台</span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="节目单" name="programs">
        <template #label>
          <span>节目单</span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 平台管理 -->
    <div v-if="activeTab === 'platforms'">
      <div class="actions-bar">
        <el-button type="primary" @click="handleCreatePlatform">
          <el-icon><Plus /></el-icon>
          新建平台
        </el-button>
      </div>

      <div class="card">
        <el-table v-loading="loading" :data="platforms">
          <el-table-column prop="emoji" label="图标" width="60">
            <template #default="{ row }">
              <span style="font-size: 24px">{{ row.emoji || '📺' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="平台名称" min-width="150" />
          <el-table-column prop="shortName" label="简称" width="60" />
          <el-table-column prop="year" label="年份" width="70" />
          <el-table-column prop="airDate" label="播出日期" width="110" />
          <el-table-column prop="airTime" label="播出时间" width="90" />
          <el-table-column prop="channel" label="播出频道" width="120" />
          <el-table-column prop="tags" label="标签" width="200">
            <template #default="{ row }">
              <el-tag v-for="(tag, idx) in row.tags" :key="idx" size="small" style="margin-right: 4px">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isShow" label="显示" width="70">
            <template #default="{ row }">
              <el-tag :type="row.isShow ? 'success' : 'info'" size="small">
                {{ row.isShow ? '显示' : '隐藏' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="70" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEditPlatform(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeletePlatform(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 节目管理 -->
    <div v-else>
      <div class="search-form">
        <div class="search-form-item">
          <label>选择平台</label>
          <el-select v-model="selectedPlatformId" placeholder="请选择平台" @change="loadPrograms" style="width: 200px">
            <el-option
              v-for="platform in approvedPlatforms"
              :key="platform.id"
              :label="platform.name"
              :value="platform.id"
            />
          </el-select>
        </div>
      </div>

      <div v-if="selectedPlatformId" class="actions-bar">
        <el-button type="primary" @click="handleCreateProgram">
          <el-icon><Plus /></el-icon>
          新建节目
        </el-button>
      </div>

      <div class="card">
        <el-table v-loading="loading" :data="programs">
          <el-table-column prop="orderNum" label="序号" width="80" />
          <el-table-column prop="title" label="节目名称" min-width="200" />
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="performers" label="表演者" min-width="200" show-overflow-tooltip />
          <el-table-column prop="airTime" label="播出时间" width="100" />
          <el-table-column prop="reviewStatus" label="审核状态" width="100">
            <template #default="{ row }">
              <el-tag :type="reviewStatusTypeMap[row.reviewStatus]" size="small">
                {{ reviewStatusMap[row.reviewStatus] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEditProgram(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteProgram(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 平台编辑对话框 -->
    <el-dialog
      v-model="platformDialogVisible"
      :title="platformDialogTitle"
      width="600px"
      @closed="handlePlatformDialogClosed"
    >
      <el-form
        ref="platformFormRef"
        :model="platformForm"
        :rules="platformFormRules"
        label-width="110px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="平台名称" prop="name">
              <el-input v-model="platformForm.name" placeholder="如：央视春晚、河南春晚等" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="简称" prop="shortName">
              <el-input v-model="platformForm.shortName" placeholder="央" maxlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Emoji图标">
              <el-input v-model="platformForm.emoji" placeholder="📺" maxlength="2" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="年份" prop="year">
              <el-input-number v-model="platformForm.year" :min="2000" :max="2100" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="播出日期">
              <el-date-picker
                v-model="platformForm.airDate"
                type="date"
                placeholder="选择播出日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="播出时间">
              <el-time-picker
                v-model="platformForm.airTime"
                placeholder="选择播出时间"
                style="width: 100%"
                value-format="HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="播出频道">
          <el-input v-model="platformForm.channel" placeholder="如：CCTV-1、河南卫视等" />
        </el-form-item>

        <el-form-item label="标签（逗号分隔）">
          <el-input v-model="platformForm.tagsText" placeholder="央视, 主会场, 全球直播" />
        </el-form-item>

        <el-form-item label="Logo地址">
          <el-input v-model="platformForm.logo" placeholder="/images/gala/cctv-logo.png" />
        </el-form-item>

        <el-form-item label="海报地址">
          <el-input v-model="platformForm.poster" placeholder="/images/gala/cctv-poster.png" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="platformForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="platformForm.sort" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否显示">
              <el-switch v-model="platformForm.isShow" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="platformDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitPlatform" :loading="platformSubmitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 节目编辑对话框 -->
    <el-dialog
      v-model="programDialogVisible"
      :title="programDialogTitle"
      width="600px"
      @closed="handleProgramDialogClosed"
    >
      <el-form
        ref="programFormRef"
        :model="programForm"
        :rules="programFormRules"
        label-width="100px"
      >
        <el-form-item label="节目名称" prop="title">
          <el-input v-model="programForm.title" placeholder="请输入节目名称" />
        </el-form-item>

        <el-form-item label="节目类型">
          <el-input v-model="programForm.type" placeholder="如：歌舞、小品、相声等" />
        </el-form-item>

        <el-form-item label="表演者">
          <el-input v-model="programForm.performers" placeholder="请输入表演者，多个用逗号分隔" />
        </el-form-item>

        <el-form-item label="播出时间">
          <el-time-picker
            v-model="programForm.airTime"
            placeholder="选择播出时间"
            style="width: 100%"
            value-format="HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="节目序号">
          <el-input-number v-model="programForm.orderNum" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="programDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitProgram" :loading="programSubmitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { galaService } from '@/api/gala'

const activeTab = ref('platforms')
const loading = ref(false)
const platforms = ref<any[]>([])
const programs = ref<any[]>([])
const approvedPlatforms = computed(() => platforms.value.filter(p => p.reviewStatus === 'approved'))
const selectedPlatformId = ref<number | null>(null)

// 平台表单
const platformDialogVisible = ref(false)
const platformDialogTitle = ref('新建平台')
const platformFormRef = ref<FormInstance>()
const platformSubmitting = ref(false)
const editPlatformId = ref<number | null>(null)

const platformForm = reactive({
  name: '',
  shortName: '',
  emoji: '📺',
  year: new Date().getFullYear(),
  airDate: '',
  airTime: '',
  channel: '',
  logo: '',
  poster: '',
  description: '',
  sort: 0,
  isShow: true,
  tags: [] as string[],
  tagsText: ''
})

const platformFormRules: FormRules = {
  name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  year: [{ required: true, message: '请输入年份', trigger: 'blur' }]
}

// 节目表单
const programDialogVisible = ref(false)
const programDialogTitle = ref('新建节目')
const programFormRef = ref<FormInstance>()
const programSubmitting = ref(false)
const editProgramId = ref<number | null>(null)

const programForm = reactive({
  title: '',
  type: '',
  performers: '',
  airTime: '',
  orderNum: 0
})

const programFormRules: FormRules = {
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

// 加载平台列表
const loadPlatforms = async () => {
  loading.value = true
  try {
    const result = await galaService.adminGetPlatforms({})
    platforms.value = result.list || []
  } catch (error) {
    console.error('加载平台失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载节目列表
const loadPrograms = async () => {
  if (!selectedPlatformId.value) return

  loading.value = true
  try {
    const result = await galaService.adminGetPrograms({
      platformId: selectedPlatformId.value
    })
    programs.value = result.list || []
  } catch (error) {
    console.error('加载节目失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换 Tab
const handleTabChange = () => {
  if (activeTab.value === 'platforms') {
    loadPlatforms()
  }
}

// 创建平台
const handleCreatePlatform = () => {
  platformDialogTitle.value = '新建平台'
  editPlatformId.value = null
  Object.assign(platformForm, {
    name: '',
    shortName: '',
    emoji: '📺',
    year: new Date().getFullYear(),
    airDate: '',
    airTime: '',
    channel: '',
    logo: '',
    poster: '',
    description: '',
    sort: 0,
    isShow: true,
    tags: [],
    tagsText: ''
  })
  platformDialogVisible.value = true
}

// 编辑平台
const handleEditPlatform = (row: any) => {
  platformDialogTitle.value = '编辑平台'
  editPlatformId.value = row.id
  const tags = Array.isArray(row.tags) ? row.tags : []
  Object.assign(platformForm, {
    name: row.name,
    shortName: row.shortName || '',
    emoji: row.emoji || '📺',
    year: row.year || new Date().getFullYear(),
    airDate: row.airDate || '',
    airTime: row.airTime || '',
    channel: row.channel || '',
    logo: row.logo || '',
    poster: row.poster || '',
    description: row.description || '',
    sort: row.sort || 0,
    isShow: row.isShow !== undefined ? row.isShow : true,
    tags: tags,
    tagsText: tags.join(', ')
  })
  platformDialogVisible.value = true
}

// 提交平台表单
const handleSubmitPlatform = async () => {
  if (!platformFormRef.value) return

  await platformFormRef.value.validate(async (valid) => {
    if (!valid) return

    platformSubmitting.value = true
    try {
      // 处理标签
      const tags = platformForm.tagsText
        ? platformForm.tagsText.split(',').map(t => t.trim()).filter(t => t)
        : []

      const submitData = {
        ...platformForm,
        tags
      }

      if (editPlatformId.value) {
        await galaService.updatePlatform(editPlatformId.value, submitData)
        ElMessage.success('更新成功')
      } else {
        await galaService.createPlatform(submitData)
        ElMessage.success('创建成功')
      }
      platformDialogVisible.value = false
      loadPlatforms()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    } finally {
      platformSubmitting.value = false
    }
  })
}

// 删除平台
const handleDeletePlatform = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除平台 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await galaService.deletePlatform(row.id)
    ElMessage.success('删除成功')
    loadPlatforms()
  } catch (error) {
    // 用户取消
  }
}

// 平台对话框关闭
const handlePlatformDialogClosed = () => {
  platformFormRef.value?.resetFields()
  editPlatformId.value = null
}

// 创建节目
const handleCreateProgram = () => {
  if (!selectedPlatformId.value) {
    ElMessage.warning('请先选择平台')
    return
  }

  programDialogTitle.value = '新建节目'
  editProgramId.value = null
  Object.assign(programForm, {
    title: '',
    type: '',
    performers: '',
    airTime: '',
    orderNum: programs.value.length + 1
  })
  programDialogVisible.value = true
}

// 编辑节目
const handleEditProgram = (row: any) => {
  programDialogTitle.value = '编辑节目'
  editProgramId.value = row.id
  Object.assign(programForm, {
    title: row.title,
    type: row.type || '',
    performers: row.performers || '',
    airTime: row.airTime || '',
    orderNum: row.orderNum || 0
  })
  programDialogVisible.value = true
}

// 提交节目表单
const handleSubmitProgram = async () => {
  if (!programFormRef.value) return

  await programFormRef.value.validate(async (valid) => {
    if (!valid) return

    programSubmitting.value = true
    try {
      if (editProgramId.value) {
        await galaService.updateProgram(editProgramId.value, programForm)
        ElMessage.success('更新成功')
      } else {
        await galaService.createProgram({
          ...programForm,
          platform_id: selectedPlatformId.value!
        })
        ElMessage.success('创建成功')
      }
      programDialogVisible.value = false
      loadPrograms()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    } finally {
      programSubmitting.value = false
    }
  })
}

// 删除节目
const handleDeleteProgram = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除节目 "${row.title}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await galaService.deleteProgram(row.id)
    ElMessage.success('删除成功')
    loadPrograms()
  } catch (error) {
    // 用户取消
  }
}

// 节目对话框关闭
const handleProgramDialogClosed = () => {
  programFormRef.value?.resetFields()
  editProgramId.value = null
}

onMounted(() => {
  loadPlatforms()
})
</script>

<style scoped lang="scss">
.gala-list-page {
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
