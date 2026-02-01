// 认证相关 API
import { http } from '@/utils/request'
import type { LoginForm, AdminUser } from '@/types'

// 登录
export const login = (data: LoginForm) => {
  return http.post<{ token: string; userInfo: AdminUser }>('/auth/login', data)
}

// 获取当前用户信息
export const getProfile = () => {
  return http.get<AdminUser>('/auth/profile')
}

// 修改密码
export const changePassword = (data: { oldPassword: string; newPassword: string }) => {
  return http.put('/auth/password', data)
}

// 获取管理员列表
export const getAdminList = (params: { page?: number; pageSize?: number }) => {
  return http.get('/auth/users', { params })
}

// 创建管理员
export const createAdmin = (data: {
  username: string
  password: string
  realName: string
  role: string
}) => {
  return http.post('/auth/users', data)
}

// 更新管理员
export const updateAdmin = (id: number, data: { realName: string; role: string; status: string }) => {
  return http.put(`/auth/users/${id}`, data)
}

// 删除管理员
export const deleteAdmin = (id: number) => {
  return http.delete(`/auth/users/${id}`)
}
