import request from './request'

// ==================== 类型定义 ====================

// 告警级别
export type AlertLevel = 'URGENT' | 'IMPORTANT' | 'NORMAL' | 'INFO'

// 告警状态
export type AlertStatus = 'PENDING' | 'IN_PROGRESS' | 'IGNORED' | 'RECOVERED'

// 告警对象类型
export type AlertTargetType = 'site' | 'device' | 'task'

// 通知方式
export type NotifyType = 'sms' | 'email' | 'push' | 'wechat'

// 通知状态
export type NotifyStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

// 比较操作符
export type CompareOperator = 'GT' | 'GTE' | 'LT' | 'LTE' | 'EQ' | 'NEQ' | 'BETWEEN' | 'NOT_BETWEEN'

// 规则条件配置
export interface RuleConditionConfig {
  metricCode: string
  metricName?: string
  operator: CompareOperator
  threshold?: number
  thresholdMin?: number
  thresholdMax?: number
}

// 告警规则
export interface AlertRuleVO {
  id: number
  ruleName: string
  alertTargetType: AlertTargetType
  conditionConfigs: RuleConditionConfig[]
  alertLevel: AlertLevel
  alertMessage: string
  taskTemplateId?: number
  notifyTypes: NotifyType[]
  notifyUsers: number[]
  notifyDepartments: number[]
  quietPeriod: number
  enabled: boolean
  createTime: string
  updateTime: string
}

// 创建告警规则请求
export interface CreateAlertRuleRequest {
  ruleName: string
  alertTargetType: AlertTargetType
  conditionConfigs: RuleConditionConfig[]
  alertLevel: AlertLevel
  alertMessage: string
  taskTemplateId?: number
  notifyTypes?: NotifyType[]
  notifyUsers?: number[]
  notifyDepartments?: number[]
  quietPeriod?: number
}

// 更新告警规则请求
export interface UpdateAlertRuleRequest {
  ruleName?: string
  conditionConfigs?: RuleConditionConfig[]
  alertLevel?: AlertLevel
  alertMessage?: string
  taskTemplateId?: number
  notifyTypes?: NotifyType[]
  notifyUsers?: number[]
  notifyDepartments?: number[]
  quietPeriod?: number
}

// 告警记录
export interface AlertRecordVO {
  id: number
  ruleId: number
  ruleName?: string
  targetType: AlertTargetType
  targetId: number
  targetName: string
  alertLevel: AlertLevel
  alertMessage: string
  alertData?: string
  status: AlertStatus
  notifyStatus: NotifyStatus
  handler?: string
  handleTime?: string
  ignoreReason?: string
  recoverTime?: string
  duration?: number
  createTime: string
  updateTime: string
}

// 告警通知日志
export interface AlertNotifyLogVO {
  id: number
  alertRecordId: number
  notifyType: NotifyType
  notifyTarget: string
  notifyContent: string
  notifyStatus: NotifyStatus
  retryCount: number
  errorMessage?: string
  createTime: string
  updateTime: string
}

// 告警统计
export interface AlertStatisticsVO {
  pendingCount: number
  inProgressCount: number
  ignoredCount: number
  recoveredCount: number
  urgentCount: number
  importantCount: number
  normalCount: number
  infoCount: number
  todayCount: number
  todayHandledCount: number
}

// 指标定义
export interface MetricVO {
  code: string
  name: string
  unit?: string
  description?: string
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// ==================== 告警规则 API ====================

export const alertRuleApi = {
  // 获取告警规则分页列表
  getRules: (params: {
    pageNum?: number
    pageSize?: number
    alertTargetType?: AlertTargetType
    enabled?: boolean
  }): Promise<PageResult<AlertRuleVO>> => {
    return request.get('/alert/rules', { params }) as Promise<PageResult<AlertRuleVO>>
  },

  // 获取告警规则详情
  getRuleById: (id: number): Promise<AlertRuleVO> => {
    return request.get(`/alert/rules/${id}`) as Promise<AlertRuleVO>
  },

  // 创建告警规则
  createRule: (data: CreateAlertRuleRequest): Promise<AlertRuleVO> => {
    return request.post('/alert/rules', data) as Promise<AlertRuleVO>
  },

  // 更新告警规则
  updateRule: (id: number, data: UpdateAlertRuleRequest): Promise<AlertRuleVO> => {
    return request.put(`/alert/rules/${id}`, data) as Promise<AlertRuleVO>
  },

  // 启用规则
  enableRule: (id: number): Promise<void> => {
    return request.put(`/alert/rules/${id}/enable`) as Promise<void>
  },

  // 禁用规则
  disableRule: (id: number): Promise<void> => {
    return request.put(`/alert/rules/${id}/disable`) as Promise<void>
  },

  // 删除规则
  deleteRule: (id: number): Promise<void> => {
    return request.delete(`/alert/rules/${id}`) as Promise<void>
  },

  // 获取指标列表
  getMetrics: (targetType?: AlertTargetType): Promise<MetricVO[]> => {
    return request.get('/alert/metrics', { params: { targetType } }) as Promise<MetricVO[]>
  },
}

// ==================== 告警记录 API ====================

export const alertRecordApi = {
  // 获取告警记录分页列表
  getRecords: (params: {
    pageNum?: number
    pageSize?: number
    status?: AlertStatus
    alertLevel?: AlertLevel
    targetType?: AlertTargetType
    startTime?: string
    endTime?: string
  }): Promise<PageResult<AlertRecordVO>> => {
    return request.get('/alert/records', { params }) as Promise<PageResult<AlertRecordVO>>
  },

  // 获取告警记录详情
  getRecordById: (id: number): Promise<AlertRecordVO> => {
    return request.get(`/alert/records/${id}`) as Promise<AlertRecordVO>
  },

  // 认领告警
  claimRecord: (id: number): Promise<void> => {
    return request.put(`/alert/records/${id}/claim`) as Promise<void>
  },

  // 开始处理告警
  startProcess: (id: number): Promise<void> => {
    return request.put(`/alert/records/${id}/start-process`) as Promise<void>
  },

  // 忽略告警
  ignoreRecord: (id: number, reason: string): Promise<void> => {
    return request.put(`/alert/records/${id}/ignore`, { reason }) as Promise<void>
  },

  // 获取告警统计
  getStatistics: (): Promise<AlertStatisticsVO> => {
    return request.get('/alert/records/statistics') as Promise<AlertStatisticsVO>
  },
}

// ==================== 告警通知日志 API ====================

export const alertNotifyLogApi = {
  // 获取通知日志分页列表
  getNotifyLogs: (params: {
    pageNum?: number
    pageSize?: number
    alertRecordId?: number
    notifyStatus?: NotifyStatus
    notifyType?: NotifyType
    startTime?: string
    endTime?: string
  }): Promise<PageResult<AlertNotifyLogVO>> => {
    return request.get('/alert/notify-logs', { params }) as Promise<PageResult<AlertNotifyLogVO>>
  },

  // 获取指定告警的通知日志
  getNotifyLogsByRecordId: (alertRecordId: number): Promise<AlertNotifyLogVO[]> => {
    return request.get(`/alert/records/${alertRecordId}/notify-logs`) as Promise<AlertNotifyLogVO[]>
  },
}

// ==================== 辅助函数 ====================

// 告警级别映射
export const alertLevelMap: Record<AlertLevel, { label: string; color: string; bgColor: string }> = {
  URGENT: { label: '紧急', color: 'text-red-600', bgColor: 'bg-red-100' },
  IMPORTANT: { label: '重要', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  NORMAL: { label: '一般', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  INFO: { label: '提示', color: 'text-blue-600', bgColor: 'bg-blue-100' },
}

// 告警状态映射
export const alertStatusMap: Record<AlertStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: '未认领', color: 'text-red-600', bgColor: 'bg-red-100' },
  IN_PROGRESS: { label: '处理中', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  IGNORED: { label: '已忽略', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  RECOVERED: { label: '已恢复', color: 'text-green-600', bgColor: 'bg-green-100' },
}

// 告警对象类型映射
export const alertTargetTypeMap: Record<AlertTargetType, string> = {
  site: '站点',
  device: '设备',
  task: '任务',
}

// 通知方式映射
export const notifyTypeMap: Record<NotifyType, string> = {
  sms: '短信',
  email: '邮件',
  push: '推送',
  wechat: '微信',
}

// 比较操作符映射
export const operatorMap: Record<CompareOperator, string> = {
  GT: '大于',
  GTE: '大于等于',
  LT: '小于',
  LTE: '小于等于',
  EQ: '等于',
  NEQ: '不等于',
  BETWEEN: '介于',
  NOT_BETWEEN: '不介于',
}
