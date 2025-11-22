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

export const dashboardApi = {
  getStats: () => request.get<DashboardData>('/dashboard/stats'),
}
