import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  type TableColumn,
  Button,
  Modal,
  Form,
  FormField,
  Input,
  TextArea,
  Select,
  type SelectOption,
  Tag,
  RangePicker,
  Pagination,
} from '@/components/ui'
import { toast } from '@/utils/toast'
import { format } from 'date-fns'
import { getAlertRecords, claimAlert, ignoreAlert, type AlertRecord } from '@/services/alert'
import { createManualJobInstance, getTaskTemplateList, type TaskTemplate } from '@/services/maintenance'

const ALERT_STATUS: SelectOption[] = [
  { label: '待处理', value: 'PENDING' },
  { label: '处理中', value: 'IN_PROGRESS' },
  { label: '已解决', value: 'RESOLVED' },
  { label: '已忽略', value: 'IGNORED' },
  { label: '已恢复', value: 'RECOVERED' },
]

const ALERT_LEVELS: SelectOption[] = [
  { label: '紧急', value: 'URGENT' },
  { label: '重要', value: 'IMPORTANT' },
  { label: '一般', value: 'NORMAL' },
  { label: '提示', value: 'INFO' },
]

const NOTIFY_STATUS: SelectOption[] = [
  { label: '待通知', value: 'PENDING' },
  { label: '通知成功', value: 'SUCCESS' },
  { label: '通知失败', value: 'FAILED' },
]

const getAlertStatusColor = (status: string) => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'error'> = {
    PENDING: 'error',
    IN_PROGRESS: 'warning',
    RESOLVED: 'success',
    IGNORED: 'primary',
    RECOVERED: 'primary',
  }
  return map[status] || 'primary'
}

const getAlertLevelColor = (level: string) => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'error'> = {
    URGENT: 'error',
    IMPORTANT: 'warning',
    NORMAL: 'primary',
    INFO: 'success',
  }
  return map[level] || 'primary'
}

const getNotifyStatusColor = (status: string) => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'error'> = {
    PENDING: 'primary',
    SUCCESS: 'success',
    FAILED: 'error',
  }
  return map[status] || 'primary'
}

const AlertRecords: React.FC = () => {
  const [records, setRecords] = useState<AlertRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [handleVisible, setHandleVisible] = useState(false)
  const [createTaskVisible, setCreateTaskVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<AlertRecord | null>(null)
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    alertLevel: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
  })

  const searchForm = useForm()
  const ignoreForm = useForm()
  const taskForm = useForm()

  // Load alert records
  const loadRecords = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const pageResult = await getAlertRecords(pageNum, pageSize, filters)
      setRecords(pageResult.list)
      setPagination({ current: pageResult.pageNum, pageSize: pageResult.pageSize, total: pageResult.total })
    } catch (error) {
      console.error('加载告警记录失败:', error)
      toast.error('加载告警记录失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords(1, 10)
  }, [filters])

  // Handle search
  const handleSearch = () => {
    const values = searchForm.getValues()
    const timeRange = values.timeRange
    setFilters({
      status: values.status,
      alertLevel: values.alertLevel,
      startTime: timeRange?.[0] ? format(timeRange[0], 'yyyy-MM-dd HH:mm:ss') : undefined,
      endTime: timeRange?.[1] ? format(timeRange[1], 'yyyy-MM-dd HH:mm:ss') : undefined,
    })
  }

  // Reset search
  const handleReset = () => {
    searchForm.reset({
      status: undefined,
      alertLevel: undefined,
      timeRange: undefined,
    })
    setFilters({
      status: undefined,
      alertLevel: undefined,
      startTime: undefined,
      endTime: undefined,
    })
  }

  // View detail
  const viewDetail = (record: AlertRecord) => {
    setCurrentRecord(record)
    setDetailVisible(true)
  }

  // Claim alert
  const handleClaim = async (record: AlertRecord) => {
    // If it's a site alert, show task creation modal
    if (record.targetType === 'site') {
      setCurrentRecord(record)
      setCreateTaskVisible(true)
      taskForm.reset({
        taskTemplateId: undefined,
        departmentId: undefined,
      })
      // Load task templates
      loadTaskTemplates()
    } else {
      // Task alert can be claimed directly
      try {
        await claimAlert(record.id)
        toast.success('已认领告警')
        loadRecords(pagination.current, pagination.pageSize)
      } catch (error) {
        console.error('认领告警失败:', error)
        toast.error('操作失败')
      }
    }
  }

  // Load task templates
  const loadTaskTemplates = async () => {
    try {
      const taskTemplateList = await getTaskTemplateList()
      setTaskTemplates(taskTemplateList)
    } catch (error) {
      console.error('加载任务模版列表失败:', error)
      toast.error('加载任务模版列表失败')
    }
  }

  // Create task
  const handleCreateTask = async (values: any) => {
    try {
      // Create manual task instance
      await createManualJobInstance({
        siteId: currentRecord!.targetId,
        taskTemplateId: values.taskTemplateId,
        departmentId: values.departmentId,
      })
      // Claim alert
      await claimAlert(currentRecord!.id)
      toast.success('任务创建成功，告警已认领')
      setCreateTaskVisible(false)
      loadRecords(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('创建任务失败:', error)
      toast.error('操作失败')
    }
  }

  // Open ignore modal
  const openIgnoreModal = (record: AlertRecord) => {
    setCurrentRecord(record)
    setHandleVisible(true)
    ignoreForm.reset({ remark: '' })
  }

  // Ignore alert
  const handleIgnore = async (values: any) => {
    try {
      await ignoreAlert(currentRecord!.id, values.remark)
      toast.success('已忽略')
      setHandleVisible(false)
      loadRecords(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('忽略告警失败:', error)
      toast.error('操作失败')
    }
  }

  // Task template options
  const taskTemplateOptions: SelectOption[] = taskTemplates.map((t) => ({
    label: t.name,
    value: t.id,
  }))

  const columns: TableColumn<AlertRecord>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '80px',
      render: (id) => <span className="font-mono text-sm">{id as number}</span>,
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: '150px',
      render: (name) => <span className="text-sm text-gray-600">{name as string}</span>,
    },
    {
      title: '目标对象',
      dataIndex: 'targetName',
      key: 'targetName',
      width: '150px',
      render: (name) => <span className="text-sm text-gray-600">{name as string}</span>,
    },
    {
      title: '告警级别',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      width: '100px',
      render: (level) => {
        const levelObj = ALERT_LEVELS.find((l) => l.value === level)
        return <Tag color={getAlertLevelColor(level as string)}>{levelObj?.label || (level as string)}</Tag>
      },
    },
    {
      title: '告警消息',
      dataIndex: 'alertMessage',
      key: 'alertMessage',
      render: (msg) => <span className="text-sm text-gray-600 line-clamp-2">{msg as string}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: (status) => {
        const statusObj = ALERT_STATUS.find((s) => s.value === status)
        return <Tag color={getAlertStatusColor(status as string)}>{statusObj?.label || (status as string)}</Tag>
      },
    },
    {
      title: '通知状态',
      dataIndex: 'notifyStatus',
      key: 'notifyStatus',
      width: '100px',
      render: (status) => {
        const statusObj = NOTIFY_STATUS.find((s) => s.value === status)
        return <Tag color={getNotifyStatusColor(status as string)}>{statusObj?.label || (status as string)}</Tag>
      },
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: '100px',
      render: (handler) => <span className="text-sm text-gray-600">{(handler as string) || '-'}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '180px',
      render: (time) => <span className="text-sm text-gray-600">{time as string}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<EyeIcon className="w-4 h-4" />}
            onClick={() => viewDetail(record)}
          />
          {record.status === 'PENDING' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={<CheckIcon className="w-4 h-4" />}
                onClick={() => handleClaim(record)}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={<XMarkIcon className="w-4 h-4" />}
                onClick={() => openIgnoreModal(record)}
              />
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">告警实例管理</h2>
        </CardHeader>
        <CardBody>
          <Form form={searchForm} onSubmit={handleSearch}>
            <div className="mb-6 grid grid-cols-4 gap-4">
              <FormField name="status" label="状态">
                {({ field }) => (
                  <Select {...field} placeholder="请选择状态" options={ALERT_STATUS} allowClear />
                )}
              </FormField>

              <FormField name="alertLevel" label="告警级别">
                {({ field }) => (
                  <Select {...field} placeholder="请选择告警级别" options={ALERT_LEVELS} allowClear />
                )}
              </FormField>

              <FormField name="timeRange" label="时间范围">
                {({ field }) => <RangePicker {...field} placeholder={['开始时间', '结束时间']} showTime />}
              </FormField>

              <div className="flex items-end gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  icon={<MagnifyingGlassIcon className="w-4 h-4" />}
                >
                  查询
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  重置
                </Button>
              </div>
            </div>
          </Form>

          <Table
            columns={columns}
            dataSource={records}
            rowKey="id"
            loading={loading}
            size="small"
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => loadRecords(page, pageSize)}
              showSizeChanger
              showTotal
            />
          </div>
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <Modal
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        title="告警详情"
        width={800}
      >
        {currentRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">告警ID</div>
                <div className="text-sm font-medium">{currentRecord.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">规则名称</div>
                <div className="text-sm font-medium">{currentRecord.ruleName}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">规则类型</div>
                <div className="text-sm font-medium">{currentRecord.ruleType}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">目标类型</div>
                <div className="text-sm font-medium">{currentRecord.targetType}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">目标名称</div>
                <div className="text-sm font-medium">{currentRecord.targetName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">告警级别</div>
                <div>
                  <Tag color={getAlertLevelColor(currentRecord.alertLevel)}>
                    {ALERT_LEVELS.find((l) => l.value === currentRecord.alertLevel)?.label}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-500">告警消息</div>
              <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">{currentRecord.alertMessage}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">状态</div>
                <div>
                  <Tag color={getAlertStatusColor(currentRecord.status)}>
                    {ALERT_STATUS.find((s) => s.value === currentRecord.status)?.label}
                  </Tag>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">通知状态</div>
                <div>
                  <Tag color={getNotifyStatusColor(currentRecord.notifyStatus)}>
                    {NOTIFY_STATUS.find((s) => s.value === currentRecord.notifyStatus)?.label}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">通知时间</div>
                <div className="text-sm font-medium">{currentRecord.notifyTime || '-'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">恢复时间</div>
                <div className="text-sm font-medium">{currentRecord.recoverTime || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">持续时长</div>
                <div className="text-sm font-medium">{currentRecord.duration ? `${currentRecord.duration}分钟` : '-'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">处理人</div>
                <div className="text-sm font-medium">{currentRecord.handler || '-'}</div>
              </div>
            </div>

            {currentRecord.remark && (
              <div className="space-y-1">
                <div className="text-sm text-gray-500">备注</div>
                <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">{currentRecord.remark}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">创建时间</div>
                <div className="text-sm font-medium">{currentRecord.createTime}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">更新时间</div>
                <div className="text-sm font-medium">{currentRecord.updateTime}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        </div>
      </Modal>

      {/* Ignore Modal */}
      <Modal
        title="忽略告警"
        open={handleVisible}
        onClose={() => setHandleVisible(false)}
        width={500}
      >
        <Form form={ignoreForm} onSubmit={handleIgnore}>
          <FormField
            name="remark"
            label="忽略原因"
            rules={{ required: '请输入忽略原因' }}
          >
            {({ field }) => <TextArea {...field} rows={4} placeholder="请输入忽略原因" />}
          </FormField>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setHandleVisible(false)}>
              取消
            </Button>
            <Button type="submit" variant="primary">
              确定
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        title="创建任务"
        open={createTaskVisible}
        onClose={() => setCreateTaskVisible(false)}
        width={500}
      >
        <Form form={taskForm} onSubmit={handleCreateTask}>
          <div className="space-y-4">
            <FormField name="siteName" label="站点">
              {() => <Input value={currentRecord?.targetName} disabled />}
            </FormField>

            <FormField
              name="taskTemplateId"
              label="任务模版"
              rules={{ required: '请选择任务模版' }}
            >
              {({ field }) => (
                <Select {...field} placeholder="请选择任务模版" options={taskTemplateOptions} />
              )}
            </FormField>

            <FormField
              name="departmentId"
              label="部门ID"
              rules={{ required: '请输入部门ID' }}
            >
              {({ field }) => <Input {...field} type="number" placeholder="请输入部门ID" />}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateTaskVisible(false)}>
              取消
            </Button>
            <Button type="submit" variant="primary">
              创建并认领
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default AlertRecords
