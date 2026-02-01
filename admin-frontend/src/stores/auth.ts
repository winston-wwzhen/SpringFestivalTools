// 认证状态管理
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AdminUser } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const userInfo = ref<AdminUser | null>(null)

  // 初始化状态
  const init = () => {
    const savedToken = localStorage.getItem('admin_token')
    const savedUserInfo = localStorage.getItem('admin_userInfo')

    if (savedToken) {
      token.value = savedToken
    }

    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch {
        userInfo.value = null
      }
    }
  }

  // 设置认证信息
  const setAuth = (authToken: string, info: AdminUser) => {
    token.value = authToken
    userInfo.value = info

    localStorage.setItem('admin_token', authToken)
    localStorage.setItem('admin_userInfo', JSON.stringify(info))
  }

  // 清除认证信息
  const clearAuth = () => {
    token.value = ''
    userInfo.value = null

    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_userInfo')
  }

  // 登录
  const login = async (authToken: string, info: AdminUser) => {
    setAuth(authToken, info)
  }

  // 登出
  const logout = () => {
    clearAuth()
  }

  // 检查是否已登录
  const isAuthenticated = () => {
    return !!token.value
  }

  // 检查是否有指定角色
  const hasRole = (roles: string[]) => {
    return userInfo.value ? roles.includes(userInfo.value.role) : false
  }

  // 获取用户角色
  const getRole = () => {
    return userInfo.value?.role || ''
  }

  return {
    token,
    userInfo,
    init,
    login,
    logout,
    isAuthenticated,
    hasRole,
    getRole
  }
})
