import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline'
import { Button, Table, Modal, Form, FormField, Input, Select, Tag, Switch, Popconfirm, Card, CardHeader, CardBody } from '@/components/ui'
import type { TableColumn } from '@/components/ui'
import { getAlertRules, createAlertRule, updateAlertRule, deleteAlertRule, enableAlertRule, disableAlertRule, getMetrics } from '@/services/alert'
import { getTaskTemplateList } from '@/services/maintenance'
import { getAllDepartments, getAllEmployees } from '@/services/organization'
import { toast } from '@/utils/toast'

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
  taskTemplateId?: number
  notifyTypes?: string
  notifyUsers?: string
  notifyDepartments?: string
}

const TARGET_TYPES = [
  { label: '站点', value: 'site' },
  { label: '设备', value: 'device' },
  { label: '任务', value: 'task' },
]

const ALERT_LEVELS = [
  { label: '紧急', value: 1 },
  { label: '重要', value: 2 },
  { label: '一般', value: 3 },
  { label: '提示', value: 4 },
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

// Map alert level to color
const getLevelColor = (level: number): string => {
  switch (level) {
    case 1: return 'red'
    case 2: return 'orange'
    case 3: return 'blue'
    case 4: return 'green'
    default: return 'gray'
  }
}

const getLevelLabel = (level: number): string => {
  const levelObj = ALERT_LEVELS.find(l => l.value === level)
  return levelObj?.label || String(level)
}

const AlertRules: React.FC = () => {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [taskTemplates, setTaskTemplates] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [metricsMap, setMetricsMap] = useState<Record<string, string[]>>({})
  const [conditionConfigs, setConditionConfigs] = useState<RuleCondition[]>([])
  const [selectedAlertTargetType, setSelectedAlertTargetType] = useState<string>('')

  const form = useForm()

  // Load alert rules
  const loadRules = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getAlertRules(pageNum, pageSize)
      setRules(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total })
    } catch (error) {
      console.error('加载告警规则失败:', error)
      toast.error('加载告警规则失败')
    } finally {
      setLoading(false)
    }
  }

  // Load taskTemplates, departments, users, and metrics
  const loadOptions = async () => {
    try {
      const [taskTemplatesData, departmentsData, usersData] = await Promise.all([
        getTaskTemplateList(),
        getAllDepartments(),
        getAllEmployees(),
      ])
      setTaskTemplates(taskTemplatesData.map((s: any) => ({ label: s.name, value: s.id })))
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
      form.reset({
        ruleName: rule.ruleName,
        alertTargetType: rule.alertTargetType,
        alertLevel: rule.alertLevel,
        alertMessage: rule.alertMessage,
        quietPeriod: rule.quietPeriod,
        description: rule.description,
        taskTemplateId: rule.taskTemplateId,
        notifyTypes: rule.notifyTypes?.split(',').filter(Boolean) || [],
        notifyUsers: rule.notifyUsers?.split(',').map(Number).filter(Boolean) || [],
        notifyDepartments: rule.notifyDepartments?.split(',').map(Number).filter(Boolean) || [],
      })
      setConditionConfigs(rule.conditionConfigs || [])
      setSelectedAlertTargetType(rule.alertTargetType)
    } else {
      form.reset({
        quietPeriod: 60,
      })
      setConditionConfigs([])
      setSelectedAlertTargetType('')
    }
    setModalVisible(true)
  }

  // Save rule
  const handleSaveRule = async (values: any) => {
    try {
      // 验证触发条件必填
      if (!conditionConfigs || conditionConfigs.length === 0) {
        toast.error('请至少添加一个触发条件')
        return
      }

      const data = {
        ...values,
        notifyTypes: values.notifyTypes?.join(',') || '',
        notifyUsers: values.notifyUsers?.join(',') || '',
        notifyDepartments: values.notifyDepartments?.join(',') || '',
        conditionConfigs: conditionConfigs || [],
      }

      if (editingRule) {
        await updateAlertRule(editingRule.id, data)
        toast.success('更新成功')
      } else {
        await createAlertRule(data)
        toast.success('创建成功')
      }
      setModalVisible(false)
      loadRules(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存告警规则失败:', error)
      toast.error('保存失败')
    }
  }

  // Delete rule
  const handleDeleteRule = async (id: number) => {
    try {
      await deleteAlertRule(id)
      toast.success('删除成功')
      loadRules(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除告警规则失败:', error)
      toast.error('删除失败')
    }
  }

  // Toggle rule status
  const handleToggleStatus = async (rule: AlertRule) => {
    try {
      if (rule.enabled) {
        await disableAlertRule(rule.id)
        toast.success('已禁用')
      } else {
        await enableAlertRule(rule.id)
        toast.success('已启用')
      }
      loadRules(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('切换规则状态失败:', error)
      toast.error('操作失败')
    }
  }

  // Add condition
  const addCondition = () => {
    setConditionConfigs([...conditionConfigs, { metric: '', operator: 'GT' }])
  }

  // Remove condition
  const removeCondition = (index: number) => {
    setConditionConfigs(conditionConfigs.filter((_, i) => i !== index))
  }

  // Update condition
  const updateCondition = (index: number, field: keyof RuleCondition, value: any) => {
    const newConditions = [...conditionConfigs]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setConditionConfigs(newConditions)
  }

  const columns: TableColumn<AlertRule>[] = [
    {
      title: '操作',
      key: 'action',
      width: '100px',
      render: (_: any, record: AlertRule) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openModal(record)}
            className="p-1 h-auto"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => handleDeleteRule(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-red-500 hover:text-red-700"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '80px',
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: '150px',
    },
    {
      title: '告警对象类型',
      dataIndex: 'alertTargetType',
      key: 'alertTargetType',
      width: '130px',
      render: (type: string) => {
        const typeObj = TARGET_TYPES.find(t => t.value === type)
        return typeObj?.label || type
      },
    },
    {
      title: '告警级别',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      width: '100px',
      render: (level: number) => (
        <Tag color={getLevelColor(level)}>{getLevelLabel(level)}</Tag>
      ),
    },
    {
      title: '触发条件',
      dataIndex: 'conditionConfigs',
      key: 'conditionConfigs',
      width: '300px',
      render: (conditions: RuleCondition[]) => {
        if (!conditions || conditions.length === 0) return '-'
        return (
          <div className="max-w-full truncate" title={conditions.map((c) => {
            const operatorObj = COMPARISON_OPERATORS.find(op => op.value === c.operator)
            const operatorLabel = operatorObj?.label || c.operator
            if (c.operator === 'BETWEEN' || c.operator === 'NOT_BETWEEN') {
              return `${c.metric} ${operatorLabel} ${c.minThreshold}~${c.maxThreshold}`
            }
            return `${c.metric} ${operatorLabel} ${c.threshold}`
          }).join('; ')}>
            {conditions.map((c, idx) => {
              const operatorObj = COMPARISON_OPERATORS.find(op => op.value === c.operator)
              const operatorLabel = operatorObj?.label || c.operator
              if (c.operator === 'BETWEEN' || c.operator === 'NOT_BETWEEN') {
                return `${c.metric} ${operatorLabel} ${c.minThreshold}~${c.maxThreshold}`
              }
              return `${c.metric} ${operatorLabel} ${c.threshold}`
            }).join('; ')}
          </div>
        )
      },
    },
    {
      title: '静默期(分钟)',
      dataIndex: 'quietPeriod',
      key: 'quietPeriod',
      width: '120px',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: '100px',
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleStatus(record)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '180px',
    },
  ]

  return (
    <Card>
      <CardHeader
        title="告警规则管理"
        extra={
          <Button onClick={() => openModal()}>
            <PlusIcon className="w-4 h-4 mr-2" />
            新建规则
          </Button>
        }
      />
      <CardBody>
        <Table
          columns={columns}
          dataSource={rules}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => loadRules(page, pageSize),
          }}
        />
      </CardBody>

      <Modal
        title={editingRule ? '编辑告警规则' : '新建告警规则'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width="900px"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button onClick={() => form.handleSubmit(handleSaveRule)()}>
              保存
            </Button>
          </div>
        }
      >
        <Form form={form} onSubmit={handleSaveRule}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="规则名称"
              name="ruleName"
              required
              error={form.formState.errors.ruleName?.message}
            >
              <Input
                {...form.register('ruleName', { required: '请输入规则名称' })}
                placeholder="请输入规则名称"
              />
            </FormField>

            <FormField
              label="告警对象类型"
              name="alertTargetType"
              required
              error={form.formState.errors.alertTargetType?.message}
            >
              <Select
                {...form.register('alertTargetType', { required: '请选择告警对象类型' })}
                placeholder="请选择告警对象类型"
                options={TARGET_TYPES}
                onChange={(value) => setSelectedAlertTargetType(value as string)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="告警级别"
              name="alertLevel"
              required
              error={form.formState.errors.alertLevel?.message}
            >
              <Select
                {...form.register('alertLevel', { required: '请选择告警级别' })}
                placeholder="请选择告警级别"
                options={ALERT_LEVELS}
              />
            </FormField>

            <FormField
              label="静默期(分钟)"
              name="quietPeriod"
              required
              error={form.formState.errors.quietPeriod?.message}
            >
              <Input
                {...form.register('quietPeriod', { required: '请输入静默期' })}
                type="number"
                min={0}
                placeholder="请输入静默期"
              />
            </FormField>
          </div>

          <FormField
            label="关联任务模版"
            name="taskTemplateId"
          >
            <Select
              {...form.register('taskTemplateId')}
              placeholder="请选择关联任务模版(可选)"
              options={taskTemplates}
              allowClear
            />
          </FormField>

          <FormField
            label="告警消息"
            name="alertMessage"
            required
            error={form.formState.errors.alertMessage?.message}
          >
            <Input
              {...form.register('alertMessage', { required: '请输入告警消息' })}
              placeholder="请输入告警消息模板"
            />
          </FormField>

          <div className="border-t border-ocean-slate/20 my-4 pt-4">
            <h3 className="text-sm font-medium text-ocean-midnight mb-3">通知配置</h3>

            <FormField
              label="通知方式"
              name="notifyTypes"
              required
              error={form.formState.errors.notifyTypes?.message}
            >
              <Select
                {...form.register('notifyTypes', { required: '请选择通知方式' })}
                placeholder="请选择通知方式"
                options={NOTIFY_TYPES}
                mode="multiple"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="通知人员"
                name="notifyUsers"
              >
                <Select
                  {...form.register('notifyUsers')}
                  placeholder="请选择通知人员"
                  options={users}
                  mode="multiple"
                />
              </FormField>

              <FormField
                label="通知部门"
                name="notifyDepartments"
              >
                <Select
                  {...form.register('notifyDepartments')}
                  placeholder="请选择通知部门"
                  options={departments}
                  mode="multiple"
                />
              </FormField>
            </div>
          </div>

          <div className="border-t border-ocean-slate/20 my-4 pt-4">
            <h3 className="text-sm font-medium text-ocean-midnight mb-3">触发条件</h3>

            {conditionConfigs.map((condition, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <Select
                  value={condition.metric}
                  onChange={(value) => updateCondition(index, 'metric', value)}
                  placeholder={selectedAlertTargetType ? '选择指标' : '请先选择告警对象类型'}
                  options={selectedAlertTargetType && metricsMap[selectedAlertTargetType]
                    ? metricsMap[selectedAlertTargetType].map(m => ({ label: m, value: m }))
                    : []
                  }
                  disabled={!selectedAlertTargetType}
                  className="w-36"
                />
                <Select
                  value={condition.operator}
                  onChange={(value) => updateCondition(index, 'operator', value)}
                  placeholder="操作符"
                  options={COMPARISON_OPERATORS}
                  className="w-32"
                />
                {condition.operator === 'BETWEEN' || condition.operator === 'NOT_BETWEEN' ? (
                  <>
                    <Input
                      type="number"
                      value={condition.minThreshold}
                      onChange={(e) => updateCondition(index, 'minThreshold', Number(e.target.value))}
                      placeholder="最小值"
                      className="w-24"
                    />
                    <span>~</span>
                    <Input
                      type="number"
                      value={condition.maxThreshold}
                      onChange={(e) => updateCondition(index, 'maxThreshold', Number(e.target.value))}
                      placeholder="最大值"
                      className="w-24"
                    />
                  </>
                ) : (
                  <Input
                    type="number"
                    value={condition.threshold}
                    onChange={(e) => updateCondition(index, 'threshold', Number(e.target.value))}
                    placeholder="阈值"
                    className="w-28"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(index)}
                  className="p-1 h-auto text-red-500 hover:text-red-700"
                >
                  <MinusCircleIcon className="w-5 h-5" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addCondition}
              className="w-full"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              添加条件
            </Button>
          </div>

          <FormField label="描述" name="description">
            <Input
              {...form.register('description')}
              placeholder="请输入规则描述(可选)"
            />
          </FormField>
        </Form>
      </Modal>
    </Card>
  )
}

export default AlertRules
