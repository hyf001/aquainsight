import request from './request'

// ==================== Alert Rules ====================

export interface AlertRule {
  id: number
  ruleName: string
  alertTargetType: string
  conditionConfigs: RuleCondition[]
  alertLevel: number
  alertMessage: string
  enabled: boolean
  quietPeriod: number
  description?: string
  createTime: string
  updateTime: string
}

export interface RuleCondition {
  metric: string
  operator: 'GT' | 'GTE' | 'LT' | 'LTE' | 'EQ' | 'NEQ' | 'BETWEEN' | 'NOT_BETWEEN'
  threshold?: number
  minThreshold?: number
  maxThreshold?: number
}

export interface CreateAlertRuleRequest {
  ruleName: string
  alertTargetType: string
  alertLevel: number
  alertMessage: string
  quietPeriod: number
  schemeId: number
  notifyTypes: string
  notifyUsers: string
  notifyDepartments: string
  description?: string
  conditionConfigs: RuleCondition[]
}

export interface UpdateAlertRuleRequest extends CreateAlertRuleRequest {}

export const getAlertRules = (pageNum: number, pageSize: number) => {
  return request<{ list: AlertRule[]; total: number; pageNum: number; pageSize: number }>({
    url: '/alert/rules',
    method: 'GET',
    params: { pageNum, pageSize },
  })
}

export const createAlertRule = (data: CreateAlertRuleRequest) => {
  return request({
    url: '/alert/rules',
    method: 'POST',
    data,
  })
}

export const updateAlertRule = (id: number, data: UpdateAlertRuleRequest) => {
  return request({
    url: `/alert/rules/${id}`,
    method: 'PUT',
    data,
  })
}

export const deleteAlertRule = (id: number) => {
  return request({
    url: `/alert/rules/${id}`,
    method: 'DELETE',
  })
}

export const enableAlertRule = (id: number) => {
  return request({
    url: `/alert/rules/${id}/enable`,
    method: 'PUT',
  })
}

export const disableAlertRule = (id: number) => {
  return request({
    url: `/alert/rules/${id}/disable`,
    method: 'PUT',
  })
}

export const getMetrics = (targetType?: string) => {
  return request<string[]>({
    url: '/alert/metrics',
    method: 'GET',
    params: targetType ? { targetType } : {},
  })
}

// ==================== Alert Records ====================

export interface AlertRecord {
  id: number
  ruleName: string
  ruleType: string
  targetType: string
  targetName: string
  alertLevel: string
  alertMessage: string
  status: string
  notifyStatus: string
  notifyTime?: string
  recoverTime?: string
  duration?: number
  remark?: string
  createTime: string
  updateTime: string
}

export interface AlertRecordFilters {
  status?: string
  alertLevel?: string
  targetType?: string
  startTime?: string
  endTime?: string
}

export const getAlertRecords = (
  pageNum: number,
  pageSize: number,
  filters: AlertRecordFilters = {}
) => {
  return request<{ list: AlertRecord[]; total: number; pageNum: number; pageSize: number }>({
    url: '/alert/records',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      ...filters,
    },
  })
}

export const getAlertRecordById = (id: number) => {
  return request<AlertRecord>({
    url: `/alert/records/${id}`,
    method: 'GET',
  })
}

export const startProcessAlert = (id: number) => {
  return request({
    url: `/alert/records/${id}/start-process`,
    method: 'PUT',
  })
}

export const resolveAlert = (id: number, remark: string) => {
  return request({
    url: `/alert/records/${id}/resolve`,
    method: 'PUT',
    data: { remark },
  })
}

export const ignoreAlert = (id: number, remark: string) => {
  return request({
    url: `/alert/records/${id}/ignore`,
    method: 'PUT',
    data: { remark },
  })
}

export const getAlertStatistics = () => {
  return request({
    url: '/alert/records/statistics',
    method: 'GET',
  })
}

// ==================== Notify Logs ====================

export interface NotifyLog {
  id: number
  alertRecordId: number
  notifyType: string
  notifyTarget: string
  notifyUserId?: number
  notifyUserName?: string
  notifyContent: string
  notifyStatus: string
  sendTime?: string
  errorMessage?: string
  retryCount: number
  createTime: string
}

export interface NotifyLogFilters {
  notifyStatus?: string
  notifyType?: string
  startTime?: string
  endTime?: string
}

export const getNotifyLogs = (
  pageNum: number,
  pageSize: number,
  filters: NotifyLogFilters = {}
) => {
  return request<{ list: NotifyLog[]; total: number; pageNum: number; pageSize: number }>({
    url: '/alert/notify-logs',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      ...filters,
    },
  })
}

export const getNotifyLogsByAlertRecordId = (alertRecordId: number) => {
  return request<NotifyLog[]>({
    url: `/alert/records/${alertRecordId}/notify-logs`,
    method: 'GET',
  })
}

export const retryNotify = (logId: number) => {
  return request({
    url: `/alert/notify-logs/${logId}/retry`,
    method: 'PUT',
  })
}
