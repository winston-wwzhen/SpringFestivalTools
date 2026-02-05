<template>
  <div class="platform-detail-page page-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <div class="page-title-section">
        <el-button :icon="ArrowLeft" @click="handleBack" link>返回列表</el-button>
        <h2 class="page-title">
          <span class="platform-emoji">{{ platformInfo.emoji?.trim() || '📺' }}</span>
          {{ platformInfo.name || '加载中...' }}
        </h2>
      </div>
      <div class="page-actions">
        <el-button v-if="!isEditMode" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button v-if="!isEditMode" type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <template v-if="isEditMode">
          <el-button @click="handleCancelEdit">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            <el-icon><Check /></el-icon>
            保存
          </el-button>
        </template>
      </div>
    </div>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="平台信息" name="info" />
      <el-tab-pane name="programs">
        <template #label>
          节目管理
          <el-badge v-if="programs.length > 0" :value="programs.length" style="margin-left: 8px" />
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 平台信息 -->
    <div v-if="activeTab === 'info'" class="info-section">
      <!-- 查看模式 -->
      <div v-if="!isEditMode" class="card">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="平台名称">
            <span class="platform-name">{{ platformInfo.name || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="简称">
            <span class="short-name">{{ platformInfo.shortName || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="图标">
            <span class="emoji-display">{{ platformInfo.emoji?.trim() || '📺' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="年份">
            {{ platformInfo.year || '-' }}年
          </el-descriptions-item>
          <el-descriptions-item label="排序">
            {{ platformInfo.sort ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="显示状态">
            <el-tag :type="platformInfo.isShow ? 'success' : 'info'" size="small">
              {{ platformInfo.isShow ? '显示' : '隐藏' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="标签" :span="2">
            <el-tag
              v-for="(tag, idx) in platformInfo.tags"
              :key="idx"
              size="small"
              style="margin-right: 8px"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!platformInfo.tags || !platformInfo.tags.length" class="empty-text">暂无标签</span>
          </el-descriptions-item>
          <el-descriptions-item label="播出日期" :span="1">
            {{ formatAirDate(platformInfo.airDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="播出时间" :span="1">
            {{ platformInfo.airTime?.substring(0, 5) || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="播出频道" :span="2">
            {{ platformInfo.channel || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="平台描述" :span="2">
            {{ platformInfo.description || '暂无描述' }}
          </el-descriptions-item>
          <el-descriptions-item label="数据来源" :span="2">
            <el-link
              v-if="platformInfo.sourceUrl"
              :href="platformInfo.sourceUrl"
              target="_blank"
              type="primary"
            >
              {{ platformInfo.sourceUrl }}
            </el-link>
            <span v-else class="empty-text">-</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 编辑模式 -->
      <div v-else class="card">
        <el-tabs v-model="activeFormTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="平台名称" prop="name">
                    <el-input v-model="form.name" placeholder="如：央视春晚、湖南春晚等" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="简称" prop="shortName">
                    <el-input v-model="form.shortName" placeholder="央" maxlength="1" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="图标">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span v-if="form.emoji" style="font-size: 32px;">{{ form.emoji }}</span>
                      <el-input v-model="form.emoji" placeholder="📺" style="width: 60px" />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="年份" prop="year">
                    <el-input-number v-model="form.year" :min="2000" :max="2100" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="排序">
                    <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="显示状态">
                    <el-switch
                      v-model="form.isShow"
                      active-text="显示"
                      inactive-text="隐藏"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="平台描述">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入平台描述"
                  show-word-limit
                  maxlength="200"
                />
              </el-form-item>
              <el-form-item label="标签">
                <el-select
                  v-model="form.selectedTags"
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
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="播出信息" name="broadcast">
            <el-form ref="formRef2" :model="form" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="播出日期">
                    <el-date-picker
                      v-model="form.airDate"
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
                      v-model="form.airTime"
                      placeholder="选择播出时间"
                      style="width: 100%"
                      value-format="HH:mm:ss"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="播出频道">
                <el-input v-model="form.channel" placeholder="如：CCTV-1、湖南卫视、B站等" />
              </el-form-item>
              <el-form-item label="数据来源">
                <el-input v-model="form.sourceUrl" placeholder="数据来源URL（可选）" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 节目管理 -->
    <div v-if="activeTab === 'programs'" class="programs-section">
      <!-- 统计和筛选 -->
      <div class="card stats-card">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">节目总数</div>
              <div class="stat-value">{{ programs.length }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">总时长</div>
              <div class="stat-value">{{ formatTotalDuration() }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">节目类型</div>
              <div class="stat-value">{{ uniqueTypesCount }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-label">表演者数</div>
              <div class="stat-value">{{ uniquePerformersCount }}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作栏 -->
      <div class="actions-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索节目名称或表演者"
          prefix-icon="Search"
          clearable
          style="width: 280px; margin-right: 12px;"
        />
        <el-select
          v-model="filterType"
          placeholder="筛选类型"
          clearable
          style="width: 150px; margin-right: 12px;"
        >
          <el-option label="全部类型" value="" />
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
        <el-button type="primary" @click="handleCreateProgram">
          <el-icon><Plus /></el-icon>
          新建节目
        </el-button>
      </div>

      <!-- 节目列表 -->
      <div class="card">
        <el-table v-loading="programsLoading" :data="paginatedPrograms" row-key="id">
          <el-table-column prop="orderNum" label="序号" width="80" align="center">
            <template #default="{ row }">
              <el-tag size="small">{{ row.orderNum ?? '-' }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="title" label="节目名称" min-width="200">
            <template #default="{ row, $index }">
              <el-input v-if="editingIndex === $index" v-model="row.title" size="small" placeholder="节目名称" />
              <span v-else>{{ row.title }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row, $index }">
              <el-select
                v-if="editingIndex === $index"
                v-model="row.type"
                size="small"
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
              <el-tag v-else-if="row.type" size="small">{{ row.type }}</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column prop="performers" label="表演者" min-width="180">
            <template #default="{ row, $index }">
              <el-input v-if="editingIndex === $index" v-model="row.performers" size="small" placeholder="表演者" />
              <span v-else>{{ row.performers || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="airTime" label="播出时间" width="100">
            <template #default="{ row, $index }">
              <el-time-picker
                v-if="editingIndex === $index"
                v-model="row.airTime"
                size="small"
                value-format="HH:mm:ss"
                clearable
              />
              <span v-else>{{ row.airTime?.substring(0, 5) || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row, $index }">
              <template v-if="editingIndex === $index">
                <el-button size="small" type="primary" @click="saveProgram(row, $index)">保存</el-button>
                <el-button size="small" @click="cancelEdit($index)">取消</el-button>
              </template>
              <template v-else>
                <el-button size="small" @click="editProgram(row, $index)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteProgram(row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!programsLoading && filteredPrograms.length === 0" class="empty-state">
          <el-empty :description="searchKeyword || filterType ? '未找到相关节目' : '暂无节目'">
            <el-button v-if="!searchKeyword && !filterType" type="primary" @click="handleCreateProgram">
              新建节目
            </el-button>
          </el-empty>
        </div>

        <!-- 分页 -->
        <div v-if="filteredPrograms.length > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredPrograms.length"
            layout="total, prev, pager, next"
            :small="true"
          />
        </div>
      </div>
    </div>

    <!-- 新建节目对话框 -->
    <el-dialog
      v-model="programDialogVisible"
      title="新建节目"
      width="700px"
      @closed="handleProgramDialogClosed"
    >
      <el-form
        ref="programFormRef"
        :model="programForm"
        :rules="programFormRules"
        label-width="90px"
      >
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item label="节目名称" prop="title">
              <el-input v-model="programForm.title" placeholder="请输入节目名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="节目序号">
              <el-input-number v-model="programForm.orderNum" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item label="节目类型">
              <el-select
                v-model="programForm.type"
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
                v-model="programForm.duration"
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
            v-model="programForm.performers"
            placeholder="请输入表演者，多个用逗号分隔"
            clearable
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="14">
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
        </el-row>
        <el-form-item label="节目描述">
          <el-input
            v-model="programForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入节目描述（可选）"
            show-word-limit
            maxlength="200"
            clearable
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Edit, Delete, Plus, Check, Search } from '@element-plus/icons-vue'
import { galaService } from '@/api/gala'

const route = useRoute()
const router = useRouter()

const platformId = ref<number>(parseInt(route.params.id as string))

const activeTab = ref('info')
const activeFormTab = ref('basic')
const isEditMode = ref(false)
const submitting = ref(false)
const programsLoading = ref(false)

const formRef = ref<FormInstance>()
const formRef2 = ref<FormInstance>()
const programFormRef = ref<FormInstance>()

// 平台信息
const platformInfo = reactive<any>({
  id: 0,
  name: '',
  shortName: '',
  emoji: '',
  year: 0,
  sort: 0,
  isShow: true,
  tags: [] as string[],
  description: '',
  airDate: '',
  airTime: '',
  channel: '',
  sourceUrl: ''
})

// 表单数据
const form = reactive({
  name: '',
  shortName: '',
  emoji: '📺',
  year: new Date().getFullYear(),
  sort: 0,
  isShow: true,
  tags: [] as string[],
  selectedTags: [] as string[],
  description: '',
  airDate: '',
  airTime: '',
  channel: '',
  sourceUrl: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  year: [{ required: true, message: '请输入年份', trigger: 'blur' }]
}

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

// 节目列表
const programs = ref<any[]>([])
const editingIndex = ref(-1)
const originalProgram = ref<any>(null)

// 搜索和筛选
const searchKeyword = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 筛选后的节目列表
const filteredPrograms = computed(() => {
  let result = programs.value

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter((p: any) =>
      p.title?.toLowerCase().includes(keyword) ||
      p.performers?.toLowerCase().includes(keyword)
    )
  }

  // 按类型筛选
  if (filterType.value) {
    result = result.filter((p: any) => p.type === filterType.value)
  }

  return result
})

// 分页后的节目列表
const paginatedPrograms = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPrograms.value.slice(start, end)
})

// 唯一节目类型数
const uniqueTypesCount = computed(() => {
  const types = new Set(programs.value.map((p: any) => p.type).filter(Boolean))
  return types.size
})

// 唯一表演者数
const uniquePerformersCount = computed(() => {
  const allPerformers = programs.value
    .map((p: any) => p.performers)
    .filter(Boolean)
    .join(',')
    .split(/[,，、]/)
    .map(s => s.trim())
    .filter(Boolean)
  return new Set(allPerformers).size
})

// 新建节目表单
const programDialogVisible = ref(false)
const programSubmitting = ref(false)

const programForm = reactive({
  title: '',
  type: '',
  performers: '',
  airTime: '',
  orderNum: 0,
  duration: 0,
  description: ''
})

const programFormRules: FormRules = {
  title: [{ required: true, message: '请输入节目名称', trigger: 'blur' }]
}

/**
 * 格式化播出日期
 */
const formatAirDate = (date: string) => {
  if (!date) return '-'
  const dateStr = date.includes('T') ? date.split('T')[0] : date
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}

/**
 * 格式化总时长
 */
const formatTotalDuration = () => {
  const totalSeconds = programs.value.reduce((sum: number, p: any) => sum + (p.duration || 0), 0)
  if (totalSeconds === 0) return '-'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

/**
 * 加载平台详情
 */
const loadPlatformDetail = async () => {
  try {
    const result = await galaService.adminGetPlatforms({})
    const platform = result.list?.find((p: any) => p.id === platformId.value)
    if (platform) {
      const tags = Array.isArray(platform.tags) ? platform.tags : []

      // 直接赋值而不是使用Object.assign，确保响应式更新
      platformInfo.id = platform.id
      platformInfo.name = platform.name
      platformInfo.shortName = platform.shortName || ''
      platformInfo.emoji = platform.emoji || ''
      platformInfo.year = platform.year || 0
      platformInfo.sort = platform.sort || 0
      platformInfo.isShow = platform.isShow !== undefined ? platform.isShow : true
      platformInfo.tags = tags
      platformInfo.description = platform.description || ''
      platformInfo.airDate = platform.airDate || ''
      platformInfo.airTime = platform.airTime || ''
      platformInfo.channel = platform.channel || ''
      platformInfo.sourceUrl = platform.sourceUrl || ''

      form.name = platform.name
      form.shortName = platform.shortName || ''
      form.emoji = platform.emoji || '📺'
      form.year = platform.year || new Date().getFullYear()
      form.sort = platform.sort || 0
      form.isShow = platform.isShow !== undefined ? platform.isShow : true
      form.tags = tags
      form.selectedTags = tags
      form.description = platform.description || ''
      form.airDate = platform.airDate || ''
      form.airTime = platform.airTime || ''
      form.channel = platform.channel || ''
      form.sourceUrl = platform.sourceUrl || ''
    }
  } catch (error) {
    console.error('加载平台详情失败:', error)
    ElMessage.error('加载平台详情失败')
  }
}

/**
 * 加载节目列表
 */
const loadPrograms = async () => {
  programsLoading.value = true
  try {
    const result = await galaService.adminGetPrograms({
      platformId: platformId.value
    })
    programs.value = result.list || []
  } catch (error) {
    console.error('加载节目列表失败:', error)
    ElMessage.error('加载节目列表失败')
  } finally {
    programsLoading.value = false
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
  activeTab.value = 'info'
  activeFormTab.value = 'basic'
}

/**
 * 取消编辑
 */
const handleCancelEdit = () => {
  isEditMode.value = false
  form.name = platformInfo.name
  form.shortName = platformInfo.shortName
  form.emoji = platformInfo.emoji || '📺'
  form.year = platformInfo.year
  form.sort = platformInfo.sort
  form.isShow = platformInfo.isShow
  form.tags = platformInfo.tags
  form.selectedTags = platformInfo.tags
  form.description = platformInfo.description
  form.airDate = platformInfo.airDate
  form.airTime = platformInfo.airTime
  form.channel = platformInfo.channel
  form.sourceUrl = platformInfo.sourceUrl
}

/**
 * 提交编辑
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  submitting.value = true
  try {
    const submitData = {
      name: form.name,
      shortName: form.shortName,
      emoji: form.emoji,
      year: form.year,
      sort: form.sort,
      isShow: form.isShow,
      tags: form.selectedTags,
      description: form.description,
      airDate: form.airDate,
      airTime: form.airTime,
      channel: form.channel,
      sourceUrl: form.sourceUrl
    }
    await galaService.updatePlatform(platformId.value, submitData)
    ElMessage.success('更新成功')
    isEditMode.value = false
    await loadPlatformDetail()
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

/**
 * 删除平台
 */
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除平台 "${platformInfo.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await galaService.deletePlatform(platformId.value)
    ElMessage.success('删除成功')
    router.push('/content/gala')
  } catch (error) {
    // 用户取消
  }
}

/**
 * 新建节目
 */
const handleCreateProgram = () => {
  Object.assign(programForm, {
    title: '',
    type: '',
    performers: '',
    airTime: '',
    orderNum: programs.value.length + 1,
    duration: 0,
    description: ''
  })
  programDialogVisible.value = true
}

/**
 * 提交新节目
 */
const handleSubmitProgram = async () => {
  if (!programFormRef.value) return

  await programFormRef.value.validate(async (valid) => {
    if (!valid) return

    programSubmitting.value = true
    try {
      await galaService.createProgram({
        ...programForm,
        platform_id: platformId.value
      })
      ElMessage.success('创建成功')
      programDialogVisible.value = false
      await loadPrograms()
    } catch (error: any) {
      ElMessage.error(error.message || '创建失败')
    } finally {
      programSubmitting.value = false
    }
  })
}

/**
 * 节目对话框关闭
 */
const handleProgramDialogClosed = () => {
  programFormRef.value?.resetFields()
}

/**
 * 编辑节目（行内编辑）
 */
const editProgram = (row: any, index: number) => {
  originalProgram.value = { ...row }
  editingIndex.value = index
}

/**
 * 保存节目
 */
const saveProgram = async (row: any, index: number) => {
  try {
    const updateData = {
      title: row.title,
      type: row.type,
      performers: row.performers,
      airTime: row.airTime,
      orderNum: row.orderNum,
      duration: row.duration,
      description: row.description
    }
    await galaService.updateProgram(row.id, updateData)
    ElMessage.success('保存成功')
    editingIndex.value = -1
    originalProgram.value = null
    await loadPrograms()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

/**
 * 取消编辑节目
 */
const cancelEdit = (index: number) => {
  if (originalProgram.value) {
    programs.value[index] = { ...originalProgram.value }
  }
  editingIndex.value = -1
  originalProgram.value = null
}

/**
 * 删除节目
 */
const deleteProgram = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除节目 "${row.title}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await galaService.deleteProgram(row.id)
    ElMessage.success('删除成功')
    await loadPrograms()
  } catch (error) {
    // 用户取消
  }
}

onMounted(async () => {
  await Promise.all([loadPlatformDetail(), loadPrograms()])
})
</script>

<style scoped lang="scss">
.platform-detail-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;

    .page-title-section {
      flex: 1;

      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 8px 0 0 0;
        display: flex;
        align-items: center;
        gap: 12px;

        .platform-emoji {
          font-size: 28px;
        }
      }
    }

    .page-actions {
      display: flex;
      gap: 12px;
    }
  }

  .info-section {
    .card {
      .platform-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .short-name {
        font-size: 18px;
        font-weight: 600;
        color: #409eff;
        background: #ecf5ff;
        padding: 4px 12px;
        border-radius: 4px;
      }

      .emoji-display {
        font-size: 32px;
      }

      .empty-text {
        color: #909399;
        font-style: italic;
      }
    }
  }

  .programs-section {
    .stats-card {
      margin-bottom: 20px;

      .stat-item {
        text-align: center;
        padding: 16px;
        background: #f5f7fa;
        border-radius: 4px;

        .stat-label {
          font-size: 13px;
          color: #909399;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
        }
      }
    }

    .actions-bar {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .empty-state {
      padding: 40px 0;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      padding: 16px 0;
      border-top: 1px solid #ebeef5;
    }
  }
}
</style>
