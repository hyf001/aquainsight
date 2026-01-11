import request from './request'

export interface EnterpriseVO {
  id: number
  enterpriseCode: string
  enterpriseName: string
  enterpriseTag: string
  contactPerson: string
  contactPhone: string
  address: string
  description: string
  siteCount: number
  createTime?: string
  updateTime?: string
}

export interface CreateEnterpriseRequest {
  enterpriseCode: string
  enterpriseName: string
  enterpriseTag?: string
  contactPerson?: string
  contactPhone?: string
  address?: string
  description?: string
}

export interface UpdateEnterpriseRequest {
  enterpriseName?: string
  enterpriseTag?: string
  contactPerson?: string
  contactPhone?: string
  address?: string
  description?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

export const enterpriseApi = {
  // 获取企业分页列表
  getEnterprises: (params: {
    pageNum?: number
    pageSize?: number
    enterpriseName?: string
    enterpriseTag?: string
  }) => {
    return request.get<PageResult<EnterpriseVO>>('/enterprises', { params })
  },

  // 获取所有企业（不分页）
  getAll: () => {
    return request.get<EnterpriseVO[]>('/enterprises/all')
  },

  // 获取企业详情
  getById: (id: number) => {
    return request.get<EnterpriseVO>(`/enterprises/${id}`)
  },

  // 创建企业
  create: (data: CreateEnterpriseRequest) => {
    return request.post<EnterpriseVO>('/enterprises', data)
  },

  // 更新企业
  update: (id: number, data: UpdateEnterpriseRequest) => {
    return request.put<EnterpriseVO>(`/enterprises/${id}`, data)
  },

  // 删除企业
  delete: (id: number) => {
    return request.delete(`/enterprises/${id}`)
  },
}
