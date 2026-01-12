import request from './request'
import type { UserInfoVO } from './user'

// ==================== 类型定义 ====================

export interface DepartmentVO {
  id: number
  name: string
  parentId: number
  sort: number
  leaderId: number
  children?: DepartmentVO[]
}

export interface DepartmentRequest {
  name: string
  parentId?: number
  sort?: number
  leaderId?: number
}

// ==================== Organization API ====================

export const organizationApi = {
  // ==================== 部门管理 ====================

  // 获取部门树
  getDepartmentTree: () => {
    return request.get<DepartmentVO[]>('/organization/departments/tree')
  },

  // 获取所有部门列表（平铺）
  getDepartments: () => {
    return request.get<DepartmentVO[]>('/organization/departments')
  },

  // 创建部门
  createDepartment: (data: DepartmentRequest) => {
    return request.post<DepartmentVO>('/organization/departments', data)
  },

  // 更新部门
  updateDepartment: (id: number, data: DepartmentRequest) => {
    return request.put<DepartmentVO>(`/organization/departments/${id}`, data)
  },

  // 删除部门
  deleteDepartment: (id: number) => {
    return request.delete(`/organization/departments/${id}`)
  },

  // ==================== 员工管理 ====================

  // 获取所有员工
  getAllEmployees: () => {
    return request.get<UserInfoVO[]>('/organization/employees')
  },

  // 根据部门获取员工列表
  getEmployeesByDepartment: (departmentId: number) => {
    return request.get<UserInfoVO[]>(`/organization/employees/department/${departmentId}`)
  },

  // 添加员工到部门
  addEmployeeToDepartment: (userId: number, departmentId: number, isLeader: boolean = false) => {
    return request.post(`/organization/employees/${userId}/department/${departmentId}`, null, {
      params: { isLeader },
    })
  },

  // 更新员工部门
  updateEmployeeDepartment: (userId: number, departmentId: number) => {
    return request.put(`/organization/employees/${userId}/department/${departmentId}`)
  },

  // 设置员工为负责人
  setLeader: (userId: number, departmentId: number) => {
    return request.put(`/organization/employees/${userId}/set-leader/${departmentId}`)
  },

  // 取消负责人
  unsetLeader: (userId: number, departmentId: number) => {
    return request.put(`/organization/employees/${userId}/unset-leader/${departmentId}`)
  },

  // 更新员工状态
  updateEmployeeStatus: (userId: number, status: number) => {
    return request.put(`/organization/employees/${userId}/status/${status}`)
  },

  // 从部门移除员工
  removeEmployeeFromDepartment: (userId: number, departmentId: number) => {
    return request.delete(`/organization/employees/${userId}/department/${departmentId}`)
  },
}
