import request from '../request'

export interface StatData {
  total: number
  today: number
  rate: number
}

export interface DashboardData {
  taskStat: StatData
  materialStat: StatData
  alarmStat: StatData
}

// 站点统计
export interface SiteStatistics {
  totalCount: number
  wastewaterCount: number
  rainwaterCount: number
  autoUploadCount: number
}

// 设备统计
export interface DeviceStatistics {
  totalCount: number
  onlineCount: number
  offlineCount: number
  faultCount: number
}

// 任务统计
export interface TaskStatistics {
  totalCount: number
  pendingCount: number
  inProgressCount: number
  completedCount: number
  overdueCount: number
  todayNewCount: number
}

// 告警统计
export interface AlertStatistics {
  totalCount: number
  pendingCount: number
  inProgressCount: number
  recoveredCount: number
  urgentCount: number
  importantCount: number
  todayNewCount: number
}

// 组织统计
export interface OrganizationStatistics {
  enterpriseCount: number
  departmentCount: number
  userCount: number
  activeUserCount: number
}

// 首页看板数据
export interface DashboardOverview {
  siteStatistics: SiteStatistics
  deviceStatistics: DeviceStatistics
  taskStatistics: TaskStatistics
  alertStatistics: AlertStatistics
  organizationStatistics: OrganizationStatistics
}

export const dashboardApi = {
  getStats: () => request.get<DashboardData>('/dashboard/stats'),

  // 获取完整看板数据
  getOverview: () => request.get<DashboardOverview>('/dashboard/overview'),

  // 获取各模块统计数据
  getSiteStatistics: () => request.get<SiteStatistics>('/dashboard/statistics/site'),
  getDeviceStatistics: () => request.get<DeviceStatistics>('/dashboard/statistics/device'),
  getTaskStatistics: () => request.get<TaskStatistics>('/dashboard/statistics/task'),
  getAlertStatistics: () => request.get<AlertStatistics>('/dashboard/statistics/alert'),
  getOrganizationStatistics: () => request.get<OrganizationStatistics>('/dashboard/statistics/organization'),
}
