// 春晚管理 API
import { http } from '@/utils/request'

// 平台管理
export const adminGetPlatforms = (params: { reviewStatus?: string }) => {
  return http.get('/admin/gala/platforms', { params })
}

export const createPlatform = (data: {
  name: string
  airDate: string
  airTime?: string
  channel?: string
  description?: string
  sort?: number
}) => {
  return http.post('/admin/gala/platforms', data)
}

export const updatePlatform = (id: number, data: {
  name?: string
  airDate?: string
  airTime?: string
  channel?: string
  description?: string
  sort?: number
}) => {
  return http.put(`/admin/gala/platforms/${id}`, data)
}

export const deletePlatform = (id: number) => {
  return http.delete(`/admin/gala/platforms/${id}`)
}

// 节目管理
export const adminGetPrograms = (params: { platformId?: number; reviewStatus?: string }) => {
  return http.get('/admin/gala/programs', { params })
}

export const createProgram = (data: {
  platform_id: number
  title: string
  type?: string
  performers?: string
  airTime?: string
  orderNum?: number
}) => {
  return http.post('/admin/gala/programs', data)
}

export const updateProgram = (id: number, data: {
  title?: string
  type?: string
  performers?: string
  airTime?: string
  orderNum?: number
}) => {
  return http.put(`/admin/gala/programs/${id}`, data)
}

export const deleteProgram = (id: number) => {
  return http.delete(`/admin/gala/programs/${id}`)
}

// 服务对象（供页面使用）
export const galaService = {
  adminGetPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
  adminGetPrograms,
  createProgram,
  updateProgram,
  deleteProgram
}
