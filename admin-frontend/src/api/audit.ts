// 审核相关 API
import { http } from '@/utils/request'
import type { PageResponse, AuditLog, AuditStats, ResourceType, RedpackActivity } from '@/types'

// 获取待审核列表
export const getPendingList = (params: { type?: string; page?: number; pageSize?: number }) => {
  return http.get<PageResponse & { stats: Record<string, number> }>('/audit/pending', { params })
}

// 获取审核详情
export const getAuditDetail = (type: string, id: number) => {
  return http.get<any>(`/audit/${type}/${id}`)
}

// 审核通过
export const approve = (type: string, id: number, note?: string) => {
  return http.post(`/audit/${type}/${id}/approve`, { note })
}

// 审核拒绝
export const reject = (type: string, id: number, reason: string) => {
  return http.post(`/audit/${type}/${id}/reject`, { reason })
}

// 批量审核
export const batchApprove = (type: string, ids: number[], note?: string) => {
  return http.post(`/audit/${type}/batch-approve`, { ids, note })
}

// 获取审核日志
export const getAuditLogs = (params: {
  resourceType?: string
  resourceId?: number
  page?: number
  pageSize?: number
}) => {
  return http.get<PageResponse<AuditLog>>('/audit/logs', { params })
}

// 获取审核统计
export const getAuditStats = () => {
  return http.get<AuditStats>('/audit/stats')
}
