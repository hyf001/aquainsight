import request from './request'

// ==================== 类型定义 ====================

export interface UserVO {
  id: string
  name: string
  avatar: string
  role: string
}

export interface UserInfoVO {
  id: number
  name: string
  gender: string
  phone: string
  email: string
  avatar: string
  role: string
  status: number
  createTime: string
  isLeader?: number
}

export interface CreateUserRequest {
  password: string
  name: string
  phone: string
  email?: string
  role?: string
  gender?: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  email?: string
  avatar?: string
  gender?: string
}

export interface SetRoleRequest {
  role: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// ==================== User API ====================

export const userApi = {
  // 获取人员分页列表
  getUsers: (params: { pageNum?: number; pageSize?: number }) => {
    return request.get<PageResult<UserInfoVO>>('/user/list', { params })
  },

  // 创建人员
  createUser: (data: CreateUserRequest) => {
    return request.post<UserInfoVO>('/user', data)
  },

  // 更新人员信息
  updateUser: (id: number, data: UpdateUserRequest) => {
    return request.put<UserInfoVO>(`/user/${id}`, data)
  },

  // 删除人员
  deleteUser: (id: number) => {
    return request.delete(`/user/${id}`)
  },

  // 设置角色
  setRole: (id: number, data: SetRoleRequest) => {
    return request.put<UserInfoVO>(`/user/${id}/role`, data)
  },

  // 重置密码
  resetPassword: (id: number) => {
    return request.put(`/user/${id}/reset-password`)
  },

  // 上传头像
  uploadAvatar: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<{ url: string }>(`/user/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
