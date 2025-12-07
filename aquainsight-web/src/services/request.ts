import axios, { type AxiosRequestConfig } from 'axios'
import { message } from 'antd'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      // 使用X-TOKEN作为请求头
      config.headers['X-TOKEN'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const { code, data, message: msg } = response.data
    if (code === '0000') {
      return data
    } else if (code === '401') {
      // token过期或无效，跳转到登录页
      message.error(msg || '登录已过期，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/aquainsight/login'
      return Promise.reject(new Error(msg))
    } else {
      message.error(msg || '请求失败')
      return Promise.reject(new Error(msg))
    }
  },
  (error) => {
    // HTTP状态码401，未授权
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || '登录已过期，请重新登录'
      message.error(msg)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/aquainsight/login'
    } else {
      message.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

// 包装 request 函数，返回 data 的类型而不是 AxiosResponse
const request = <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.request(config)
}

// 为兼容性添加快捷方法
request.get = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ ...config, method: 'GET', url })
}

request.post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ ...config, method: 'POST', url, data })
}

request.put = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ ...config, method: 'PUT', url, data })
}

request.delete = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ ...config, method: 'DELETE', url })
}

export default request
