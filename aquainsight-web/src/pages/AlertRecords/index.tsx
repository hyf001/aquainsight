import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  DatePicker,
  Row,
  Col,
  Descriptions,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getAlertRecords, startProcessAlert, resolveAlert, ignoreAlert } from '@/services/alert'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface AlertRecord {
  id: number
  ruleName: string
  ruleType: string
  targetType: string
  targetName: string
  alertLevel: string
  alertMessage: string
  status: string
  notifyStatus: string
  notifyTime?: string
  recoverTime?: string
  duration?: number
  remark?: string
  createTime: string
  updateTime: string
}

const ALERT_STATUS = [
  { label: '待处理', value: 'PENDING', color: 'red' },
  { label: '处理中', value: 'IN_PROGRESS', color: 'orange' },
  { label: '已解决', value: 'RESOLVED', color: 'green' },
  { label: '已忽略', value: 'IGNORED', color: 'gray' },
  { label: '已恢复', value: 'RECOVERED', color: 'blue' },
]

const ALERT_LEVELS = [
  { label: '紧急', value: 'URGENT', color: 'red' },
  { label: '重要', value: 'IMPORTANT', color: 'orange' },
  { label: '一般', value: 'NORMAL', color: 'blue' },
  { label: '提示', value: 'INFO', color: 'green' },
]

const NOTIFY_STATUS = [
  { label: '待通知', value: 'PENDING', color: 'default' },
  { label: '通知成功', value: 'SUCCESS', color: 'success' },
  { label: '通知失败', value: 'FAILED', color: 'error' },
]

const AlertRecords: React.FC = () => {
  const [records, setRecords] = useState<AlertRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [handleVisible, setHandleVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<AlertRecord | null>(null)
  const [handleType, setHandleType] = useState<'resolve' | 'ignore'>('resolve')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    alertLevel: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
  })
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  // Load alert records
  const loadRecords = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getAlertRecords(pageNum, pageSize, filters)
      setRecords(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载告警记录失败:', error)
      message.error('加载告警记录失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords(1, 10)
  }, [filters])

  // Handle search
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    const timeRange = values.timeRange
    setFilters({
      status: values.status,
      alertLevel: values.alertLevel,
      startTime: timeRange ? dayjs(timeRange[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
      endTime: timeRange ? dayjs(timeRange[1]).format('YYYY-MM-DD HH:mm:ss') : undefined,
    })
  }

  // Reset search
  const handleReset = () => {
    searchForm.resetFields()
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

  // Start processing
  const handleStartProcess = async (record: AlertRecord) => {
    try {
      await startProcessAlert(record.id)
      message.success('已开始处理')
      loadRecords(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('开始处理失败:', error)
      message.error('操作失败')
    }
  }

  // Open handle modal
  const openHandleModal = (record: AlertRecord, type: 'resolve' | 'ignore') => {
    setCurrentRecord(record)
    setHandleType(type)
    setHandleVisible(true)
    form.resetFields()
  }

  // Handle alert
  const handleAlert = async () => {
    try {
      const values = await form.validateFields()
      if (handleType === 'resolve') {
        await resolveAlert(currentRecord!.id, values.remark)
        message.success('已解决')
      } else {
        await ignoreAlert(currentRecord!.id, values.remark)
        message.success('已忽略')
      }
      setHandleVisible(false)
      loadRecords(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('处理告警失败:', error)
      message.error('操作失败')
    }
  }

  const columns: ColumnsType<AlertRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 150,
    },
    {
      title: '目标对象',
      dataIndex: 'targetName',
      key: 'targetName',
      width: 150,
    },
    {
      title: '告警级别',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      width: 100,
      render: (level: string) => {
        const levelObj = ALERT_LEVELS.find(l => l.value === level)
        return <Tag color={levelObj?.color}>{levelObj?.label || level}</Tag>
      },
    },
    {
      title: '告警消息',
      dataIndex: 'alertMessage',
      key: 'alertMessage',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusObj = ALERT_STATUS.find(s => s.value === status)
        return <Tag color={statusObj?.color}>{statusObj?.label || status}</Tag>
      },
    },
    {
      title: '通知状态',
      dataIndex: 'notifyStatus',
      key: 'notifyStatus',
      width: 100,
      render: (status: string) => {
        const statusObj = NOTIFY_STATUS.find(s => s.value === status)
        return <Tag color={statusObj?.color}>{statusObj?.label || status}</Tag>
      },
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
      width: 280,
      fixed: 'right',
      render: (_: any, record: AlertRecord) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => viewDetail(record)}>
            详情
          </Button>
          {record.status === 'PENDING' && (
            <Button type="link" icon={<ReloadOutlined />} onClick={() => handleStartProcess(record)}>
              处理
            </Button>
          )}
          {record.status === 'IN_PROGRESS' && (
            <>
              <Button type="link" icon={<CheckOutlined />} onClick={() => openHandleModal(record, 'resolve')}>
                解决
              </Button>
              <Button type="link" icon={<CloseOutlined />} onClick={() => openHandleModal(record, 'ignore')}>
                忽略
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card title="告警实例管理">
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" allowClear options={ALERT_STATUS} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="alertLevel" label="告警级别">
              <Select placeholder="请选择告警级别" allowClear options={ALERT_LEVELS} />
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
        dataSource={records}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => loadRecords(page, pageSize),
        }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="告警详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {currentRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="告警ID">{currentRecord.id}</Descriptions.Item>
            <Descriptions.Item label="规则名称">{currentRecord.ruleName}</Descriptions.Item>
            <Descriptions.Item label="规则类型">{currentRecord.ruleType}</Descriptions.Item>
            <Descriptions.Item label="目标类型">{currentRecord.targetType}</Descriptions.Item>
            <Descriptions.Item label="目标名称">{currentRecord.targetName}</Descriptions.Item>
            <Descriptions.Item label="告警级别">
              <Tag color={ALERT_LEVELS.find(l => l.value === currentRecord.alertLevel)?.color}>
                {ALERT_LEVELS.find(l => l.value === currentRecord.alertLevel)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="告警消息" span={2}>{currentRecord.alertMessage}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={ALERT_STATUS.find(s => s.value === currentRecord.status)?.color}>
                {ALERT_STATUS.find(s => s.value === currentRecord.status)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="通知状态">
              <Tag color={NOTIFY_STATUS.find(s => s.value === currentRecord.notifyStatus)?.color}>
                {NOTIFY_STATUS.find(s => s.value === currentRecord.notifyStatus)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="通知时间">{currentRecord.notifyTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="恢复时间">{currentRecord.recoverTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="持续时长">{currentRecord.duration ? `${currentRecord.duration}分钟` : '-'}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{currentRecord.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{currentRecord.updateTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 处理弹窗 */}
      <Modal
        title={handleType === 'resolve' ? '解决告警' : '忽略告警'}
        open={handleVisible}
        onOk={handleAlert}
        onCancel={() => setHandleVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="处理备注"
            name="remark"
            rules={[{ required: true, message: '请输入处理备注' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入处理备注" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default AlertRecords
