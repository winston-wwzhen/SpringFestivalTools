// 红包活动管理 API
import { http } from '@/utils/request'
import type { PageResponse, RedpackActivity } from '@/types'

// 获取列表（管理端）
export const getList = (params: {
  page?: number
  pageSize?: number
  platform?: string
  status?: string
  reviewStatus?: string
}) => {
  return http.get<PageResponse<RedpackActivity>>('/redpack/list', { params })
}

// 获取详情
export const getDetail = (id: number) => {
  return http.get<RedpackActivity>(`/redpack/${id}`)
}

// 获取数量
export const getCount = () => {
  return http.get<{ count: number }>('/redpack/count')
}

// 管理端 API
export const adminGetList = (params: any) => {
  return http.get<PageResponse<RedpackActivity>>('/admin/redpack/list', { params })
}

export const create = (data: {
  platform: string
  title: string
  description?: string
  rules?: string
  startTime: string
  endTime: string
  status?: string
}) => {
  return http.post('/admin/redpack/create', data)
}

export const update = (id: number, data: {
  platform: string
  title: string
  description?: string
  rules?: string
  startTime: string
  endTime: string
  status?: string
}) => {
  return http.put(`/admin/redpack/${id}`, data)
}

export const deleteItem = (id: number) => {
  return http.delete(`/admin/redpack/${id}`)
}

// 服务对象（供页面使用）
export const redpackService = {
  adminGetList,
  create,
  update,
  delete: deleteItem
}
