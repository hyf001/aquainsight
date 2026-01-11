import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Input,
  Select,
  Button,
  Tree,
  Tag,
  Modal,
  RangePicker,
  Form,
  Pagination,
} from '@/components/ui'
import { toast } from '@/utils/toast'
import {
  getTaskSchedulerPage,
  backfillTask,
  type TaskScheduler,
  type BackfillTaskRequest,
} from '@/services/maintenance'
import {
  getEnterpriseSiteTree,
  type EnterpriseSiteTree,
  type Site,
} from '@/services/monitoring'
import { getAllDepartments, type Department } from '@/services/organization'

// 星期映射
const WEEKDAYS_MAP: { [key: number]: string } = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
}

// 扩展的任务调度类型
type TaskSchedulerExtended = TaskScheduler & {
  enterpriseId?: number
  enterpriseName?: string
  siteCode?: string
}

// 树节点类型
interface TreeDataNode {
  key: string
  title: React.ReactNode
  children?: TreeDataNode[]
  isLeaf?: boolean
}

const TaskScheduler: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [taskSchedulers, setTaskSchedulers] = useState<TaskSchedulerExtended[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 树形数据
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])

  // 搜索条件
  const [filters, setFilters] = useState({
    siteName: '',
    enterpriseName: '',
    departmentId: undefined as number | undefined,
  })

  // 当前选中的企业或站点
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<number | undefined>()
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>()

  // 部门列表
  const [departments, setDepartments] = useState<Department[]>([])

  // 补任务弹窗
  const [backfillModalVisible, setBackfillModalVisible] = useState(false)
  const [backfillLoading, setBackfillLoading] = useState(false)
  const [currentTaskScheduler, setCurrentTaskScheduler] = useState<TaskSchedulerExtended | null>(null)
  const backfillForm = useForm()

  // 加载企业-站点树
  const loadEnterpriseTree = async () => {
    try {
      const data = await getEnterpriseSiteTree(filters.enterpriseName, filters.siteName)

      // 转换为树形结构数据
      const treeNodes: TreeDataNode[] = data.map((enterprise: EnterpriseSiteTree) => ({
        key: `enterprise-${enterprise.enterpriseId}`,
        title: (
          <span className="flex items-center">
            <BuildingOfficeIcon className="w-4 h-4 mr-2" />
            {enterprise.enterpriseName}
          </span>
        ),
        children: enterprise.sites.map((site: Site) => ({
          key: `site-${site.id}`,
          title: (
            <span className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              {site.siteName}
            </span>
          ),
          isLeaf: true,
        })),
      }))

      setTreeData(treeNodes)

      // 默认展开第一个企业
      if (treeNodes.length > 0) {
        setExpandedKeys([treeNodes[0].key])
      }
    } catch (error) {
      console.error('加载企业站点树失败:', error)
      toast.error('加载企业站点树失败')
    }
  }

  // 加载任务调度列表
  const loadTaskSchedulers = async () => {
    setLoading(true)
    try {
      const response = await getTaskSchedulerPage({
        pageNum,
        pageSize,
        siteName: filters.siteName || undefined,
        enterpriseId: selectedEnterpriseId,
        siteId: selectedSiteId,
        departmentId: filters.departmentId,
      })

      setTaskSchedulers(response.list || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('加载任务调度列表失败:', error)
      toast.error('加载任务调度列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments()
      setDepartments(data)
    } catch (error) {
      console.error('加载部门列表失败:', error)
    }
  }

  // 初始化加载
  useEffect(() => {
    loadEnterpriseTree()
    loadDepartments()
  }, [])

  // 当筛选条件或分页变化时重新加载
  useEffect(() => {
    loadTaskSchedulers()
  }, [pageNum, pageSize, selectedEnterpriseId, selectedSiteId, filters.departmentId])

  // 树节点选择事件
  const handleTreeSelect = (keys: React.Key[]) => {
    setSelectedKeys(keys)

    if (keys.length === 0) {
      setSelectedEnterpriseId(undefined)
      setSelectedSiteId(undefined)
      return
    }

    const key = keys[0].toString()

    if (key.startsWith('enterprise-')) {
      // 选中企业
      const enterpriseId = parseInt(key.replace('enterprise-', ''))
      setSelectedEnterpriseId(enterpriseId)
      setSelectedSiteId(undefined)
    } else if (key.startsWith('site-')) {
      // 选中站点
      const siteId = parseInt(key.replace('site-', ''))
      setSelectedEnterpriseId(undefined)
      setSelectedSiteId(siteId)
    }
  }

  // 解析周期配置为可读文本
  const formatPeriodConfig = (plan: TaskSchedulerExtended) => {
    if (!plan.periodConfig) return '-'

    const { periodType, n } = plan.periodConfig

    if (periodType === 'WEEK' && n) {
      // 解析位图
      const weekdays: number[] = []
      for (let i = 1; i <= 7; i++) {
        if (n & Math.pow(2, i)) {
          weekdays.push(i)
        }
      }
      const weekdayNames = weekdays.map(w => WEEKDAYS_MAP[w]).join('、')
      return `星期${weekdayNames}`
    }

    if (periodType === 'MONTH' && n) {
      // 解析位图
      const days: number[] = []
      for (let i = 1; i <= 31; i++) {
        if (n & Math.pow(2, i)) {
          days.push(i)
        }
      }
      return `每月${days.join('、')}日`
    }

    if (periodType === 'INTERVAL' && n) {
      return `每隔${n}天`
    }

    return '-'
  }

  // 打开补任务弹窗
  const handleOpenBackfill = (record: TaskSchedulerExtended) => {
    setCurrentTaskScheduler(record)
    setBackfillModalVisible(true)
    backfillForm.reset()
  }

  // 提交补任务
  const handleBackfillSubmit = async () => {
    try {
      const values = await backfillForm.trigger()

      if (!values) return

      if (!currentTaskScheduler) {
        toast.error('未选择任务调度')
        return
      }

      const formValues = backfillForm.getValues()
      const startTime = formValues.dateRange?.[0]
      const endTime = formValues.dateRange?.[1]

      if (!startTime || !endTime) {
        toast.error('请选择时间范围')
        return
      }

      setBackfillLoading(true)

      // 格式化时间
      const formatDate = (date: Date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        const s = String(date.getSeconds()).padStart(2, '0')
        return `${y}-${m}-${d} ${h}:${min}:${s}`
      }

      const request: BackfillTaskRequest = {
        taskSchedulerId: currentTaskScheduler.id,
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
      }

      const result = await backfillTask(request)

      toast.success(`成功补齐 ${result.totalCount} 个任务`)
      setBackfillModalVisible(false)
      backfillForm.reset()

    } catch (error: any) {
      console.error('补任务失败:', error)
      toast.error(error.message || '补任务失败')
    } finally {
      setBackfillLoading(false)
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '序号',
      width: 80,
      render: (_: any, __: any, index: number) => (pageNum - 1) * pageSize + index + 1,
    },
    {
      title: '运维周期',
      width: 150,
      render: (_: any, record: TaskSchedulerExtended) => formatPeriodConfig(record),
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      width: 180,
    },
    {
      title: '所属客户',
      dataIndex: 'enterpriseName',
      width: 200,
      render: (text: string) => text || '-',
    },
    {
      title: '运维任务模版',
      dataIndex: 'taskTemplateName',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '运维小组',
      dataIndex: 'departmentName',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'taskSchedulerState',
      width: 100,
      render: (state: string) => {
        if (state === '进行中') {
          return <Tag color="success">{state}</Tag>
        }
        if (state === '暂停') {
          return <Tag color="warning">{state}</Tag>
        }
        return <Tag>{state}</Tag>
      },
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: TaskSchedulerExtended) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<PlusIcon className="w-4 h-4" />}
            onClick={() => handleOpenBackfill(record)}
          >
            补任务
          </Button>
        </div>
      ),
    },
  ]

  // 搜索处理
  const handleSearch = () => {
    setPageNum(1)
    loadEnterpriseTree()
    loadTaskSchedulers()
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader bordered={false}>
          <div className="text-lg font-semibold">任务调度</div>
        </CardHeader>
        <CardBody>
          <div className="flex min-h-[calc(100vh-200px)]">
            {/* 左侧：企业-站点树 */}
            <div className="w-1/5 border-r border-gray-200">
              <div className="p-4">
                <div className="text-base font-medium mb-4">全部站点</div>

                {/* 搜索框 */}
                <div className="space-y-3 mb-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="请输入企业名称"
                      value={filters.enterpriseName}
                      onChange={(e) => setFilters({ ...filters, enterpriseName: e.target.value })}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<MagnifyingGlassIcon className="w-4 h-4" />}
                      onClick={handleSearch}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="请输入站点名称"
                      value={filters.siteName}
                      onChange={(e) => setFilters({ ...filters, siteName: e.target.value })}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<MagnifyingGlassIcon className="w-4 h-4" />}
                      onClick={handleSearch}
                    />
                  </div>
                </div>

                {/* 树形结构 */}
                <div className="max-h-[calc(100vh-380px)] overflow-auto">
                  <Tree
                    treeData={treeData}
                    expandedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                    onExpand={(keys) => setExpandedKeys(keys)}
                    onSelect={handleTreeSelect}
                    showLine
                  />
                </div>
              </div>
            </div>

            {/* 右侧：任务调度列表 */}
            <div className="flex-1">
              <div className="p-4">
                {/* 筛选条件 */}
                <div className="mb-4 flex gap-4">
                  <div className="w-1/3">
                    <Select
                      placeholder="请选择运维小组"
                      value={filters.departmentId}
                      onChange={(value: number | undefined) => {
                        setFilters({ ...filters, departmentId: value })
                        setPageNum(1)
                      }}
                      options={departments.map((dept) => ({
                        label: dept.name,
                        value: dept.id,
                      }))}
                    />
                  </div>
                </div>

                {/* 任务调度表格 */}
                <Table
                  columns={columns}
                  dataSource={taskSchedulers}
                  rowKey="id"
                  loading={loading}
                  size="small"
                  scroll={{ x: 1200 }}
                />
                {/* 分页 */}
                <div className="mt-4 flex justify-end">
                  <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    total={total}
                    pageSizeOptions={['10', '20', '50', '100']}
                    showSizeChanger
                    showQuickJumper
                    onChange={(page, size) => {
                      setPageNum(page)
                      setPageSize(size || 20)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 补任务弹窗 */}
      <Modal
        open={backfillModalVisible}
        onClose={() => {
          setBackfillModalVisible(false)
          backfillForm.reset()
        }}
        onOk={handleBackfillSubmit}
        confirmLoading={backfillLoading}
        title="补齐任务"
        width={600}
      >
        <div className="mb-4">
          <div className="mb-2 text-gray-600">
            <strong>站点名称：</strong>{currentTaskScheduler?.siteName || '-'}
          </div>
          <div className="mb-2 text-gray-600">
            <strong>运维周期：</strong>{currentTaskScheduler ? formatPeriodConfig(currentTaskScheduler) : '-'}
          </div>
          <div className="mb-2 text-gray-600">
            <strong>运维任务模版：</strong>{currentTaskScheduler?.taskTemplateName || '-'}
          </div>
        </div>

        <Form form={backfillForm} layout="vertical">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              时间范围 <span className="text-red-500">*</span>
            </label>
            <RangePicker
              value={backfillForm.getValues('dateRange')}
              onChange={(dates) => {
                backfillForm.setValue('dateRange', dates)
              }}
              placeholder={['开始时间', '结束时间']}
              showTime
            />
          </div>

          <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
            <div className="font-medium mb-1">说明：</div>
            <ul className="space-y-1 text-xs">
              <li>系统会根据任务调度的周期配置，自动计算时间范围内应存在的所有任务</li>
              <li>仅会补齐缺失的任务，已存在的任务不会重复生成</li>
              <li>生成的任务状态为"待处理"，过期时间根据任务模版配置自动计算</li>
            </ul>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default TaskScheduler
