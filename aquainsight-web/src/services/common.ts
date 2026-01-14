import request from './request'

// 图片上传响应
export interface ImageUploadResponse {
  url: string
  filename: string
  originalName: string
  size: string
}

// 通用接口
export const commonApi = {
  // 上传图片
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<ImageUploadResponse>('/common/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 获取图片完整URL
  // 后端返回的 url 格式: /api/common/image/images/2024/12/14/xxx.jpg
  // 需要拼接成完整的访问地址: http://localhost:8080/aquainsight/api/common/image/...
  getImageUrl: (path: string) => {
    if (!path) return ''
    // 如果已经是完整URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    // 确保路径以 / 开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    // 使用与 request.ts 相同的方式获取 API 基础路径
    const apiBaseUrl = (import.meta as Record<string, unknown>).env
      ? ((import.meta as Record<string, Record<string, string>>).env.VITE_API_URL || 'http://localhost:8080')
      : 'http://localhost:8080'
    return `${apiBaseUrl}/aquainsight${normalizedPath}`
  },
}
