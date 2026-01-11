import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Calendar, User, MapPin, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import {
  taskApi,
  Task,
  TaskStatus,
  taskStatusMap,
} from '@/services/maintenance'

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 筛选条件
  const [filters, setFilters] = useState({
    siteName: '',
    status: '',
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

  // 获取任务列表
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await taskApi.getPage({
        pageNum,
        pageSize,
        siteName: filters.siteName || undefined,
        status: filters.status as TaskStatus || undefined,
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

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

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
        {/* 手动创建任务功能暂时隐藏，后续实现 */}
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-5 gap-4">
            <Input
              placeholder="站点名称"
              value={filters.siteName}
              onChange={(e) => setFilters({ ...filters, siteName: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={statusOptions}
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
    </div>
  )
}
