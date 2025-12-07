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
  Popconfirm,
  Tag,
  Switch,
  InputNumber,
  Row,
  Col,
  Divider,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getAlertRules, createAlertRule, updateAlertRule, deleteAlertRule, enableAlertRule, disableAlertRule, getMetrics } from '@/services/alert'
import { getSchemeList } from '@/services/maintenance'
import { getAllDepartments, getAllEmployees } from '@/services/organization'

interface RuleCondition {
  metric: string
  operator: 'GT' | 'GTE' | 'LT' | 'LTE' | 'EQ' | 'NEQ' | 'BETWEEN' | 'NOT_BETWEEN'
  threshold?: number
  minThreshold?: number
  maxThreshold?: number
}

interface AlertRule {
  id: number
  ruleName: string
  alertTargetType: string
  conditionConfigs: RuleCondition[]
  alertLevel: number
  alertMessage: string
  enabled: boolean
  quietPeriod: number
  description?: string
  createTime: string
  updateTime: string
}

const TARGET_TYPES = [
  { label: '站点', value: 'site' },
  { label: '设备', value: 'device' },
  { label: '任务', value: 'task' },
]

const ALERT_LEVELS = [
  { label: '紧急', value: 1, color: 'red' },
  { label: '重要', value: 2, color: 'orange' },
  { label: '一般', value: 3, color: 'blue' },
  { label: '提示', value: 4, color: 'green' },
]

const NOTIFY_TYPES = [
  { label: '短信', value: 'SMS' },
  { label: '电话', value: 'PHONE' },
]

const COMPARISON_OPERATORS = [
  { label: '大于', value: 'GT' },
  { label: '大于等于', value: 'GTE' },
  { label: '小于', value: 'LT' },
  { label: '小于等于', value: 'LTE' },
  { label: '等于', value: 'EQ' },
  { label: '不等于', value: 'NEQ' },
  { label: '在范围内', value: 'BETWEEN' },
  { label: '不在范围内', value: 'NOT_BETWEEN' },
]

const AlertRules: React.FC = () => {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [schemes, setSchemes] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [metricsMap, setMetricsMap] = useState<Record<string, string[]>>({})
  const [form] = Form.useForm()

  // Load alert rules
  const loadRules = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getAlertRules(pageNum, pageSize)
      setRules(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载告警规则失败:', error)
      message.error('加载告警规则失败')
    } finally {
      setLoading(false)
    }
  }

  // Load schemes, departments, users, and metrics
  const loadOptions = async () => {
    try {
      const [schemesData, departmentsData, usersData] = await Promise.all([
        getSchemeList(),
        getAllDepartments(),
        getAllEmployees(),
      ])
      setSchemes(schemesData.map((s: any) => ({ label: s.name, value: s.id })))
      setDepartments(departmentsData.map((d: any) => ({ label: d.name, value: d.id })))
      setUsers(usersData.map((u: any) => ({ label: u.name, value: u.id })))

      // 预加载所有类型的指标
      const metricsMapData: Record<string, string[]> = {}
      for (const type of TARGET_TYPES) {
        const metrics: any = await getMetrics(type.value)
        metricsMapData[type.value] = metrics
      }
      setMetricsMap(metricsMapData)
    } catch (error) {
      console.error('加载选项数据失败:', error)
    }
  }

  useEffect(() => {
    loadRules(1, 10)
    loadOptions()
  }, [])

  // Open create/edit modal
  const openModal = (rule?: AlertRule) => {
    setEditingRule(rule || null)
    if (rule) {
      form.setFieldsValue({
        ruleName: rule.ruleName,
        alertTargetType: rule.alertTargetType,
        alertLevel: rule.alertLevel,
        alertMessage: rule.alertMessage,
        quietPeriod: rule.quietPeriod,
        description: rule.description,
        schemeId: (rule as any).schemeId,
        notifyTypes: (rule as any).notifyTypes?.split(',').filter(Boolean) || [],
        notifyUsers: (rule as any).notifyUsers?.split(',').map(Number).filter(Boolean) || [],
        notifyDepartments: (rule as any).notifyDepartments?.split(',').map(Number).filter(Boolean) || [],
        conditionConfigs: (rule as any).conditionConfigs || [],
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ conditionConfigs: [] })
    }
    setModalVisible(true)
  }

  // Save rule
  const handleSaveRule = async () => {
    try {
      const values = await form.validateFields()

      // 验证触发条件必填
      if (!values.conditionConfigs || values.conditionConfigs.length === 0) {
        message.error('请至少添加一个触发条件')
        return
      }

      const data = {
        ...values,
        notifyTypes: values.notifyTypes?.join(',') || '',
        notifyUsers: values.notifyUsers?.join(',') || '',
        notifyDepartments: values.notifyDepartments?.join(',') || '',
        conditionConfigs: values.conditionConfigs || [],
      }

      if (editingRule) {
        await updateAlertRule(editingRule.id, data)
        message.success('更新成功')
      } else {
        await createAlertRule(data)
        message.success('创建成功')
      }
      setModalVisible(false)
      loadRules(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存告警规则失败:', error)
      message.error('保存失败')
    }
  }

  // Delete rule
  const handleDeleteRule = async (id: number) => {
    try {
      await deleteAlertRule(id)
      message.success('删除成功')
      loadRules(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除告警规则失败:', error)
      message.error('删除失败')
    }
  }

  // Toggle rule status
  const handleToggleStatus = async (rule: AlertRule) => {
    try {
      if (rule.enabled) {
        await disableAlertRule(rule.id)
        message.success('已禁用')
      } else {
        await enableAlertRule(rule.id)
        message.success('已启用')
      }
      loadRules(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('切换规则状态失败:', error)
      message.error('操作失败')
    }
  }

  const columns: ColumnsType<AlertRule> = [
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'left',
      render: (_: any, record: AlertRule) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => handleDeleteRule(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
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
      title: '告警对象类型',
      dataIndex: 'alertTargetType',
      key: 'alertTargetType',
      width: 130,
      render: (type: string) => {
        const typeObj = TARGET_TYPES.find(t => t.value === type)
        return typeObj?.label || type
      },
    },
    {
      title: '告警级别',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      width: 100,
      render: (level: number) => {
        const levelObj = ALERT_LEVELS.find(l => l.value === level)
        return <Tag color={levelObj?.color}>{levelObj?.label || level}</Tag>
      },
    },
    {
      title: '触发条件',
      dataIndex: 'conditionConfigs',
      key: 'conditionConfigs',
      width: 300,
      ellipsis: true,
      render: (conditions: RuleCondition[]) => {
        if (!conditions || conditions.length === 0) return '-'
        return conditions.map((c) => {
          const operatorObj = COMPARISON_OPERATORS.find(op => op.value === c.operator)
          const operatorLabel = operatorObj?.label || c.operator
          if (c.operator === 'BETWEEN' || c.operator === 'NOT_BETWEEN') {
            return `${c.metric} ${operatorLabel} ${c.minThreshold}~${c.maxThreshold}`
          }
          return `${c.metric} ${operatorLabel} ${c.threshold}`
        }).join('; ')
      },
    },
    {
      title: '静默期(分钟)',
      dataIndex: 'quietPeriod',
      key: 'quietPeriod',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
  ]

  return (
    <Card
      title="告警规则管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          新建规则
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={rules}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => loadRules(page, pageSize),
        }}
      />

      <Modal
        title={editingRule ? '编辑告警规则' : '新建告警规则'}
        open={modalVisible}
        onOk={handleSaveRule}
        onCancel={() => setModalVisible(false)}
        width={900}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="规则名称"
                name="ruleName"
                rules={[{ required: true, message: '请输入规则名称' }]}
              >
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="告警对象类型"
                name="alertTargetType"
                rules={[{ required: true, message: '请选择告警对象类型' }]}
              >
                <Select placeholder="请选择告警对象类型" options={TARGET_TYPES} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="告警级别"
                name="alertLevel"
                rules={[{ required: true, message: '请选择告警级别' }]}
              >
                <Select placeholder="请选择告警级别" options={ALERT_LEVELS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="静默期(分钟)"
                name="quietPeriod"
                rules={[{ required: true, message: '请输入静默期' }]}
                initialValue={60}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入静默期" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="关联方案"
            name="schemeId"
          >
            <Select placeholder="请选择关联方案(可选)" options={schemes} allowClear />
          </Form.Item>

          <Form.Item
            label="告警消息"
            name="alertMessage"
            rules={[{ required: true, message: '请输入告警消息' }]}
          >
            <Input.TextArea rows={2} placeholder="请输入告警消息模板" />
          </Form.Item>

          <Divider>通知配置</Divider>

          <Form.Item
            label="通知方式"
            name="notifyTypes"
            rules={[{ required: true, message: '请选择通知方式' }]}
          >
            <Select mode="multiple" placeholder="请选择通知方式" options={NOTIFY_TYPES} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="通知人员"
                name="notifyUsers"
              >
                <Select mode="multiple" placeholder="请选择通知人员" options={users} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="通知部门"
                name="notifyDepartments"
              >
                <Select mode="multiple" placeholder="请选择通知部门" options={departments} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>触发条件</Divider>

          <Form.List name="conditionConfigs">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.alertTargetType !== currentValues.alertTargetType}>
                      {() => {
                        const alertTargetType = form.getFieldValue('alertTargetType')
                        // 根据选择的告警对象类型获取对应的指标
                        const availableMetrics = alertTargetType && metricsMap[alertTargetType]
                          ? metricsMap[alertTargetType]
                          : []

                        return (
                          <Form.Item
                            {...restField}
                            name={[name, 'metric']}
                            rules={[{ required: true, message: '请选择指标名称' }]}
                          >
                            <Select
                              placeholder={alertTargetType ? '选择指标' : '请先选择告警对象类型'}
                              style={{ width: 150 }}
                              options={availableMetrics.map(m => ({ label: m, value: m }))}
                              showSearch
                              disabled={!alertTargetType}
                            />
                          </Form.Item>
                        )
                      }}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'operator']}
                      rules={[{ required: true, message: '请选择操作符' }]}
                    >
                      <Select placeholder="操作符" options={COMPARISON_OPERATORS} style={{ width: 120 }} />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                      {() => {
                        const operator = form.getFieldValue(['conditionConfigs', name, 'operator'])
                        const isRange = operator === 'BETWEEN' || operator === 'NOT_BETWEEN'

                        if (isRange) {
                          return (
                            <>
                              <Form.Item
                                {...restField}
                                name={[name, 'minThreshold']}
                                rules={[{ required: true, message: '最小值' }]}
                              >
                                <InputNumber placeholder="最小值" style={{ width: 100 }} />
                              </Form.Item>
                              <span>~</span>
                              <Form.Item
                                {...restField}
                                name={[name, 'maxThreshold']}
                                rules={[{ required: true, message: '最大值' }]}
                              >
                                <InputNumber placeholder="最大值" style={{ width: 100 }} />
                              </Form.Item>
                            </>
                          )
                        }

                        return (
                          <Form.Item
                            {...restField}
                            name={[name, 'threshold']}
                            rules={[{ required: true, message: '阈值' }]}
                          >
                            <InputNumber placeholder="阈值" style={{ width: 120 }} />
                          </Form.Item>
                        )
                      }}
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加条件
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item label="描述" name="description">
            <Input.TextArea rows={2} placeholder="请输入规则描述(可选)" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default AlertRules
