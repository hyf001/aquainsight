import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Select,
  message,
  Tag,
  DatePicker,
  Row,
  Col,
  Form,
  Descriptions,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getNotifyLogs } from '@/services/alert'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

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

const NOTIFY_TYPES = [
  { label: '短信', value: 'SMS', color: 'blue' },
  { label: '邮件', value: 'EMAIL', color: 'green' },
  { label: '微信', value: 'WECHAT', color: 'cyan' },
  { label: '钉钉', value: 'DINGTALK', color: 'orange' },
]

const NOTIFY_STATUS = [
  { label: '待发送', value: 'PENDING', color: 'default' },
  { label: '发送成功', value: 'SUCCESS', color: 'success' },
  { label: '发送失败', value: 'FAILED', color: 'error' },
]

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
  const [searchForm] = Form.useForm()

  // Load notify logs
  const loadLogs = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getNotifyLogs(pageNum, pageSize, filters)
      setLogs(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载通知日志失败:', error)
      message.error('加载通知日志失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs(1, 10)
  }, [filters])

  // Handle search
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const timeRange = values.timeRange
    setFilters({
      notifyStatus: values.notifyStatus,
      notifyType: values.notifyType,
      startTime: timeRange ? dayjs(timeRange[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
      endTime: timeRange ? dayjs(timeRange[1]).format('YYYY-MM-DD HH:mm:ss') : undefined,
    })
  }

  // Reset search
  const handleReset = () => {
    searchForm.resetFields()
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

  const columns: ColumnsType<NotifyLog> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '告警ID',
      dataIndex: 'alertRecordId',
      key: 'alertRecordId',
      width: 100,
    },
    {
      title: '通知方式',
      dataIndex: 'notifyType',
      key: 'notifyType',
      width: 100,
      render: (type: string) => {
        const typeObj = NOTIFY_TYPES.find(t => t.value === type)
        return <Tag color={typeObj?.color}>{typeObj?.label || type}</Tag>
      },
    },
    {
      title: '接收人',
      dataIndex: 'notifyUserName',
      key: 'notifyUserName',
      width: 120,
      render: (name: string, record: NotifyLog) => name || record.notifyTarget,
    },
    {
      title: '通知目标',
      dataIndex: 'notifyTarget',
      key: 'notifyTarget',
      width: 180,
    },
    {
      title: '通知内容',
      dataIndex: 'notifyContent',
      key: 'notifyContent',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'notifyStatus',
      key: 'notifyStatus',
      width: 100,
      render: (status: string) => {
        const statusObj = NOTIFY_STATUS.find(s => s.value === status)
        return <Tag color={statusObj?.color}>{statusObj?.label || status}</Tag>
      },
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 100,
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 180,
      render: (time: string) => time || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_: any, record: NotifyLog) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => viewDetail(record)}>
            详情
          </Button>
          {record.notifyStatus === 'FAILED' && record.retryCount < 3 && (
            <Button type="link" icon={<ReloadOutlined />}>
              重试
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card title="消息通知管理">
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item name="notifyStatus" label="状态">
              <Select placeholder="请选择状态" allowClear options={NOTIFY_STATUS} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="notifyType" label="通知方式">
              <Select placeholder="请选择通知方式" allowClear options={NOTIFY_TYPES} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="timeRange" label="时间范围">
              <RangePicker showTime />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => loadLogs(page, pageSize),
        }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="通知详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {currentLog && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="通知ID">{currentLog.id}</Descriptions.Item>
            <Descriptions.Item label="告警ID">{currentLog.alertRecordId}</Descriptions.Item>
            <Descriptions.Item label="通知方式">
              <Tag color={NOTIFY_TYPES.find(t => t.value === currentLog.notifyType)?.color}>
                {NOTIFY_TYPES.find(t => t.value === currentLog.notifyType)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="通知目标">{currentLog.notifyTarget}</Descriptions.Item>
            <Descriptions.Item label="接收人ID">{currentLog.notifyUserId || '-'}</Descriptions.Item>
            <Descriptions.Item label="接收人姓名">{currentLog.notifyUserName || '-'}</Descriptions.Item>
            <Descriptions.Item label="通知内容" span={2}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{currentLog.notifyContent}</div>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={NOTIFY_STATUS.find(s => s.value === currentLog.notifyStatus)?.color}>
                {NOTIFY_STATUS.find(s => s.value === currentLog.notifyStatus)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="重试次数">{currentLog.retryCount}</Descriptions.Item>
            <Descriptions.Item label="发送时间">{currentLog.sendTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentLog.createTime}</Descriptions.Item>
            {currentLog.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <div style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{currentLog.errorMessage}</div>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </Card>
  )
}

export default AlertNotifications
