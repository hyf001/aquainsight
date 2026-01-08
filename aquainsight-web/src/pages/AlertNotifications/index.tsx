import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  type TableColumn,
  Modal,
  Select,
  type SelectOption,
  Tag,
  RangePicker,
  Form,
  FormField,
  Pagination,
} from '@/components/ui'
import { getNotifyLogs } from '@/services/alert'
import { toast } from '@/utils/toast'
import { format } from 'date-fns'

interface NotifyLog {
  id: number
  alertRecordId: number
  notifyType: string
  notifyTarget: string
  notifyUserId?: number
  notifyUserName?: string
  notifyContent: string
  notifyStatus: string
  sendTime?: string
  errorMessage?: string
  retryCount: number
  createTime: string
}

const NOTIFY_TYPES: SelectOption[] = [
  { label: '短信', value: 'SMS' },
  { label: '邮件', value: 'EMAIL' },
  { label: '微信', value: 'WECHAT' },
  { label: '钉钉', value: 'DINGTALK' },
]

const NOTIFY_STATUS: SelectOption[] = [
  { label: '待发送', value: 'PENDING' },
  { label: '发送成功', value: 'SUCCESS' },
  { label: '发送失败', value: 'FAILED' },
]

const getNotifyTypeColor = (type: string) => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'error'> = {
    SMS: 'primary',
    EMAIL: 'success',
    WECHAT: 'success',
    DINGTALK: 'warning',
  }
  return map[type] || 'primary'
}

const getNotifyStatusColor = (status: string) => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'error'> = {
    PENDING: 'warning',
    SUCCESS: 'success',
    FAILED: 'error',
  }
  return map[status] || 'primary'
}

const AlertNotifications: React.FC = () => {
  const [logs, setLogs] = useState<NotifyLog[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentLog, setCurrentLog] = useState<NotifyLog | null>(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    notifyStatus: undefined as string | undefined,
    notifyType: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
  })

  const searchForm = useForm()

  // Load notify logs
  const loadLogs = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getNotifyLogs(pageNum, pageSize, filters)
      setLogs(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载通知日志失败:', error)
      toast.error('加载通知日志失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs(1, 10)
  }, [filters])

  // Handle search
  const handleSearch = () => {
    const values = searchForm.getValues()
    const timeRange = values.timeRange
    setFilters({
      notifyStatus: values.notifyStatus,
      notifyType: values.notifyType,
      startTime: timeRange?.[0] ? format(timeRange[0], 'yyyy-MM-dd HH:mm:ss') : undefined,
      endTime: timeRange?.[1] ? format(timeRange[1], 'yyyy-MM-dd HH:mm:ss') : undefined,
    })
  }

  // Reset search
  const handleReset = () => {
    searchForm.reset({
      notifyStatus: undefined,
      notifyType: undefined,
      timeRange: undefined,
    })
    setFilters({
      notifyStatus: undefined,
      notifyType: undefined,
      startTime: undefined,
      endTime: undefined,
    })
  }

  // View detail
  const viewDetail = (log: NotifyLog) => {
    setCurrentLog(log)
    setDetailVisible(true)
  }

  const columns: TableColumn<NotifyLog>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '80px',
      render: (id) => <span className="font-mono text-sm">{id as number}</span>,
    },
    {
      title: '告警ID',
      dataIndex: 'alertRecordId',
      key: 'alertRecordId',
      width: '100px',
      render: (id) => <span className="font-mono text-sm">{id as number}</span>,
    },
    {
      title: '通知方式',
      dataIndex: 'notifyType',
      key: 'notifyType',
      width: '100px',
      render: (type) => {
        const typeObj = NOTIFY_TYPES.find((t) => t.value === type)
        return <Tag color={getNotifyTypeColor(type as string)}>{typeObj?.label || (type as string)}</Tag>
      },
    },
    {
      title: '接收人',
      dataIndex: 'notifyUserName',
      key: 'notifyUserName',
      width: '120px',
      render: (name, record) => (
        <span className="text-sm text-gray-600">
          {(name as string) || record.notifyTarget}
        </span>
      ),
    },
    {
      title: '通知目标',
      dataIndex: 'notifyTarget',
      key: 'notifyTarget',
      width: '180px',
      render: (target) => <span className="text-sm text-gray-600">{target as string}</span>,
    },
    {
      title: '通知内容',
      dataIndex: 'notifyContent',
      key: 'notifyContent',
      render: (content) => (
        <span className="text-sm text-gray-600 line-clamp-2">{content as string}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'notifyStatus',
      key: 'notifyStatus',
      width: '100px',
      render: (status) => {
        const statusObj = NOTIFY_STATUS.find((s) => s.value === status)
        return (
          <Tag color={getNotifyStatusColor(status as string)}>
            {statusObj?.label || (status as string)}
          </Tag>
        )
      },
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: '100px',
      render: (count) => <span className="text-sm text-gray-600">{count as number}</span>,
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: '180px',
      render: (time) => (
        <span className="text-sm text-gray-600">{time ? (time as string) : '-'}</span>
      ),
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
          >
            详情
          </Button>
          {record.notifyStatus === 'FAILED' && record.retryCount < 3 && (
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowPathIcon className="w-4 h-4" />}
              onClick={() => toast.info('重试功能开发中')}
            >
              重试
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">消息通知管理</h2>
        </CardHeader>
        <CardBody>
          <Form form={searchForm} onSubmit={handleSearch}>
            <div className="mb-6 grid grid-cols-4 gap-4">
              <FormField name="notifyStatus" label="状态">
                {({ field }) => (
                  <Select {...field} placeholder="请选择状态" options={NOTIFY_STATUS} />
                )}
              </FormField>

              <FormField name="notifyType" label="通知方式">
                {({ field }) => (
                  <Select {...field} placeholder="请选择通知方式" options={NOTIFY_TYPES} />
                )}
              </FormField>

              <FormField name="timeRange" label="时间范围">
                {({ field }) => <RangePicker {...field} placeholder={['开始时间', '结束时间']} />}
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
            dataSource={logs}
            rowKey="id"
            loading={loading}
            size="small"
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => loadLogs(page, pageSize)}
              showSizeChanger
              showTotal
            />
          </div>
        </CardBody>
      </Card>

      {/* 详情弹窗 */}
      <Modal
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        title="通知详情"
        width={800}
      >
        {currentLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">通知ID</div>
                <div className="text-sm font-medium">{currentLog.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">告警ID</div>
                <div className="text-sm font-medium">{currentLog.alertRecordId}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">通知方式</div>
                <div>
                  <Tag color={getNotifyTypeColor(currentLog.notifyType)}>
                    {NOTIFY_TYPES.find((t) => t.value === currentLog.notifyType)?.label}
                  </Tag>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">通知目标</div>
                <div className="text-sm font-medium">{currentLog.notifyTarget}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">接收人ID</div>
                <div className="text-sm font-medium">{currentLog.notifyUserId || '-'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">接收人姓名</div>
                <div className="text-sm font-medium">{currentLog.notifyUserName || '-'}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-500">通知内容</div>
              <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                {currentLog.notifyContent}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">状态</div>
                <div>
                  <Tag color={getNotifyStatusColor(currentLog.notifyStatus)}>
                    {NOTIFY_STATUS.find((s) => s.value === currentLog.notifyStatus)?.label}
                  </Tag>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">重试次数</div>
                <div className="text-sm font-medium">{currentLog.retryCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">发送时间</div>
                <div className="text-sm font-medium">{currentLog.sendTime || '-'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">创建时间</div>
                <div className="text-sm font-medium">{currentLog.createTime}</div>
              </div>
            </div>

            {currentLog.errorMessage && (
              <div className="space-y-1">
                <div className="text-sm text-gray-500">错误信息</div>
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg whitespace-pre-wrap">
                  {currentLog.errorMessage}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default AlertNotifications
