// 路由配置信息，用于生成标签页
export interface RouteConfig {
  path: string
  label: string
  closable?: boolean
}

export const routeConfig: Record<string, RouteConfig> = {
  '/dashboard': { path: '/dashboard', label: '工作台' },
  '/task': { path: '/task', label: '任务计划' },
  '/task-execution': { path: '/task-execution', label: '任务执行' },
  '/material': { path: '/material', label: '物资管理' },
  '/analysis': { path: '/analysis', label: '数据分析' },
  '/knowledge': { path: '/knowledge', label: '知识库' },
  '/monitor': { path: '/monitor', label: '监控' },
  '/system': { path: '/system', label: '系统设置' },
  '/organization': { path: '/organization', label: '部门管理', closable: false },
  '/personnel': { path: '/personnel', label: '人员管理' },
  '/enterprise': { path: '/enterprise', label: '运维企业' },
  '/sites': { path: '/sites', label: '运维站点' },
  '/detection-factors': { path: '/detection-factors', label: '检测因子' },
  '/site-devices': { path: '/site-devices', label: '设备信息' },
  '/device-models': { path: '/device-models', label: '设备管理' },
  '/job-categories': { path: '/job-categories', label: '任务类别' },
  '/schemes': { path: '/schemes', label: '方案管理' },
  '/site-configuration': { path: '/site-configuration', label: '站点计划配置' },
  '/alert-rules': { path: '/alert-rules', label: '告警规则' },
  '/alert-records': { path: '/alert-records', label: '告警实例' },
  '/alert-notifications': { path: '/alert-notifications', label: '消息通知' },
}
