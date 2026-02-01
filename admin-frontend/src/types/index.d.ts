// 类型定义

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PageResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 管理员类型
export interface AdminUser {
  id: number
  username: string
  realName: string
  role: 'super_admin' | 'admin' | 'editor'
  status: 'active' | 'disabled'
  lastLoginAt: string | null
  createdAt: string
}

export interface LoginForm {
  username: string
  password: string
}

// 审核相关类型
export type ResourceType = 'redpack' | 'gala_platform' | 'gala_program' | 'emoticon' | 'kinship'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface AuditLog {
  id: number
  adminId: number
  resourceName?: string
  resourceType: ResourceType
  resourceId: number
  action: 'approve' | 'reject' | 'delete' | 'edit'
  oldStatus: string
  newStatus: string
  reason: string
  ipAddress: string
  createdAt: string
}

export interface AuditStats {
  [key: string]: {
    pending: number
    approved: number
    rejected: number
  }
}

// 红包活动类型
export interface RedpackActivity {
  id: number
  platform: string
  title: string
  description: string
  rules: string
  startTime: string
  endTime: string
  status: 'pending' | 'active' | 'ended'
  reviewStatus: ReviewStatus
  sourceUrl: string
  reviewedAt: string | null
  reviewedBy: number | null
  reviewerNote: string
  createdAt: string
}

// 爬虫相关类型
export interface CrawlerTask {
  id: number
  name: string
  type: 'redpack' | 'gala' | 'emoticon' | 'kinship'
  sourceUrl: string
  config: Record<string, any>
  cronExpression: string
  status: 'active' | 'paused' | 'disabled'
  lastRunAt: string | null
  nextRunAt: string | null
  successCount: number
  failCount: number
  createdAt: string
}

export interface CrawlerLog {
  id: number
  taskId: number
  startTime: string
  endTime: string | null
  status: 'running' | 'success' | 'failed'
  itemsFetched: number
  itemsCreated: number
  itemsUpdated: number
  errorMessage: string
}

// 路由元信息
export interface RouteMetaCustom {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
}
