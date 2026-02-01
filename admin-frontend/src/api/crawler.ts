// 爬虫相关 API
import { http } from '@/utils/request'
import type { PageResponse, CrawlerTask, CrawlerLog } from '@/types'

// 获取任务列表
export const getTaskList = (params: { page?: number; pageSize?: number }) => {
  return http.get<PageResponse<CrawlerTask>>('/crawler/tasks', { params })
}

// 获取任务详情
export const getTaskDetail = (id: number) => {
  return http.get<CrawlerTask>(`/crawler/tasks/${id}`)
}

// 创建任务
export const createTask = (data: {
  name: string
  type: string
  sourceUrl: string
  cronExpression: string
  config?: Record<string, any>
}) => {
  return http.post<CrawlerTask>('/crawler/tasks', data)
}

// 更新任务
export const updateTask = (
  id: number,
  data: {
    name?: string
    sourceUrl?: string
    cronExpression?: string
    config?: Record<string, any>
    status?: string
  }
) => {
  return http.put<CrawlerTask>(`/crawler/tasks/${id}`, data)
}

// 删除任务
export const deleteTask = (id: number) => {
  return http.delete(`/crawler/tasks/${id}`)
}

// 手动触发任务
export const runTask = (id: number) => {
  return http.post(`/crawler/tasks/${id}/run`)
}

// 暂停任务
export const pauseTask = (id: number) => {
  return http.post(`/crawler/tasks/${id}/pause`)
}

// 恢复任务
export const resumeTask = (id: number) => {
  return http.post(`/crawler/tasks/${id}/resume`)
}

// 获取执行日志
export const getTaskLogs = (id: number, params: { page?: number; pageSize?: number }) => {
  return http.get<PageResponse<CrawlerLog>>(`/crawler/tasks/${id}/logs`, { params })
}
