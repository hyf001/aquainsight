// 全局类型定义

// App全局数据类型
interface IAppGlobalData {
  userInfo: IUserInfo | null
  apiBaseUrl: string
}

// 用户信息类型
interface IUserInfo {
  id?: number
  name: string
  role: string
  avatar: string
  phone?: string
  email?: string
}

// API响应类型（匹配后端Response结构）
interface IApiResponse<T = any> {
  code: string  // "0000" 成功, "9999" 失败
  message: string
  data: T
}

// 登录请求类型
interface ILoginRequest {
  phone: string
  password: string
}

// 登录响应类型
interface ILoginResponse {
  token: string
  user: IUserInfo
}

// 分页结果类型
interface IPageResult<T> {
  records: T[]
  total: number
  pageNum: number
  pageSize: number
}

// 告警类型
interface IAlarm {
  id: number
  level: 'high' | 'medium' | 'low'
  levelText: string
  title: string
  description: string
  source: string
  time: string
  status: 'pending' | 'processing' | 'resolved'
  statusText: string
  createTime?: string
  updateTime?: string
}

// 任务类型
interface ITask {
  id: number
  priority: 'high' | 'medium' | 'low'
  priorityText: string
  title: string
  description: string
  assigneeAvatar: string
  assigneeName: string
  assigneeId?: number
  createTime: string
  updateTime?: string
  status: 'pending' | 'processing' | 'completed'
  statusText: string
  deadline?: string
}

// 系统状态类型
interface ISystemStatus {
  status: string
  uptime?: number
  lastCheckTime?: string
}

// 统计数据类型
interface IStats {
  alarmCount: number
  taskCount: number
  completedCount: number
  todayCount?: number
  pendingCount?: number
}

// 菜单项类型
interface IMenuItem {
  id: number
  name: string
  icon: string
  bgColor?: string
  path: string
}

// 请求配置类型
interface IRequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

// 分页参数类型
interface IPagination {
  page: number
  pageSize: number
  total?: number
}

// 告警查询参数
interface IAlarmQuery extends Partial<IPagination> {
  status?: string
  level?: string
  startTime?: string
  endTime?: string
}

// 任务查询参数
interface ITaskQuery extends Partial<IPagination> {
  status?: string
  priority?: string
  assigneeId?: number
  startTime?: string
  endTime?: string
}

// Page数据类型定义
interface IPageData {
  [key: string]: any
}

// Page选项类型
interface IPageOptions<D extends IPageData = IPageData> {
  data: D
  onLoad?(query: Record<string, string | undefined>): void
  onShow?(): void
  onReady?(): void
  onHide?(): void
  onUnload?(): void
  onPullDownRefresh?(): void
  onReachBottom?(): void
  onShareAppMessage?(options: WechatMiniprogram.Page.IShareAppMessageOption): WechatMiniprogram.Page.ICustomShareContent
  onPageScroll?(options: WechatMiniprogram.Page.IPageScrollOption): void
  [key: string]: any
}
