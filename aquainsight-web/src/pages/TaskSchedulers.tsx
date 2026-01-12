import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, Calendar, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import {
  taskSchedulerApi,
  taskTemplateApi,
  TaskScheduler,
  TaskTemplate,
  PeriodConfig,
  periodTypeMap,
} from '@/services/maintenance'
import { siteApi, SiteVO } from '@/services/monitoring'
import { organizationApi, DepartmentVO } from '@/services/organization'

// 周期类型选项
const periodTypeOptions = [
  { value: 'INTERVAL', label: '间隔天数' },
  { value: 'WEEK', label: '每周' },
  { value: 'MONTH', label: '每月' },
]

export default function TaskSchedulers() {
  const [schedulers, setSchedulers] = useState<TaskScheduler[]>([])
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([])
  const [sites, setSites] = useState<SiteVO[]>([])
  const [departments, setDepartments] = useState<DepartmentVO[]>([])
  const [loading, setLoading] = useState(false)
  const [searchSiteName, setSearchSiteName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<TaskScheduler | null>(null)

  // 分页参数
  const [pageNum, setPageNum] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 表单状态
  const [configForm, setConfigForm] = useState<{
    siteId: number
    taskTemplateId: number
    departmentId?: number
    periodConfig?: PeriodConfig
  }>({
    siteId: 0,
    taskTemplateId: 0,
    periodConfig: {
      periodType: 'INTERVAL',
      n: 7,
    },
  })

  // 获取调度任务列表
  const fetchSchedulers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await taskSchedulerApi.getPage({
        pageNum,
        pageSize,
        siteName: searchSiteName || undefined,
      }) as any
      setSchedulers(data.list)
      setTotal(data.total)
    } catch (error) {
      console.error('获取调度任务列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [pageNum, pageSize, searchSiteName])

  // 获取任务模版列表
  const fetchTaskTemplates = useCallback(async () => {
    try {
      const data = await taskTemplateApi.list() as any
      setTaskTemplates(data)
    } catch (error) {
      console.error('获取任务模版列表失败:', error)
    }
  }, [])

  // 获取站点列表
  const fetchSites = useCallback(async () => {
    try {
      const data = await siteApi.getSites({ pageNum: 1, pageSize: 1000 }) as any
      setSites(data.list)
    } catch (error) {
      console.error('获取站点列表失败:', error)
    }
  }, [])

  // 获取部门列表
  const fetchDepartments = useCallback(async () => {
    try {
      const data = await organizationApi.getDepartments() as any
      setDepartments(data)
    } catch (error) {
      console.error('获取部门列表失败:', error)
    }
  }, [])

  useEffect(() => {
    fetchSchedulers()
    fetchTaskTemplates()
    fetchSites()
    fetchDepartments()
  }, [fetchSchedulers, fetchTaskTemplates, fetchSites, fetchDepartments])

  // 搜索
  const handleSearch = () => {
    setPageNum(1)
    fetchSchedulers()
  }

  // 打开配置模态框
  const handleConfigure = (item?: TaskScheduler) => {
    setEditingItem(item || null)
    if (item) {
      setConfigForm({
        siteId: item.siteId,
        taskTemplateId: item.taskTemplateId,
        departmentId: item.departmentId,
        periodConfig: item.periodConfig || {
          periodType: 'INTERVAL',
          n: 7,
        },
      })
    } else {
      setConfigForm({
        siteId: 0,
        taskTemplateId: 0,
        periodConfig: {
          periodType: 'INTERVAL',
          n: 7,
        },
      })
    }
    setShowModal(true)
  }

  // 保存配置
  const handleSave = async () => {
    if (!configForm.siteId) {
      alert('请选择站点')
      return
    }
    if (!configForm.taskTemplateId) {
      alert('请选择任务模版')
      return
    }

    try {
      await taskSchedulerApi.configure(configForm)
      setShowModal(false)
      fetchSchedulers()
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    }
  }

  // 删除调度任务
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此调度任务吗？')) return
    try {
      await taskSchedulerApi.delete(id)
      fetchSchedulers()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  // 格式化周期配置显示
  const formatPeriodConfig = (config?: PeriodConfig) => {
    if (!config) return '未配置'

    switch (config.periodType) {
      case 'INTERVAL':
        return `每 ${config.n} 天`
      case 'WEEK':
        return `每周第 ${config.n} 天`
      case 'MONTH':
        return `每月第 ${config.n} 日`
      default:
        return '未知'
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-clean-900">调度任务管理</h1>
          <p className="text-clean-500 mt-1">管理站点的周期性运维任务调度</p>
        </div>
        <Button onClick={() => handleConfigure()}>
          <Plus className="w-4 h-4 mr-2" />
          配置调度任务
        </Button>
      </div>

      {/* 搜索栏 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索站点名称..."
                value={searchSiteName}
                onChange={(e) => setSearchSiteName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="secondary" onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-clean-400">加载中...</div>
        ) : schedulers.length === 0 ? (
          <div className="text-center py-12 text-clean-400">暂无数据</div>
        ) : (
          schedulers.map((item) => (
            <Card key={item.id} hover>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-nature-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-nature-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-clean-900">{item.taskTemplateName}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            item.taskSchedulerState === 'ENABLED'
                              ? 'bg-nature-100 text-nature-700'
                              : 'bg-clean-200 text-clean-600'
                          }`}
                        >
                          {item.taskSchedulerState === 'ENABLED' ? '已启用' : '已禁用'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-clean-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {item.siteName} ({item.siteCode})
                        </span>
                        {item.departmentName && (
                          <span>运维小组: {item.departmentName}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatPeriodConfig(item.periodConfig)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-clean-500">
                      创建人: {item.creator}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleConfigure(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 分页 */}
      {total > 0 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => setPageNum(Math.max(1, pageNum - 1))}
            disabled={pageNum === 1}
          >
            上一页
          </Button>
          <span className="text-sm text-clean-600">
            第 {pageNum} 页 / 共 {Math.ceil(total / pageSize)} 页
          </span>
          <Button
            variant="secondary"
            onClick={() => setPageNum(Math.min(Math.ceil(total / pageSize), pageNum + 1))}
            disabled={pageNum >= Math.ceil(total / pageSize)}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 配置模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-clean-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-clean-900">
                {editingItem ? '编辑调度任务' : '配置调度任务'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-clean-400 hover:text-clean-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Select
                label="站点"
                value={String(configForm.siteId)}
                onChange={(val) => setConfigForm({ ...configForm, siteId: Number(val) })}
                options={[
                  { value: '0', label: '请选择站点' },
                  ...sites.map(s => ({ value: String(s.id), label: `${s.siteName} (${s.siteCode})` })),
                ]}
                disabled={!!editingItem}
              />

              <Select
                label="任务模版"
                value={String(configForm.taskTemplateId)}
                onChange={(val) => setConfigForm({ ...configForm, taskTemplateId: Number(val) })}
                options={[
                  { value: '0', label: '请选择任务模版' },
                  ...taskTemplates.map(tt => ({ value: String(tt.id), label: tt.name })),
                ]}
              />

              <Select
                label="运维小组"
                value={String(configForm.departmentId || '0')}
                onChange={(val) => setConfigForm({ ...configForm, departmentId: Number(val) || undefined })}
                options={[
                  { value: '0', label: '请选择运维小组（可选）' },
                  ...departments.map(d => ({ value: String(d.id), label: d.name })),
                ]}
              />

              <div className="space-y-3">
                <label className="block text-sm text-clean-600">周期配置</label>

                <Select
                  label="周期类型"
                  value={configForm.periodConfig?.periodType || 'INTERVAL'}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      periodConfig: {
                        ...configForm.periodConfig!,
                        periodType: e.target.value as any,
                      },
                    })
                  }
                  options={periodTypeOptions}
                />

                <Input
                  label={
                    configForm.periodConfig?.periodType === 'INTERVAL'
                      ? '间隔天数'
                      : configForm.periodConfig?.periodType === 'WEEK'
                      ? '星期几 (1-7)'
                      : '每月第几日 (1-31)'
                  }
                  type="number"
                  value={configForm.periodConfig?.n || ''}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      periodConfig: {
                        ...configForm.periodConfig!,
                        n: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="请输入数值"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-clean-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
