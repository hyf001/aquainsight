import request from './request'

export type JobCategory = {
  id: number
  name: string
  code: string
  needPhoto: number
  photoTypes: string | null
  overdueDays: number
  description: string | null
  createTime: string
  updateTime: string
}

export type CreateJobCategoryRequest = {
  name: string
  code: string
  needPhoto: number
  photoTypes?: string
  overdueDays: number
  description?: string
}

export type UpdateJobCategoryRequest = {
  name?: string
  needPhoto?: number
  photoTypes?: string
  overdueDays?: number
  description?: string
}

// 获取作业类别列表
export const getJobCategoryList = (name?: string) => {
  return request.get<any, JobCategory[]>('/maintenance/job-categories', {
    params: { name },
  })
}

// 创建作业类别
export const createJobCategory = (data: CreateJobCategoryRequest) => {
  return request.post<any, JobCategory>('/maintenance/job-categories', data)
}

// 更新作业类别
export const updateJobCategory = (id: number, data: UpdateJobCategoryRequest) => {
  return request.put<any, JobCategory>(`/maintenance/job-categories/${id}`, data)
}

// 删除作业类别
export const deleteJobCategory = (id: number) => {
  return request.delete(`/maintenance/job-categories/${id}`)
}

// 批量删除作业类别
export const batchDeleteJobCategories = (ids: number[]) => {
  return request.delete('/maintenance/job-categories', { data: ids })
}

// 获取作业类别详情
export const getJobCategoryDetail = (id: number) => {
  return request.get<any, JobCategory>(`/maintenance/job-categories/${id}`)
}

// ========== 方案管理 ==========

export type SchemeItem = {
  id: number
  schemeId: number
  jobCategoryId: number
  jobCategory?: JobCategory
  itemName: string
  description: string | null
  createTime: string
  updateTime: string
}

export type Scheme = {
  id: number
  name: string
  code: string
  creator: string | null
  createTime: string
  updateTime: string
  items?: SchemeItem[]
}

export type CreateSchemeRequest = {
  name: string
  code: string
}

export type UpdateSchemeRequest = {
  name: string
}

export type CreateSchemeItemRequest = {
  schemeId: number
  jobCategoryId: number
  itemName: string
  description?: string
}

export type UpdateSchemeItemRequest = {
  itemName: string
  description?: string
}

// 获取方案列表
export const getSchemeList = (name?: string) => {
  return request.get<any, Scheme[]>('/maintenance/schemes', {
    params: { name },
  })
}

// 创建方案
export const createScheme = (data: CreateSchemeRequest) => {
  return request.post<any, Scheme>('/maintenance/schemes', data)
}

// 更新方案
export const updateScheme = (id: number, data: UpdateSchemeRequest) => {
  return request.put<any, Scheme>(`/maintenance/schemes/${id}`, data)
}

// 删除方案
export const deleteScheme = (id: number) => {
  return request.delete(`/maintenance/schemes/${id}`)
}

// 批量删除方案
export const batchDeleteSchemes = (ids: number[]) => {
  return request.delete('/maintenance/schemes', { data: ids })
}

// 获取方案详情（包含方案项目）
export const getSchemeDetail = (id: number, withItems: boolean = true) => {
  return request.get<any, Scheme>(`/maintenance/schemes/${id}`, {
    params: { withItems },
  })
}

// 获取方案的所有项目
export const getSchemeItems = (schemeId: number) => {
  return request.get<any, SchemeItem[]>(`/maintenance/schemes/${schemeId}/items`)
}

// 添加方案项目
export const addSchemeItem = (data: CreateSchemeItemRequest) => {
  return request.post<any, SchemeItem>('/maintenance/scheme-items', data)
}

// 更新方案项目
export const updateSchemeItem = (id: number, data: UpdateSchemeItemRequest) => {
  return request.put<any, SchemeItem>(`/maintenance/scheme-items/${id}`, data)
}

// 删除方案项目
export const deleteSchemeItem = (id: number) => {
  return request.delete(`/maintenance/scheme-items/${id}`)
}

// ========== 站点任务计划管理 ==========

export type PeriodConfig = {
  periodType: 'INTERVAL' | 'WEEK' | 'MONTH'
  n?: number
}

export type SiteJobPlan = {
  id: number
  siteId: number
  siteName?: string
  periodConfig: PeriodConfig
  schemeId: number
  schemeName?: string
  schemeCode?: string
  departmentId: number
  departmentName?: string
  jobPlanState?: string
  creator: string
  createTime: string
  updater: string
  updateTime: string
}

export type ConfigureSiteJobPlanRequest = {
  siteId: number
  periodConfig: {
    periodType: 'INTERVAL' | 'WEEK' | 'MONTH'
    n?: number
  }
  schemeId: number
  departmentId: number
}

// 配置站点任务计划（新增或更新）
export const configureSiteJobPlan = (data: ConfigureSiteJobPlanRequest) => {
  return request.post<any, SiteJobPlan>('/maintenance/site-job-plans', data)
}

// 根据站点ID获取任务计划
export const getSiteJobPlanBySiteId = (siteId: number) => {
  return request.get<any, SiteJobPlan>(`/maintenance/site-job-plans/site/${siteId}`)
}

// 删除站点任务计划
export const deleteSiteJobPlan = (id: number) => {
  return request.delete(`/maintenance/site-job-plans/${id}`)
}

// 分页查询站点及其任务计划
export const getSitesWithJobPlans = (
  pageNum: number = 1,
  pageSize: number = 10,
  siteType?: string,
  enterpriseId?: number
) => {
  return request.get<any, any>('/maintenance/sites-with-job-plans', {
    params: { pageNum, pageSize, siteType, enterpriseId },
  })
}
