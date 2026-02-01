// axios 请求封装
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/admin/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data

    if (code === 0) {
      return data
    } else if (code === -2) {
      // 未登录或 token 过期
      ElMessageBox.alert('登录已过期，请重新登录', '提示', {
        confirmButtonText: '确定',
        showClose: false,
        callback: () => {
          const authStore = useAuthStore()
          authStore.logout()
          window.location.href = '/login'
        }
      })
      return Promise.reject(new Error(message))
    } else {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        ElMessageBox.alert('未登录或登录已过期', '提示', {
          confirmButtonText: '确定',
          showClose: false,
          callback: () => {
            const authStore = useAuthStore()
            authStore.logout()
            window.location.href = '/login'
          }
        })
      } else if (status === 403) {
        ElMessage.error('权限不足')
      } else if (status === 404) {
        ElMessage.error('请求的资源不存在')
      } else if (status === 500) {
        ElMessage.error('服务器错误')
      } else {
        ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

export default request

// 导出请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config)
  }
}
