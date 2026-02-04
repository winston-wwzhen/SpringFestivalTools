// 春晚管理 API
import { http } from '@/utils/request'

// 平台管理
export const adminGetPlatforms = (params: { reviewStatus?: string }) => {
  return http.get('/admin/gala/platforms', { params })
}

export const createPlatform = (data: {
  name: string
  year: number
  airDate?: string
  airTime?: string
  channel?: string
  logo?: string
  poster?: string
  description?: string
  sort?: number
  isShow?: boolean
}) => {
  return http.post('/admin/gala/platforms', data)
}

export const updatePlatform = (id: number, data: {
  name?: string
  year?: number
  airDate?: string
  airTime?: string
  channel?: string
  logo?: string
  poster?: string
  description?: string
  sort?: number
  isShow?: boolean
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
  performer?: string
  performers?: string
  airTime?: string
  startTime?: string
  orderNum?: number
  duration?: number
  description?: string
}) => {
  return http.post('/admin/gala/programs', data)
}

export const updateProgram = (id: number, data: {
  platform_id?: number
  title?: string
  type?: string
  performer?: string
  performers?: string
  airTime?: string
  startTime?: string
  orderNum?: number
  duration?: number
  description?: string
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
