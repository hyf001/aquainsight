import request from './request'

export type ParameterOption = {
  value: string
  label: string
  defaultSelected?: boolean
  disabled?: boolean
}

export type JobParameter = {
  name: string
  label?: string
  type: 'TEXT' | 'IMAGE' | 'SELECT' | 'CHECKBOX' | 'RADIO'
  required: boolean
  placeholder?: string
  options?: ParameterOption[]
  defaultValue?: string
  maxLength?: number
  minLength?: number
  maxSelect?: number
  minSelect?: number
  hint?: string
}

export type StepTemplate = {
  id: number
  name: string
  code: string
  parameters: JobParameter[] | null
  overdueDays: number
  description: string | null
  createTime: string
  updateTime: string
}

export type CreateStepTemplateRequest = {
  name: string
  code: string
  parameters?: JobParameter[]
  overdueDays: number
  description?: string
}

export type UpdateStepTemplateRequest = {
  name?: string
  parameters?: JobParameter[]
  overdueDays?: number
  description?: string
}

// 获取步骤模版列表
export const getStepTemplateList = (name?: string) => {
  return request.get<StepTemplate[]>('/maintenance/step-templates', {
    params: { name },
  })
}

// 创建步骤模版
export const createStepTemplate = (data: CreateStepTemplateRequest) => {
  return request.post<StepTemplate>('/maintenance/step-templates', data)
}

// 更新步骤模版
export const updateStepTemplate = (id: number, data: UpdateStepTemplateRequest) => {
  return request.put<StepTemplate>(`/maintenance/step-templates/${id}`, data)
}

// 删除步骤模版
export const deleteStepTemplate = (id: number) => {
  return request.delete(`/maintenance/step-templates/${id}`)
}

// 批量删除步骤模版
export const batchDeleteJobCategories = (ids: number[]) => {
  return request.delete('/maintenance/step-templates', { data: ids })
}

// 获取步骤模版详情
export const getStepTemplateDetail = (id: number) => {
  return request.get<StepTemplate>(`/maintenance/step-templates/${id}`)
}

// ========== 任务模版管理 ==========

export type TaskTemplateItem = {
  id: number
  taskTemplateId: number
  stepTemplateId: number
  stepTemplate?: StepTemplate
  itemName: string
  description: string | null
  createTime: string
  updateTime: string
}

export type TaskTemplate = {
  id: number
  name: string
  code: string
  creator: string | null
  createTime: string
  updateTime: string
  items?: TaskTemplateItem[]
}

export type CreateTaskTemplateRequest = {
  name: string
  code: string
}

export type UpdateTaskTemplateRequest = {
  name: string
}

export type CreateTaskTemplateItemRequest = {
  taskTemplateId: number
  stepTemplateId: number
  itemName: string
  description?: string
}

export type UpdateTaskTemplateItemRequest = {
  itemName: string
  description?: string
}

// 获取任务模版列表
export const getTaskTemplateList = (name?: string) => {
  return request.get<TaskTemplate[]>('/maintenance/taskTemplates', {
    params: { name },
  })
}

// 创建任务模版
export const createTaskTemplate = (data: CreateTaskTemplateRequest) => {
  return request.post<TaskTemplate>('/maintenance/taskTemplates', data)
}

// 更新任务模版
export const updateTaskTemplate = (id: number, data: UpdateTaskTemplateRequest) => {
  return request.put<TaskTemplate>(`/maintenance/taskTemplates/${id}`, data)
}

// 删除任务模版
export const deleteTaskTemplate = (id: number) => {
  return request.delete(`/maintenance/taskTemplates/${id}`)
}

// 批量删除任务模版
export const batchDeleteTaskTemplates = (ids: number[]) => {
  return request.delete('/maintenance/taskTemplates', { data: ids })
}

// 获取任务模版详情（包含任务模版项目）
export const getTaskTemplateDetail = (id: number, withItems: boolean = true) => {
  return request.get<TaskTemplate>(`/maintenance/taskTemplates/${id}`, {
    params: { withItems },
  })
}

// 获取任务模版的所有项目
export const getTaskTemplateItems = (taskTemplateId: number) => {
  return request.get<TaskTemplateItem[]>(`/maintenance/taskTemplates/${taskTemplateId}/items`)
}

// 添加任务模版项目
export const addTaskTemplateItem = (data: CreateTaskTemplateItemRequest) => {
  return request.post<TaskTemplateItem>('/maintenance/taskTemplate-items', data)
}

// 更新任务模版项目
export const updateTaskTemplateItem = (id: number, data: UpdateTaskTemplateItemRequest) => {
  return request.put<TaskTemplateItem>(`/maintenance/taskTemplate-items/${id}`, data)
}

// 删除任务模版项目
export const deleteTaskTemplateItem = (id: number) => {
  return request.delete(`/maintenance/taskTemplate-items/${id}`)
}

// ========== 站点任务调度管理 ==========

export type PeriodConfig = {
  periodType: 'INTERVAL' | 'WEEK' | 'MONTH'
  n?: number
}

export type TaskScheduler = {
  id: number
  siteId: number
  siteName?: string
  periodConfig: PeriodConfig
  taskTemplateId: number
  taskTemplateName?: string
  taskTemplateCode?: string
  departmentId: number
  departmentName?: string
  taskSchedulerState?: string
  creator: string
  createTime: string
  updater: string
  updateTime: string
}

export type ConfigureTaskSchedulerRequest = {
  siteId: number
  periodConfig: {
    periodType: 'INTERVAL' | 'WEEK' | 'MONTH'
    n?: number
  }
  taskTemplateId: number
  departmentId: number
}

// 配置站点任务调度（新增或更新）
export const configureTaskScheduler = (data: ConfigureTaskSchedulerRequest) => {
  return request.post<TaskScheduler>('/maintenance/site-task-schedulers', data)
}

// 根据站点ID获取任务调度
export const getTaskSchedulerBySiteId = (siteId: number) => {
  return request.get<TaskScheduler>(`/maintenance/site-task-schedulers/site/${siteId}`)
}

// 删除站点任务调度
export const deleteTaskScheduler = (id: number) => {
  return request.delete(`/maintenance/site-task-schedulers/${id}`)
}

// 分页查询站点及其任务调度
export const getSitesWithTaskSchedulers = (
  pageNum: number = 1,
  pageSize: number = 10,
  siteType?: string,
  enterpriseId?: number
) => {
  return request.get<any>('/maintenance/sites-with-task-schedulers', {
    params: { pageNum, pageSize, siteType, enterpriseId },
  })
}

// 分页查询站点任务调度
export const getTaskSchedulerPage = (params: {
  pageNum?: number
  pageSize?: number
  siteName?: string
  enterpriseId?: number
  siteId?: number
  departmentId?: number
}) => {
  return request.get<any>('/maintenance/site-task-schedulers', {
    params,
  })
}

// ========== 任务补齐 ==========

export type BackfillTaskRequest = {
  taskSchedulerId: number
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

// 补齐任务
export const backfillTask = (data: BackfillTaskRequest) => {
  return request.post<BackfillResultVO>('/maintenance/task/backfill', data)
}

// ========== 任务查询 ==========

export type Task = {
  id: number
  taskSchedulerId: number
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
  taskTemplateId: number
  taskTemplateName: string
  taskItemCount: number
  departmentId: number
  departmentName: string
  creator: string
  operator: string | null
  createTime: string
  updateTime: string
}

// 分页查询任务
export const getTaskPage = (params: {
  pageNum?: number
  pageSize?: number
  siteName?: string
  status?: string
  startTime?: string
  endTime?: string
  creator?: string
  departmentId?: number
}) => {
  return request.get<any>('/maintenance/task', {
    params,
  })
}

// ========== 手动创建任务 ==========

export type CreateManualJobInstanceRequest = {
  siteId: number
  taskTemplateId: number
  departmentId: number
}

// 手动创建任务
export const createManualJobInstance = (data: CreateManualJobInstanceRequest) => {
  return request.post<Task>('/maintenance/task', data)
}

// ========== 任务详情和处理 ==========

export type ParameterValue = {
  name: string
  value: any
  fillTime: string
}

export type Step = {
  id: number
  taskId: number
  stepTemplateId: number
  stepName: string
  parameterValues: ParameterValue[] | null
  createTime: string
  updateTime: string
}

export type TaskDetail = {
  id: number
  taskSchedulerId: number | null
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
  taskTemplateId: number
  taskTemplateName: string
  departmentId: number
  departmentName: string
  creator: string
  operator: string | null
  taskTemplateItems: TaskTemplateItem[]
  steps: Step[] | null
  createTime: string
  updateTime: string
}

// 获取任务详情（包含步骤信息和任务模版配置）
export const getTaskDetail = (id: number) => {
  return request.get<TaskDetail>(`/maintenance/task/${id}`)
}

export type StepData = {
  stepTemplateId: number
  stepName: string
  parameters: Record<string, any>
}

export type ProcessTaskRequest = {
  stepDataList: StepData[]
  complete?: boolean
}

// 处理任务（填写步骤参数）
export const processTask = (id: number, data: ProcessTaskRequest) => {
  return request.put(`/maintenance/task/${id}/process`, data)
}
