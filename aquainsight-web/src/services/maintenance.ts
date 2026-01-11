import request from './request'

// ============ 类型定义 ============

// 步骤参数选项
export interface ParameterOption {
  value: string
  label: string
  defaultSelected?: boolean
  disabled?: boolean
}

// 步骤参数定义
export interface StepParameter {
  name: string
  label?: string | null
  type: string
  required?: boolean
  placeholder?: string | null
  options?: ParameterOption[]
  defaultValue?: string | number | boolean | string[] | null
  maxLength?: number | null
  minLength?: number | null
  maxSelect?: number | null
  minSelect?: number | null
  hint?: string | null
}

// 步骤模版
export interface StepTemplate {
  id: number
  name: string
  code: string
  parameters?: StepParameter[] | null
  overdueDays: number | null
  description?: string | null
  createTime: string
  updateTime?: string | null
}

// 任务模版项目
export interface TaskTemplateItem {
  id: number
  taskTemplateId: number
  stepTemplateId: number
  stepTemplate?: StepTemplate
  itemName: string
  description?: string
  createTime: string
  updateTime?: string
}

// 任务模版
export interface TaskTemplate {
  id: number
  name: string
  code: string
  creator: string
  items?: TaskTemplateItem[] | null
  createTime: string
  updateTime?: string | null
}

// 任务状态
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRING' | 'OVERDUE'

// 任务调度状态
export type TaskSchedulerState = 'ENABLED' | 'DISABLED'

// 周期类型
export type PeriodType = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

// 周期配置
export interface PeriodConfig {
  periodType: PeriodType
  n: number
}

// 步骤参数值
export interface ParameterValue {
  name: string
  value: string | number | boolean | string[]
  fillTime: string
}

// 步骤执行
export interface Step {
  id: number
  taskId: number
  stepTemplateId: number
  stepName: string
  parameterValues?: ParameterValue[]
  createTime: string
  updateTime?: string
}

// 任务详情
export interface TaskDetail {
  id: number
  taskSchedulerId?: number
  siteId: number
  siteName: string
  siteCode: string
  taskTemplateId: number
  taskTemplateName: string
  taskTemplateItems?: TaskTemplateItem[]
  departmentId?: number
  departmentName?: string
  enterpriseId?: number
  enterpriseName?: string
  triggerTime: string
  startTime?: string
  endTime?: string
  status: TaskStatus
  expiredTime?: string
  creator: string
  operator?: string
  steps?: Step[]
  createTime: string
  updateTime?: string
}

// 任务列表项
export interface Task {
  id: number
  siteId: number
  siteName: string
  siteCode: string
  taskTemplateId: number
  taskTemplateName: string
  taskItemCount: number
  departmentId?: number
  departmentName?: string
  enterpriseId?: number
  enterpriseName?: string
  triggerTime: string
  startTime?: string
  endTime?: string
  status: TaskStatus
  expiredTime?: string
  creator: string
  operator?: string
  createTime: string
  updateTime?: string
}

// 任务调度
export interface TaskScheduler {
  id: number
  siteId: number
  siteName: string
  siteCode: string
  taskTemplateId: number
  taskTemplateName: string
  departmentId?: number
  departmentName?: string
  enterpriseId?: number
  enterpriseName?: string
  periodConfig?: PeriodConfig
  taskSchedulerState: TaskSchedulerState
  creator: string
  createTime: string
  updater?: string
  updateTime?: string
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// ============ 创建请求类型 ============

// 创建步骤模版请求
export interface CreateStepTemplateRequest {
  name: string
  code: string
  parameters: StepParameter[]
  overdueDays?: number
  description?: string
}

// 更新步骤模版请求
export interface UpdateStepTemplateRequest {
  name?: string
  parameters?: StepParameter[]
  overdueDays?: number
  description?: string
}

// 创建任务模版请求
export interface CreateTaskTemplateRequest {
  name: string
  code: string
}

// 更新任务模版请求
export interface UpdateTaskTemplateRequest {
  name?: string
}

// 创建任务模版项目请求
export interface CreateTaskTemplateItemRequest {
  taskTemplateId: number
  stepTemplateId: number
  itemName: string
  description?: string
}

// 更新任务模版项目请求
export interface UpdateTaskTemplateItemRequest {
  itemName?: string
  description?: string
}

// 手动创建任务请求
export interface CreateManualTaskRequest {
  siteId: number
  taskTemplateId: number
  departmentId?: number
}

// 任务补齐请求
export interface BackfillTaskRequest {
  taskSchedulerId: number
  startTime: string
  endTime: string
}

// 步骤数据
export interface StepData {
  stepTemplateId: number
  stepName: string
  parameters: Record<string, unknown>
}

// 任务处理请求
export interface ProcessTaskRequest {
  stepDataList: StepData[]
  complete?: boolean
}

// ============ API 函数 ============

// 步骤模版管理
export const stepTemplateApi = {
  // 获取所有步骤模版
  list: (name?: string) =>
    request.get<StepTemplate[]>('/maintenance/step-templates', { params: { name } }),

  // 获取步骤模版详情
  getById: (id: number) =>
    request.get<StepTemplate>(`/maintenance/step-templates/${id}`),

  // 创建步骤模版
  create: (data: CreateStepTemplateRequest) =>
    request.post<StepTemplate>('/maintenance/step-templates', data),

  // 更新步骤模版
  update: (id: number, data: UpdateStepTemplateRequest) =>
    request.put<StepTemplate>(`/maintenance/step-templates/${id}`, data),

  // 删除步骤模版
  delete: (id: number) =>
    request.delete(`/maintenance/step-templates/${id}`),

  // 批量删除步骤模版
  batchDelete: (ids: number[]) =>
    request.delete('/maintenance/step-templates', { data: ids }),
}

// 任务模版管理
export const taskTemplateApi = {
  // 获取所有任务模版
  list: (name?: string) =>
    request.get<TaskTemplate[]>('/maintenance/taskTemplates', { params: { name } }),

  // 获取任务模版详情
  getById: (id: number, withItems = false) =>
    request.get<TaskTemplate>(`/maintenance/taskTemplates/${id}`, { params: { withItems } }),

  // 创建任务模版
  create: (data: CreateTaskTemplateRequest) =>
    request.post<TaskTemplate>('/maintenance/taskTemplates', data),

  // 更新任务模版
  update: (id: number, data: UpdateTaskTemplateRequest) =>
    request.put<TaskTemplate>(`/maintenance/taskTemplates/${id}`, data),

  // 删除任务模版
  delete: (id: number) =>
    request.delete(`/maintenance/taskTemplates/${id}`),

  // 批量删除任务模版
  batchDelete: (ids: number[]) =>
    request.delete('/maintenance/taskTemplates', { data: ids }),

  // 获取任务模版的所有项目
  getItems: (taskTemplateId: number) =>
    request.get<TaskTemplateItem[]>(`/maintenance/taskTemplates/${taskTemplateId}/items`),
}

// 任务模版项目管理
export const taskTemplateItemApi = {
  // 添加任务模版项目
  create: (data: CreateTaskTemplateItemRequest) =>
    request.post<TaskTemplateItem>('/maintenance/taskTemplate-items', data),

  // 更新任务模版项目
  update: (id: number, data: UpdateTaskTemplateItemRequest) =>
    request.put<TaskTemplateItem>(`/maintenance/taskTemplate-items/${id}`, data),

  // 删除任务模版项目
  delete: (id: number) =>
    request.delete(`/maintenance/taskTemplate-items/${id}`),
}

// 任务管理
export const taskApi = {
  // 分页查询任务
  getPage: (params: {
    pageNum?: number
    pageSize?: number
    siteName?: string
    status?: TaskStatus
    startTime?: string
    endTime?: string
    creator?: string
    departmentId?: number
  }) => request.get<PageResult<Task>>('/maintenance/task', { params }),

  // 获取任务详情
  getDetail: (id: number) =>
    request.get<TaskDetail>(`/maintenance/task/${id}`),

  // 手动创建任务
  createManual: (data: CreateManualTaskRequest) =>
    request.post<Task>('/maintenance/task', data),

  // 任务补齐
  backfill: (data: BackfillTaskRequest) =>
    request.post<{ totalCount: number; instances: Task[] }>('/maintenance/task/backfill', data),

  // 处理任务（填写步骤参数）
  process: (id: number, data: ProcessTaskRequest) =>
    request.put(`/maintenance/task/${id}/process`, data),
}

// 任务调度管理
export const taskSchedulerApi = {
  // 分页查询任务调度
  getPage: (params: {
    pageNum?: number
    pageSize?: number
    siteName?: string
    enterpriseId?: number
    siteId?: number
    departmentId?: number
  }) => request.get<PageResult<TaskScheduler>>('/maintenance/site-task-schedulers', { params }),

  // 获取所有任务调度
  getAll: () =>
    request.get<TaskScheduler[]>('/maintenance/site-task-schedulers/all'),

  // 根据站点ID获取任务调度
  getBySiteId: (siteId: number) =>
    request.get<TaskScheduler>(`/maintenance/site-task-schedulers/site/${siteId}`),

  // 配置站点任务调度
  configure: (data: {
    siteId: number
    taskTemplateId: number
    departmentId?: number
    periodConfig?: PeriodConfig
  }) => request.post<TaskScheduler>('/maintenance/site-task-schedulers', data),

  // 删除任务调度
  delete: (id: number) =>
    request.delete(`/maintenance/site-task-schedulers/${id}`),
}

// 任务状态映射
export const taskStatusMap: Record<TaskStatus, { label: string; color: string }> = {
  PENDING: { label: '待处理', color: 'badge-info' },
  IN_PROGRESS: { label: '进行中', color: 'badge-warning' },
  COMPLETED: { label: '已完成', color: 'badge-success' },
  CANCELLED: { label: '已取消', color: 'badge-error' },
  EXPIRING: { label: '即将过期', color: 'badge-warning' },
  OVERDUE: { label: '已逾期', color: 'badge-error' },
}

// 周期类型映射
export const periodTypeMap: Record<PeriodType, string> = {
  HOURLY: '每小时',
  DAILY: '每天',
  WEEKLY: '每周',
  MONTHLY: '每月',
}
