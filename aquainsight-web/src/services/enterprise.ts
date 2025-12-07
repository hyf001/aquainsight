import request from './request'

export type Enterprise = {
  id: number
  enterpriseName: string
  enterpriseCode: string
  enterpriseTag: string | null
  contactPerson: string | null
  contactPhone: string | null
  address: string | null
  description: string | null
  siteCount: number
  createTime: string
  updateTime: string
}

export type CreateEnterpriseRequest = {
  enterpriseName: string
  enterpriseCode: string
  enterpriseTag?: string
  contactPerson?: string
  contactPhone?: string
  address?: string
  description?: string
}

export type UpdateEnterpriseRequest = {
  enterpriseName?: string
  enterpriseTag?: string
  contactPerson?: string
  contactPhone?: string
  address?: string
  description?: string
}

export type PageResult<T> = {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

// 获取企业列表（分页）
export const getEnterpriseList = (
  pageNum: number = 1,
  pageSize: number = 10,
  enterpriseName?: string,
  enterpriseTag?: string
) => {
  return request.get<PageResult<Enterprise>>('/enterprises', {
    params: { pageNum, pageSize, enterpriseName, enterpriseTag },
  })
}

// 获取所有企业（不分页）
export const getAllEnterprises = () => {
  return request.get<Enterprise[]>('/enterprises/all')
}

// 创建企业
export const createEnterprise = (data: CreateEnterpriseRequest) => {
  return request.post<Enterprise>('/enterprises', data)
}

// 更新企业
export const updateEnterprise = (id: number, data: UpdateEnterpriseRequest) => {
  return request.put<Enterprise>(`/enterprises/${id}`, data)
}

// 删除企业
export const deleteEnterprise = (id: number) => {
  return request.delete(`/enterprises/${id}`)
}

// 获取企业详情
export const getEnterpriseDetail = (id: number) => {
  return request.get<Enterprise>(`/enterprises/${id}`)
}
