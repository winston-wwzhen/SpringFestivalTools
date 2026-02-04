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
          <el-table-column prop="shortName" label="简称" width="80" />
          <el-table-column prop="year" label="年份" width="80" />
          <el-table-column label="播出时间" min-width="160">
            <template #default="{ row }">
              {{ formatDateTime(row.airDate, row.airTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="channel" label="频道" min-width="120" />
          <el-table-column prop="tags" label="标签" min-width="200">
            <template #default="{ row }">
              <el-tag v-for="(tag, idx) in row.tags" :key="idx" size="small" style="margin-right: 4px">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isShow" label="显示" width="80">
            <template #default="{ row }">
              <el-tag :type="row.isShow ? 'success' : 'info'" size="small">
                {{ row.isShow ? '显示' : '隐藏' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" />
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
      width="800px"
      @closed="handlePlatformDialogClosed"
    >
      <el-tabs v-model="activePlatformTab" class="platform-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="platformFormRef"
            :model="platformForm"
            :rules="platformFormRules"
            label-width="100px"
            class="platform-form"
          >
            <el-row :gutter="20">
              <el-col :span="16">
                <el-form-item label="平台名称" prop="name">
                  <el-input v-model="platformForm.name" placeholder="如：央视春晚、湖南春晚等" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="简称" prop="shortName">
                  <el-input v-model="platformForm.shortName" placeholder="央" maxlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="图标">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span v-if="platformForm.emoji" style="font-size: 32px;">{{ platformForm.emoji }}</span>
                    <el-input v-model="platformForm.emoji" placeholder="📺" style="width: 60px" />
                  </div>
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
                <el-form-item label="排序">
                  <el-input-number v-model="platformForm.sort" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="显示状态">
                  <el-switch
                    v-model="platformForm.isShow"
                    active-text="显示"
                    inactive-text="隐藏"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="平台描述">
              <el-input
                v-model="platformForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入平台描述"
                show-word-limit
                maxlength="200"
              />
            </el-form-item>

            <el-form-item label="标签">
              <div class="tags-container">
                <el-select
                  v-model="platformForm.selectedTags"
                  multiple
                  filterable
                  allow-create
                  placeholder="选择或输入标签"
                  style="width: 100%"
                >
                  <el-option
                    v-for="tag in presetTags"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
                <div class="tags-tip">
                  <el-icon><InfoFilled /></el-icon>
                  <span>可多选，也可输入自定义标签</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 播出信息 -->
        <el-tab-pane label="播出信息" name="broadcast">
          <el-form
            ref="platformFormRef2"
            :model="platformForm"
            label-width="100px"
            class="platform-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="播出日期">
                  <el-date-picker
                    v-model="platformForm.airDate"
                    type="date"
                    placeholder="选择播出日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="播出时间">
                  <el-time-picker
                    v-model="platformForm.airTime"
                    placeholder="选择播出时间"
                    style="width: 100%"
                    value-format="HH:mm:ss"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="播出频道">
              <el-input v-model="platformForm.channel" placeholder="如：CCTV-1、湖南卫视、B站等">
                <template #prepend>
                  <el-icon><Monitor /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-alert
              title="播出信息预览"
              type="info"
              :closable="false"
              style="margin-bottom: 20px"
            >
              <template #default>
                <div style="font-size: 14px;">
                  <strong v-if="platformForm.name">{{ platformForm.name }}</strong>
                  <span v-else>平台名称</span>
                  <span v-if="platformForm.airDate || platformForm.airTime" style="margin-left: 8px;">
                    {{ formatDateTime(platformForm.airDate, platformForm.airTime) }}
                  </span>
                  <span v-if="platformForm.channel" style="margin-left: 8px; color: #409eff;">
                    {{ platformForm.channel }}
                  </span>
                </div>
              </template>
            </el-alert>
          </el-form>
        </el-tab-pane>

        <!-- 媒体资源 -->
        <el-tab-pane label="媒体资源" name="media">
          <el-form
            ref="platformFormRef3"
            :model="platformForm"
            label-width="100px"
            class="platform-form"
          >
            <el-form-item label="Logo地址">
              <el-input v-model="platformForm.logo" placeholder="/images/gala/cctv-logo.png">
                <template #prepend>
                  <el-icon><Picture /></el-icon>
                </template>
              </el-input>
              <div v-if="platformForm.logo" class="image-preview">
                <img :src="platformForm.logo" alt="Logo预览" @error="handleImageError" />
              </div>
            </el-form-item>

            <el-form-item label="海报地址">
              <el-input v-model="platformForm.poster" placeholder="/images/gala/cctv-poster.png">
                <template #prepend>
                  <el-icon><Picture /></el-icon>
                </template>
              </el-input>
              <div v-if="platformForm.poster" class="image-preview">
                <img :src="platformForm.poster" alt="海报预览" @error="handleImageError" />
              </div>
            </el-form-item>

            <el-form-item label="数据来源">
              <el-input v-model="platformForm.sourceUrl" placeholder="数据来源URL（可选）">
                <template #prepend>
                  <el-icon><Link /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

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
      width="700px"
      @closed="handleProgramDialogClosed"
    >
      <el-form
        ref="programFormRef"
        :model="programForm"
        :rules="programFormRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="节目名称" prop="title">
              <el-input v-model="programForm.title" placeholder="请输入节目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节目类型">
              <el-select
                v-model="programForm.type"
                placeholder="选择节目类型"
                style="width: 100%"
                filterable
                allow-create
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
        </el-row>

        <el-form-item label="表演者">
          <el-input
            v-model="programForm.performers"
            placeholder="请输入表演者，多个用逗号分隔"
          >
            <template #prepend>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="播出时间">
              <el-time-picker
                v-model="programForm.airTime"
                placeholder="选择播出时间"
                style="width: 100%"
                value-format="HH:mm:ss"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时长(秒)">
              <el-input-number
                v-model="programForm.duration"
                :min="0"
                :step="60"
                style="width: 100%"
                placeholder="单位：秒"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="节目序号">
              <el-input-number v-model="programForm.orderNum" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="节目描述">
          <el-input
            v-model="programForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入节目描述（可选）"
            show-word-limit
            maxlength="200"
          />
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
import { InfoFilled, Monitor, Picture, Link, User } from '@element-plus/icons-vue'
import { galaService } from '@/api/gala'

const activeTab = ref('platforms')
const activePlatformTab = ref('basic')
const loading = ref(false)
const platforms = ref<any[]>([])
const programs = ref<any[]>([])
const approvedPlatforms = computed(() => platforms.value.filter(p => p.reviewStatus === 'approved'))
const selectedPlatformId = ref<number | null>(null)

// 预设标签
const presetTags = [
  '央视', '卫视', '网络', '主会场', '分会场',
  '全球直播', '4K', '8K', 'VR', 'AR',
  '国潮', '国风', '传统文化', '科技创新',
  'Z世代', '二次元', '年轻化', '潮流',
  '短视频', '互动', '社交', '接地气',
  '快乐', '青春', '京味儿', '冰雪',
  '海派', '都市', '中国蓝', '荔枝'
]

// 平台表单
const platformDialogVisible = ref(false)
const platformDialogTitle = ref('新建平台')
const platformFormRef = ref<FormInstance>()
const platformFormRef2 = ref<FormInstance>()
const platformFormRef3 = ref<FormInstance>()
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
  selectedTags: [] as string[],
  sourceUrl: ''
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
  performer: '',
  performers: '',
  airTime: '',
  startTime: '',
  orderNum: 0,
  duration: 0,
  description: ''
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

/**
 * 格式化日期时间
 */
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

/**
 * 图片加载错误处理
 */
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij7liqDovb3lu5bu65Lu75oGi77ya77yaPC90ZXh0Pjwvc3ZnPg=='
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
  activePlatformTab.value = 'basic'
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
    selectedTags: [],
    sourceUrl: ''
  })
  platformDialogVisible.value = true
}

// 编辑平台
const handleEditPlatform = (row: any) => {
  platformDialogTitle.value = '编辑平台'
  editPlatformId.value = row.id
  activePlatformTab.value = 'basic'
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
    selectedTags: tags,
    sourceUrl: row.sourceUrl || ''
  })
  platformDialogVisible.value = true
}

// 提交平台表单
const handleSubmitPlatform = async () => {
  // 验证所有表单
  const forms = [platformFormRef.value, platformFormRef2.value, platformFormRef3.value].filter(Boolean)
  for (const form of forms) {
    const valid = await form.validate().catch(() => false)
    if (!valid) return
  }

  platformSubmitting.value = true
  try {
    // 使用 selectedTags 作为 tags
    const submitData = {
      ...platformForm,
      tags: platformForm.selectedTags
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
    performer: '',
    performers: '',
    airTime: '',
    startTime: '',
    orderNum: programs.value.length + 1,
    duration: 0,
    description: ''
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
    performer: row.performer || row.performers || '',
    performers: row.performer || row.performers || '',
    airTime: row.airTime || row.startTime || '',
    startTime: row.airTime || row.startTime || '',
    orderNum: row.orderNum || 0,
    duration: row.duration || 0,
    description: row.description || ''
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

  .search-form {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;

    .search-form-item {
      display: flex;
      align-items: center;
      gap: 8px;

      label {
        white-space: nowrap;
        font-weight: 500;
      }
    }
  }

  // 平台编辑对话框样式
  .platform-tabs {
    :deep(.el-tabs__content) {
      padding-top: 20px;
    }
  }

  .platform-form {
    .el-form-item {
      margin-bottom: 22px;
    }

    .tags-container {
      width: 100%;

      .tags-tip {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        font-size: 12px;
        color: #909399;

        .el-icon {
          font-size: 14px;
        }
      }
    }

    .image-preview {
      margin-top: 12px;
      border: 1px dashed #dcdfe6;
      border-radius: 4px;
      padding: 8px;
      text-align: center;

      img {
        max-width: 200px;
        max-height: 150px;
        border-radius: 4px;
      }
    }
  }

  // 节目表单优化
  .el-form-item {
    :deep(.el-input-group__prepend) {
      background-color: #f5f7fa;
      border-color: #dcdfe6;
    }
  }
}
</style>
