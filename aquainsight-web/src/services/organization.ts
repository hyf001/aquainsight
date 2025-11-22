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
  return request.get<any, Department[]>('/organization/departments/tree')
}

// 获取所有部门列表
export const getAllDepartments = () => {
  return request.get<any, Department[]>('/organization/departments')
}

// 创建部门
export const createDepartment = (data: DepartmentRequest) => {
  return request.post<any, Department>('/organization/departments', data)
}

// 更新部门
export const updateDepartment = (id: number, data: DepartmentRequest) => {
  return request.put<any, Department>(`/organization/departments/${id}`, data)
}

// 删除部门
export const deleteDepartment = (id: number) => {
  return request.delete(`/organization/departments/${id}`)
}

// 获取所有员工
export const getAllEmployees = () => {
  return request.get<any, Employee[]>('/organization/employees')
}

// 根据部门获取员工
export const getEmployeesByDepartment = (departmentId: number) => {
  return request.get<any, Employee[]>(`/organization/employees/department/${departmentId}`)
}

// 设置负责人
export const setLeader = (userId: number, departmentId: number) => {
  return request.put<any, Employee>(`/organization/employees/${userId}/set-leader/${departmentId}`)
}

// 更新员工部门
export const updateEmployeeDepartment = (userId: number, departmentId: number) => {
  return request.put<any, Employee>(`/organization/employees/${userId}/department/${departmentId}`)
}

// 更新员工状态
export const updateEmployeeStatus = (userId: number, status: number) => {
  return request.put<any, Employee>(`/organization/employees/${userId}/status/${status}`)
}

// 从部门移除员工
export const removeEmployeeFromDepartment = (userId: number) => {
  return request.delete<any, Employee>(`/organization/employees/${userId}/department`)
}

// 取消负责人
export const unsetLeader = (userId: number) => {
  return request.put<any, Employee>(`/organization/employees/${userId}/unset-leader`)
}
