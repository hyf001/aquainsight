import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Table, Pagination } from '@/components/ui/Table'
import { cn } from '@/utils/cn'
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
    ...departments.map((d) => ({ value: String(d.id), label: d.name })),
  ]

  // 获取任务列表
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = (await taskApi.getPage({
        pageNum,
        pageSize,
        siteName: filters.siteName || undefined,
        status: (filters.status as TaskStatus) || undefined,
        departmentId: filters.departmentId ? Number(filters.departmentId) : undefined,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
      })) as unknown as { list: Task[]; total: number }
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
      const [sitesData, templatesData, deptsData] = (await Promise.all([
        siteApi.getSites({ pageNum: 1, pageSize: 1000 }),
        taskTemplateApi.list(),
        organizationApi.getDepartments(),
      ])) as unknown as [{ list: SiteVO[] }, TaskTemplate[], DepartmentVO[]]

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

  // 表格列定义
  const columns = [
    {
      key: 'id',
      title: '任务编号',
      width: 100,
      render: (value: number) => <span className="text-clean-600">#{value}</span>,
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      render: (value: TaskStatus) => {
        const statusInfo = taskStatusMap[value]
        return (
          <span className={cn('inline-flex items-center px-2 py-1 text-xs rounded-full', statusInfo?.color)}>
            {statusInfo?.label || value}
          </span>
        )
      },
    },
    {
      key: 'taskTemplateName',
      title: '任务模版',
      width: 180,
      render: (value: string) => <span className="font-medium text-clean-900">{value}</span>,
    },
    {
      key: 'siteName',
      title: '站点',
      width: 150,
      render: (value: string) => <span className="text-clean-700">{value}</span>,
    },
    {
      key: 'departmentName',
      title: '运维小组',
      width: 120,
      render: (value: string) => <span className="text-clean-600">{value || '-'}</span>,
    },
    {
      key: 'operator',
      title: '操作人',
      width: 100,
      render: (value: string) => <span className="text-clean-600">{value || '-'}</span>,
    },
    {
      key: 'triggerTime',
      title: '触发时间',
      width: 150,
      render: (value: string) => <span className="text-clean-500 text-sm">{formatTime(value)}</span>,
    },
    {
      key: 'startTime',
      title: '耗时',
      width: 100,
      render: (_: string, record: Task) => (
        <span className="text-clean-500 text-sm">{getDuration(record)}</span>
      ),
    },
    {
      key: 'taskItemCount',
      title: '任务项',
      width: 80,
      align: 'center' as const,
      render: (value: number) => (
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'id',
      title: '操作',
      width: 100,
      render: (_: number, record: Task) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => handleViewDetail(record.id)}
        >
          查看
        </Button>
      ),
    },
  ]

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
      <div className="bg-white rounded-xl border border-clean-200 p-4">
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
              <Search className="w-4 h-4 mr-1" />
              搜索
            </Button>
          </div>
        </div>
      </div>

      {/* 表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-clean-200 overflow-hidden"
      >
        <Table columns={columns} data={tasks} loading={loading} />
      </motion.div>

      {/* 分页 */}
      {total > 0 && (
        <div className="bg-white rounded-xl border border-clean-200 px-4">
          <Pagination
            current={pageNum}
            total={total}
            pageSize={pageSize}
            onChange={setPageNum}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPageNum(1)
            }}
          />
        </div>
      )}

      {/* 手动创建任务模态框 */}
      <Modal
        open={showManualModal}
        onClose={() => setShowManualModal(false)}
        title="手动添加任务"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowManualModal(false)}>
              取消
            </Button>
            <Button onClick={handleCreateManual}>创建</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="站点"
            value={String(manualForm.siteId)}
            onChange={(val) => setManualForm({ ...manualForm, siteId: Number(val) })}
            options={[
              { value: '0', label: '请选择站点' },
              ...sites.map((s) => ({
                value: String(s.id),
                label: `${s.siteName} (${s.siteCode})`,
              })),
            ]}
          />

          <Select
            label="任务模版"
            value={String(manualForm.taskTemplateId)}
            onChange={(val) => setManualForm({ ...manualForm, taskTemplateId: Number(val) })}
            options={[
              { value: '0', label: '请选择任务模版' },
              ...taskTemplates.map((tt) => ({ value: String(tt.id), label: tt.name })),
            ]}
          />

          <Select
            label="运维小组"
            value={String(manualForm.departmentId)}
            onChange={(val) => setManualForm({ ...manualForm, departmentId: Number(val) })}
            options={[
              { value: '0', label: '请选择运维小组' },
              ...departments.map((d) => ({ value: String(d.id), label: d.name })),
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}
