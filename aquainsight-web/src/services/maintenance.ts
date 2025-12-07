import request from './request'

export type JobParameter = {
  name: string
  type: 'TEXT' | 'IMAGE' | 'TEXT_LIST' | 'IMAGE_LIST'
  required: boolean
}

export type JobCategory = {
  id: number
  name: string
  code: string
  parameters: JobParameter[] | null
  overdueDays: number
  description: string | null
  createTime: string
  updateTime: string
}

export type CreateJobCategoryRequest = {
  name: string
  code: string
  parameters?: JobParameter[]
  overdueDays: number
  description?: string
}

export type UpdateJobCategoryRequest = {
  name?: string
  parameters?: JobParameter[]
  overdueDays?: number
  description?: string
}

// 获取作业类别列表
export const getJobCategoryList = (name?: string) => {
  return request.get<JobCategory[]>('/maintenance/job-categories', {
    params: { name },
  })
}

// 创建作业类别
export const createJobCategory = (data: CreateJobCategoryRequest) => {
  return request.post<JobCategory>('/maintenance/job-categories', data)
}

// 更新作业类别
export const updateJobCategory = (id: number, data: UpdateJobCategoryRequest) => {
  return request.put<JobCategory>(`/maintenance/job-categories/${id}`, data)
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
  return request.get<JobCategory>(`/maintenance/job-categories/${id}`)
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
  return request.get<Scheme[]>('/maintenance/schemes', {
    params: { name },
  })
}

// 创建方案
export const createScheme = (data: CreateSchemeRequest) => {
  return request.post<Scheme>('/maintenance/schemes', data)
}

// 更新方案
export const updateScheme = (id: number, data: UpdateSchemeRequest) => {
  return request.put<Scheme>(`/maintenance/schemes/${id}`, data)
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
  return request.get<Scheme>(`/maintenance/schemes/${id}`, {
    params: { withItems },
  })
}

// 获取方案的所有项目
export const getSchemeItems = (schemeId: number) => {
  return request.get<SchemeItem[]>(`/maintenance/schemes/${schemeId}/items`)
}

// 添加方案项目
export const addSchemeItem = (data: CreateSchemeItemRequest) => {
  return request.post<SchemeItem>('/maintenance/scheme-items', data)
}

// 更新方案项目
export const updateSchemeItem = (id: number, data: UpdateSchemeItemRequest) => {
  return request.put<SchemeItem>(`/maintenance/scheme-items/${id}`, data)
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
  return request.post<SiteJobPlan>('/maintenance/site-job-plans', data)
}

// 根据站点ID获取任务计划
export const getSiteJobPlanBySiteId = (siteId: number) => {
  return request.get<SiteJobPlan>(`/maintenance/site-job-plans/site/${siteId}`)
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
  return request.get<any>('/maintenance/sites-with-job-plans', {
    params: { pageNum, pageSize, siteType, enterpriseId },
  })
}

// 分页查询站点任务计划
export const getSiteJobPlanPage = (params: {
  pageNum?: number
  pageSize?: number
  siteName?: string
  enterpriseId?: number
  siteId?: number
  departmentId?: number
}) => {
  return request.get<any>('/maintenance/site-job-plans', {
    params,
  })
}

// ========== 任务实例补齐 ==========

export type BackfillJobInstancesRequest = {
  siteJobPlanId: number
  startTime: string // 格式: yyyy-MM-dd HH:mm:ss
  endTime: string   // 格式: yyyy-MM-dd HH:mm:ss
}

export type JobInstanceInfo = {
  id: number
  triggerTime: string
  expiredTime: string
  status: string
  createTime: string
}

export type BackfillResultVO = {
  totalCount: number
  instances: JobInstanceInfo[]
}

// 补齐任务实例
export const backfillJobInstances = (data: BackfillJobInstancesRequest) => {
  return request.post<BackfillResultVO>('/maintenance/job-instances/backfill', data)
}

// ========== 任务实例查询 ==========

export type SiteJobInstance = {
  id: number
  siteJobPlanId: number
  siteId: number
  siteName: string
  siteCode: string
  enterpriseId: number
  enterpriseName: string
  triggerTime: string
  startTime: string | null
  endTime: string | null
  status: string
  expiredTime: string
  schemeId: number
  schemeName: string
  taskItemCount: number
  departmentId: number
  departmentName: string
  creator: string
  operator: string | null
  createTime: string
  updateTime: string
}

// 分页查询任务实例
export const getSiteJobInstancePage = (params: {
  pageNum?: number
  pageSize?: number
  siteName?: string
  status?: string
  startTime?: string
  endTime?: string
  creator?: string
  departmentId?: number
}) => {
  return request.get<any>('/maintenance/job-instances', {
    params,
  })
}

// ========== 手动创建任务实例 ==========

export type CreateManualJobInstanceRequest = {
  siteId: number
  schemeId: number
  departmentId: number
}

// 手动创建任务实例
export const createManualJobInstance = (data: CreateManualJobInstanceRequest) => {
  return request.post<SiteJobInstance>('/maintenance/job-instances', data)
}
