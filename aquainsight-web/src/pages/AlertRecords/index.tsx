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
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getAlertRecords, claimAlert, ignoreAlert, type AlertRecord } from '@/services/alert'
import { createManualJobInstance, getTaskTemplateList, type TaskTemplate } from '@/services/maintenance'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

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
  const [form] = Form.useForm()
  const [taskForm] = Form.useForm()
  const [searchForm] = Form.useForm()

  // Load alert records
  const loadRecords = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const pageResult = await getAlertRecords(pageNum, pageSize, filters)
      setRecords(pageResult.list)
      setPagination({ current: pageResult.pageNum, pageSize: pageResult.pageSize, total: pageResult.total })
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

  // 认领告警
  const handleClaim = async (record: AlertRecord) => {
    // 如果是站点告警，弹窗创建任务
    if (record.targetType === 'site') {
      setCurrentRecord(record)
      setCreateTaskVisible(true)
      taskForm.resetFields()
      // 加载任务模版列表
      loadTaskTemplates()
    } else {
      // 任务告警直接认领
      try {
        await claimAlert(record.id)
        message.success('已认领告警')
        loadRecords(pagination.current, pagination.pageSize)
      } catch (error) {
        console.error('认领告警失败:', error)
        message.error('操作失败')
      }
    }
  }

  // 加载任务模版列表
  const loadTaskTemplates = async () => {
    try {
      const taskTemplateList = await getTaskTemplateList()
      setTaskTemplates(taskTemplateList)
    } catch (error) {
      console.error('加载任务模版列表失败:', error)
      message.error('加载任务模版列表失败')
    }
  }

  // 创建任务
  const handleCreateTask = async () => {
    try {
      const values = await taskForm.validateFields()
      // 创建手动任务
      await createManualJobInstance({
        siteId: currentRecord!.targetId,
        taskTemplateId: values.taskTemplateId,
        departmentId: values.departmentId,
      })
      // 认领告警
      await claimAlert(currentRecord!.id)
      message.success('任务创建成功，告警已认领')
      setCreateTaskVisible(false)
      loadRecords(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('创建任务失败:', error)
      message.error('操作失败')
    }
  }

  // 打开忽略弹窗
  const openIgnoreModal = (record: AlertRecord) => {
    setCurrentRecord(record)
    setHandleVisible(true)
    form.resetFields()
  }

  // 忽略告警
  const handleIgnore = async () => {
    try {
      const values = await form.validateFields()
      await ignoreAlert(currentRecord!.id, values.remark)
      message.success('已忽略')
      setHandleVisible(false)
      loadRecords(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('忽略告警失败:', error)
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
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 100,
      render: (handler: string) => handler || '-',
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
      width: 150,
      fixed: 'right',
      render: (_: any, record: AlertRecord) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => viewDetail(record)} />
          {record.status === 'PENDING' && (
            <>
              <Button type="link" icon={<CheckOutlined />} onClick={() => handleClaim(record)} />
              <Button type="link" icon={<CloseOutlined />} onClick={() => openIgnoreModal(record)} />
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card title="告警实例管理">
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ width: '100%' }} align="middle">
          <Col span={5}>
            <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
              <Select placeholder="请选择状态" allowClear options={ALERT_STATUS} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="alertLevel" label="告警级别" style={{ marginBottom: 0 }}>
              <Select placeholder="请选择告警级别" allowClear options={ALERT_LEVELS} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item name="timeRange" label="时间范围" style={{ marginBottom: 0 }}>
              <RangePicker showTime style={{ width: '100%' }} />
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
            <Descriptions.Item label="处理人">{currentRecord.handler || '-'}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{currentRecord.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{currentRecord.updateTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 忽略弹窗 */}
      <Modal
        title="忽略告警"
        open={handleVisible}
        onOk={handleIgnore}
        onCancel={() => setHandleVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="忽略原因"
            name="remark"
            rules={[{ required: true, message: '请输入忽略原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入忽略原因" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建任务弹窗 */}
      <Modal
        title="创建任务"
        open={createTaskVisible}
        onOk={handleCreateTask}
        onCancel={() => setCreateTaskVisible(false)}
        okText="创建并认领"
        cancelText="取消"
      >
        <Form form={taskForm} layout="vertical">
          <Form.Item label="站点">
            <Input value={currentRecord?.targetName} disabled />
          </Form.Item>
          <Form.Item
            label="任务模版"
            name="taskTemplateId"
            rules={[{ required: true, message: '请选择任务模版' }]}
          >
            <Select placeholder="请选择任务模版">
              {taskTemplates.map((taskTemplate) => (
                <Select.Option key={taskTemplate.id} value={taskTemplate.id}>
                  {taskTemplate.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="部门ID"
            name="departmentId"
            rules={[{ required: true, message: '请输入部门ID' }]}
          >
            <Input type="number" placeholder="请输入部门ID" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default AlertRecords
