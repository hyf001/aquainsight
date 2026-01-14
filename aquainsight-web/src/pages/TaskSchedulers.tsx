import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Calendar, Clock, MapPin, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'
import {
  taskSchedulerApi,
  taskTemplateApi,
  TaskScheduler,
  TaskTemplate,
  PeriodConfig,
  PeriodType,
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
  const [pageSize] = useState(12)
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
      const data = (await taskSchedulerApi.getPage({
        pageNum,
        pageSize,
        siteName: searchSiteName || undefined,
      })) as unknown as { list: TaskScheduler[]; total: number }
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
      const data = await taskTemplateApi.list()
      setTaskTemplates(data as unknown as TaskTemplate[])
    } catch (error) {
      console.error('获取任务模版列表失败:', error)
    }
  }, [])

  // 获取站点列表
  const fetchSites = useCallback(async () => {
    try {
      const data = (await siteApi.getSites({ pageNum: 1, pageSize: 1000 })) as unknown as {
        list: SiteVO[]
      }
      setSites(data.list)
    } catch (error) {
      console.error('获取站点列表失败:', error)
    }
  }, [])

  // 获取部门列表
  const fetchDepartments = useCallback(async () => {
    try {
      const data = await organizationApi.getDepartments()
      setDepartments(data as unknown as DepartmentVO[])
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
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
          <input
            type="text"
            placeholder="搜索站点名称..."
            value={searchSiteName}
            onChange={(e) => setSearchSiteName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-clean-300 rounded-xl focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100"
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>
          搜索
        </Button>
      </div>

      {/* 卡片网格 */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-nature-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-clean-500">加载中...</span>
        </div>
      ) : schedulers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-clean-400">
          <Calendar className="w-12 h-12 mb-4" />
          <p>暂无调度任务</p>
          <Button variant="primary" className="mt-4" onClick={() => handleConfigure()}>
            配置第一个调度
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedulers.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-white rounded-xl border border-clean-200 overflow-hidden hover:shadow-lg transition-shadow',
                item.taskSchedulerState !== 'ENABLED' && 'opacity-60'
              )}
            >
              {/* 顶部色条 */}
              <div
                className={cn(
                  'h-1',
                  item.taskSchedulerState === 'ENABLED' ? 'bg-orange-500' : 'bg-clean-300'
                )}
              />

              <div className="p-5">
                {/* 头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        item.taskSchedulerState === 'ENABLED'
                          ? 'bg-orange-100'
                          : 'bg-clean-100'
                      )}
                    >
                      <Calendar
                        className={cn(
                          'w-5 h-5',
                          item.taskSchedulerState === 'ENABLED'
                            ? 'text-orange-600'
                            : 'text-clean-400'
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-clean-900">{item.taskTemplateName}</h3>
                      <p className="text-xs text-clean-500">{item.siteCode}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full',
                      item.taskSchedulerState === 'ENABLED'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-clean-100 text-clean-500'
                    )}
                  >
                    {item.taskSchedulerState === 'ENABLED' ? '已启用' : '已禁用'}
                  </span>
                </div>

                {/* 信息 */}
                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-clean-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.siteName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-clean-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatPeriodConfig(item.periodConfig)}</span>
                  </div>
                  {item.departmentName && (
                    <div className="text-clean-500">运维小组: {item.departmentName}</div>
                  )}
                </div>

                {/* 创建人 */}
                <p className="text-xs text-clean-400 mb-3">创建人: {item.creator}</p>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 pt-3 border-t border-clean-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={
                      item.taskSchedulerState === 'ENABLED' ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )
                    }
                    onClick={() => {
                      // TODO: 实现启用/禁用功能
                    }}
                  >
                    {item.taskSchedulerState === 'ENABLED' ? '禁用' : '启用'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 className="w-4 h-4" />}
                    onClick={() => handleConfigure(item)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {total > pageSize && (
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
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? '编辑调度任务' : '配置调度任务'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="站点"
            value={String(configForm.siteId)}
            onChange={(val) => setConfigForm({ ...configForm, siteId: Number(val) })}
            options={[
              { value: '0', label: '请选择站点' },
              ...sites.map((s) => ({
                value: String(s.id),
                label: `${s.siteName} (${s.siteCode})`,
              })),
            ]}
            disabled={!!editingItem}
          />

          <Select
            label="任务模版"
            value={String(configForm.taskTemplateId)}
            onChange={(val) => setConfigForm({ ...configForm, taskTemplateId: Number(val) })}
            options={[
              { value: '0', label: '请选择任务模版' },
              ...taskTemplates.map((tt) => ({ value: String(tt.id), label: tt.name })),
            ]}
          />

          <Select
            label="运维小组"
            value={String(configForm.departmentId || '0')}
            onChange={(val) =>
              setConfigForm({ ...configForm, departmentId: Number(val) || undefined })
            }
            options={[
              { value: '0', label: '请选择运维小组（可选）' },
              ...departments.map((d) => ({ value: String(d.id), label: d.name })),
            ]}
          />

          <div className="space-y-3">
            <label className="block text-sm text-clean-600">周期配置</label>

            <Select
              label="周期类型"
              value={configForm.periodConfig?.periodType || 'INTERVAL'}
              onChange={(val) =>
                setConfigForm({
                  ...configForm,
                  periodConfig: {
                    ...configForm.periodConfig!,
                    periodType: val as 'INTERVAL' | 'WEEK' | 'MONTH',
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
              value={configForm.periodConfig?.n?.toString() || ''}
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
      </Modal>
    </div>
  )
}
