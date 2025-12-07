import request from './request'

export type Department = {
  id: number
  name: string
  parentId: number
  sort: number
  leaderId: number | null
  children?: Department[]
}

export type Employee = {
  id: number
  name: string
  gender: string
  departmentId: number | null
  departmentName: string | null
  isLeader: number
  status: number
  phone: string | null
  email: string | null
}

export type DepartmentRequest = {
  name: string
  parentId?: number
  sort?: number
  leaderId?: number
}

// 获取部门树
export const getDepartmentTree = () => {
  return request.get<Department[]>('/organization/departments/tree')
}

// 获取所有部门列表
export const getAllDepartments = () => {
  return request.get<Department[]>('/organization/departments')
}

// 创建部门
export const createDepartment = (data: DepartmentRequest) => {
  return request.post<Department>('/organization/departments', data)
}

// 更新部门
export const updateDepartment = (id: number, data: DepartmentRequest) => {
  return request.put<Department>(`/organization/departments/${id}`, data)
}

// 删除部门
export const deleteDepartment = (id: number) => {
  return request.delete(`/organization/departments/${id}`)
}

// 获取所有员工
export const getAllEmployees = () => {
  return request.get<Employee[]>('/organization/employees')
}

// 根据部门获取员工
export const getEmployeesByDepartment = (departmentId: number) => {
  return request.get<Employee[]>(`/organization/employees/department/${departmentId}`)
}

// 设置负责人
export const setLeader = (userId: number, departmentId: number) => {
  return request.put<Employee>(`/organization/employees/${userId}/set-leader/${departmentId}`)
}

// 更新员工部门
export const updateEmployeeDepartment = (userId: number, departmentId: number) => {
  return request.put<Employee>(`/organization/employees/${userId}/department/${departmentId}`)
}

// 更新员工状态
export const updateEmployeeStatus = (userId: number, status: number) => {
  return request.put<Employee>(`/organization/employees/${userId}/status/${status}`)
}

// 从部门移除员工
export const removeEmployeeFromDepartment = (userId: number, departmentId: number) => {
  return request.delete<Employee>(`/organization/employees/${userId}/department/${departmentId}`)
}

// 取消负责人
export const unsetLeader = (userId: number, departmentId: number) => {
  return request.put<Employee>(`/organization/employees/${userId}/unset-leader/${departmentId}`)
}

// ==================== 人员管理接口 ====================

export type UserInfo = {
  id: number
  name: string
  gender: string
  phone: string
  email: string
  avatar: string | null
  role: string
  status: number
  createTime: string
}

export type PageResult<T> = {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

export type CreateUserRequest = {
  name: string
  password: string
  gender?: string
  phone: string
  email?: string
  role?: string
}

export type UpdateUserRequest = {
  name?: string
  gender?: string
  phone?: string
  email?: string
  avatar?: string
}

// 获取人员列表（分页）
export const getUserList = (pageNum: number = 1, pageSize: number = 10) => {
  return request.get<PageResult<UserInfo>>('/user/list', { params: { pageNum, pageSize } })
}

// 创建人员
export const createUser = (data: CreateUserRequest) => {
  return request.post<UserInfo>('/user', data)
}

// 更新人员信息
export const updateUser = (id: number, data: UpdateUserRequest) => {
  return request.put<UserInfo>(`/user/${id}`, data)
}

// 删除人员
export const deleteUser = (id: number) => {
  return request.delete(`/user/${id}`)
}

// 设置角色
export const setUserRole = (id: number, role: string) => {
  return request.put<UserInfo>(`/user/${id}/role`, { role })
}

// 重置密码
export const resetUserPassword = (id: number) => {
  return request.put<void>(`/user/${id}/reset-password`)
}

// 上传头像
export const uploadAvatar = (id: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<{ url: string }>(`/user/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
