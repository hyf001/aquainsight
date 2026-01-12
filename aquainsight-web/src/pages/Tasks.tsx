import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Calendar, User, MapPin, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import {
  taskApi,
  taskTemplateApi,
  Task,
  TaskTemplate,
  TaskStatus,
  taskStatusMap,
} from '@/services/maintenance'
import { siteApi, SiteVO } from '@/services/monitoring'
import { organizationApi, DepartmentVO } from '@/services/organization'

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 手动创建任务相关状态
  const [showManualModal, setShowManualModal] = useState(false)
  const [sites, setSites] = useState<SiteVO[]>([])
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([])
  const [departments, setDepartments] = useState<DepartmentVO[]>([])
  const [manualForm, setManualForm] = useState({
    siteId: 0,
    taskTemplateId: 0,
    departmentId: 0,
  })

  // 筛选条件
  const [filters, setFilters] = useState({
    siteName: '',
    status: '',
    departmentId: '',
    startTime: '',
    endTime: '',
  })

  // 状态选项
  const statusOptions = [
    { value: '', label: '全部状态' },
    ...Object.entries(taskStatusMap).map(([key, value]) => ({
      value: key,
      label: value.label,
    })),
  ]

  // 部门选项
  const departmentOptions = [
    { value: '', label: '全部运维小组' },
    ...departments.map(d => ({ value: String(d.id), label: d.name }))
  ]

  // 获取任务列表
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await taskApi.getPage({
        pageNum,
        pageSize,
        siteName: filters.siteName || undefined,
        status: filters.status as TaskStatus || undefined,
        departmentId: filters.departmentId ? Number(filters.departmentId) : undefined,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
      }) as any
      setTasks(data.list)
      setTotal(data.total)
    } catch (error) {
      console.error('获取任务列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, filters])

  // 获取基础数据
  const fetchBaseData = useCallback(async () => {
    try {
      const [sitesData, templatesData, deptsData] = await Promise.all([
        siteApi.getSites({ pageNum: 1, pageSize: 1000 }),
        taskTemplateApi.list(),
        organizationApi.getDepartments()
      ]) as any[]

      setSites(sitesData.list)
      setTaskTemplates(templatesData)
      setDepartments(deptsData)
    } catch (error) {
      console.error('获取基础数据失败:', error)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    fetchBaseData()
  }, [fetchTasks, fetchBaseData])

  // 搜索
  const handleSearch = () => {
    setPageNum(1)
    fetchTasks()
  }

  // 重置筛选
  const handleReset = () => {
    setFilters({
      siteName: '',
      status: '',
      departmentId: '',
      startTime: '',
      endTime: '',
    })
    setPageNum(1)
    fetchTasks()
  }

  // 查看任务详情
  const handleViewDetail = (id: number) => {
    navigate(`/tasks/${id}`)
  }

  // 手动创建任务
  const handleCreateManual = async () => {
    if (!manualForm.siteId) {
      alert('请选择站点')
      return
    }
    if (!manualForm.taskTemplateId) {
      alert('请选择任务模版')
      return
    }
    if (!manualForm.departmentId) {
      alert('请选择运维小组')
      return
    }

    try {
      await taskApi.createManual(manualForm)
      setShowManualModal(false)
      setManualForm({ siteId: 0, taskTemplateId: 0, departmentId: 0 })
      fetchTasks()
    } catch (error) {
      console.error('创建失败:', error)
      alert('创建失败')
    }
  }

  // 获取状态样式
  const getStatusClass = (status: TaskStatus) => {
    return taskStatusMap[status]?.color || 'badge-info'
  }

  // 格式化时间
  const formatTime = (time: string | undefined) => {
    if (!time) return '-'
    return time.replace('T', ' ').substring(0, 16)
  }

  // 计算执行时长
  const getDuration = (task: Task) => {
    if (!task.startTime || (!task.endTime && task.status !== 'IN_PROGRESS')) return '-'
    const start = new Date(task.startTime.replace('T', ' '))
    const end = task.endTime ? new Date(task.endTime.replace('T', ' ')) : new Date()
    const minutes = Math.floor((end.getTime() - start.getTime()) / 60000)
    if (minutes < 60) return `${minutes}分钟`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}小时${mins}分钟`
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-clean-900">运维任务</h1>
          <p className="text-clean-500 mt-1">查看和管理运维任务执行情况</p>
        </div>
        <Button onClick={() => setShowManualModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          手动添加任务
        </Button>
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-6 gap-4">
            <Input
              placeholder="站点名称"
              value={filters.siteName}
              onChange={(e) => setFilters({ ...filters, siteName: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select
              value={filters.status}
              onChange={(val) => setFilters({ ...filters, status: val })}
              options={statusOptions}
            />
            <Select
              value={filters.departmentId}
              onChange={(val) => setFilters({ ...filters, departmentId: val })}
              options={departmentOptions}
            />
            <Input
              type="datetime-local"
              placeholder="开始时间"
              value={filters.startTime}
              onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
            />
            <Input
              type="datetime-local"
              placeholder="结束时间"
              value={filters.endTime}
              onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleReset} className="flex-1">
                重置
              </Button>
              <Button onClick={handleSearch} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-clean-400">加载中...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-clean-400">暂无数据</div>
        ) : (
          <>
            {tasks.map((task) => (
              <Card key={task.id} hover className="cursor-pointer" onClick={() => handleViewDetail(task.id)}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`badge ${getStatusClass(task.status)}`}>
                          {taskStatusMap[task.status]?.label || task.status}
                        </span>
                        <span className="text-sm text-clean-500">
                          任务编号: {task.id}
                        </span>
                        {task.operator && (
                          <span className="text-sm text-clean-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {task.operator}
                          </span>
                        )}
                      </div>

                      <h3 className="font-medium text-lg text-clean-900 mb-2">
                        {task.taskTemplateName}
                      </h3>

                      <div className="flex items-center gap-6 text-sm text-clean-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {task.siteName}
                        </span>
                        {task.departmentName && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            运维小组: {task.departmentName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          触发: {formatTime(task.triggerTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          耗时: {getDuration(task)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-clean-400">任务项</p>
                        <p className="text-xl font-semibold text-clean-800">
                          {task.taskItemCount || 0}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-clean-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* 分页 */}
            {total > pageSize && (
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-clean-500">
                  共 {total} 条记录
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pageNum === 1}
                    onClick={() => setPageNum(pageNum - 1)}
                  >
                    上一页
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pageNum * pageSize >= total}
                    onClick={() => setPageNum(pageNum + 1)}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 手动创建任务模态框 */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-clean-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-clean-900">手动添加任务</h2>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-clean-400 hover:text-clean-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Select
                label="站点"
                value={String(manualForm.siteId)}
                onChange={(val) => setManualForm({ ...manualForm, siteId: Number(val) })}
                options={[
                  { value: '0', label: '请选择站点' },
                  ...sites.map(s => ({ value: String(s.id), label: `${s.siteName} (${s.siteCode})` })),
                ]}
              />

              <Select
                label="任务模版"
                value={String(manualForm.taskTemplateId)}
                onChange={(val) => setManualForm({ ...manualForm, taskTemplateId: Number(val) })}
                options={[
                  { value: '0', label: '请选择任务模版' },
                  ...taskTemplates.map(tt => ({ value: String(tt.id), label: tt.name })),
                ]}
              />

              <Select
                label="运维小组"
                value={String(manualForm.departmentId)}
                onChange={(val) => setManualForm({ ...manualForm, departmentId: Number(val) })}
                options={[
                  { value: '0', label: '请选择运维小组' },
                  ...departments.map(d => ({ value: String(d.id), label: d.name })),
                ]}
              />
            </div>

            <div className="px-6 py-4 border-t border-clean-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowManualModal(false)}>
                取消
              </Button>
              <Button onClick={handleCreateManual}>
                创建
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

