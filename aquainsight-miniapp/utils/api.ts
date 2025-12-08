// API接口定义
import { get, post, put, del } from './request'

/**
 * 用户相关接口
 */
export const userApi = {
  /**
   * 登录（匹配后端：POST /api/user/login）
   * 请求参数：{ phone: string, password: string }
   * 返回：{ token: string, user: IUserInfo }
   */
  login: (data: ILoginRequest) =>
    post<ILoginResponse>('/user/login', data),

  /**
   * 获取用户信息（需要token）
   */
  getUserInfo: () =>
    get<IUserInfo>('/user/info'),

  /**
   * 登出
   */
  logout: () =>
    post<void>('/user/logout'),

  /**
   * 获取用户统计
   */
  getUserStats: () =>
    get<IStats>('/user/stats')
}

/**
 * 系统相关接口
 */
export const systemApi = {
  /**
   * 获取系统状态
   */
  getStatus: () =>
    get<ISystemStatus>('/system/status'),

  /**
   * 获取系统配置
   */
  getConfig: () =>
    get<any>('/system/config')
}

/**
 * 告警相关接口（匹配后端 AlertController）
 */
export const alarmApi = {
  /**
   * 分页查询告警记录（GET /api/alert/records）
   */
  getRecords: (params?: {
    pageNum?: number
    pageSize?: number
    status?: string
    alertLevel?: string
    targetType?: string
  }) =>
    get<IPageResult<any>>('/alert/records', params),

  /**
   * 获取告警记录详情
   */
  getRecordDetail: (id: number) =>
    get<any>(`/alert/records/${id}`),

  /**
   * 获取告警统计（GET /api/alert/records/statistics）
   */
  getStats: () =>
    get<{
      pendingCount: number
      inProgressCount: number
      ignoredCount: number
      recoveredCount: number
      urgentCount: number
      importantCount: number
    }>('/alert/records/statistics'),

  /**
   * 认领告警
   */
  claimAlert: (id: number) =>
    put<any>(`/alert/records/${id}/claim`, {}),

  /**
   * 开始处理告警
   */
  startProcess: (id: number) =>
    put<any>(`/alert/records/${id}/start-process`, {}),

  /**
   * 忽略告警
   */
  ignoreAlert: (id: number, data: { remark?: string }) =>
    put<any>(`/alert/records/${id}/ignore`, data)
}

/**
 * 任务相关接口
 */
export const taskApi = {
  /**
   * 获取任务列表
   */
  getList: (params?: ITaskQuery) =>
    get<ITask[]>('/task/list', params),

  /**
   * 获取任务详情
   */
  getDetail: (id: number) =>
    get<ITask>(`/task/detail/${id}`),

  /**
   * 创建任务
   */
  create: (data: Partial<ITask>) =>
    post<ITask>('/task/create', data),

  /**
   * 更新任务
   */
  update: (id: number, data: Partial<ITask>) =>
    put<ITask>(`/task/update/${id}`, data),

  /**
   * 删除任务
   */
  delete: (id: number) =>
    del<void>(`/task/delete/${id}`),

  /**
   * 分配任务
   */
  assign: (id: number, data: { assigneeId: number }) =>
    post<ITask>(`/task/assign/${id}`, data),

  /**
   * 完成任务
   */
  complete: (id: number, data: { remark?: string }) =>
    post<ITask>(`/task/complete/${id}`, data)
}

/**
 * 监控相关接口
 */
export const monitorApi = {
  /**
   * 获取监控数据
   */
  getData: (params?: any) =>
    get<any>('/monitor/data', params),

  /**
   * 获取实时数据
   */
  getRealTimeData: (params?: any) =>
    get<any>('/monitor/realtime', params),

  /**
   * 获取历史数据
   */
  getHistoryData: (params?: any) =>
    get<any>('/monitor/history', params)
}

/**
 * 通知相关接口
 */
export const notificationApi = {
  /**
   * 获取通知列表
   */
  getList: (params?: IPagination) =>
    get<any[]>('/notification/list', params),

  /**
   * 标记为已读
   */
  markAsRead: (id: number) =>
    post<void>(`/notification/read/${id}`),

  /**
   * 删除通知
   */
  delete: (id: number) =>
    del<void>(`/notification/delete/${id}`)
}

// 导出所有API
export default {
  user: userApi,
  system: systemApi,
  alarm: alarmApi,
  task: taskApi,
  monitor: monitorApi,
  notification: notificationApi
}
