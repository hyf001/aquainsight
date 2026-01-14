import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  AlertTriangle,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import {
  alertRuleApi,
  AlertRuleVO,
  AlertLevel,
  AlertTargetType,
  CreateAlertRuleRequest,
  UpdateAlertRuleRequest,
  RuleConditionConfig,
  NotifyType,
  MetricVO,
  alertLevelMap,
  alertTargetTypeMap,
  operatorMap,
  notifyTypeMap,
} from '@/services/alert'

export default function AlertRulesPage() {
  const [loading, setLoading] = useState(false)
  const [rules, setRules] = useState<AlertRuleVO[]>([])
  const [metrics, setMetrics] = useState<MetricVO[]>([])

  // 筛选条件
  const [targetTypeFilter, setTargetTypeFilter] = useState<AlertTargetType | ''>('')
  const [enabledFilter, setEnabledFilter] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页
  const [pageNum, setPageNum] = useState(1)
  const [pageSize] = useState(12)
  const [total, setTotal] = useState(0)

  // 弹窗状态
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<AlertRuleVO | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState<CreateAlertRuleRequest>({
    ruleName: '',
    alertTargetType: 'site',
    conditionConfigs: [],
    alertLevel: 'NORMAL',
    alertMessage: '',
    notifyTypes: [],
    quietPeriod: 60,
  })

  // 加载规则列表
  const loadRules = async () => {
    setLoading(true)
    try {
      const result = await alertRuleApi.getRules({
        pageNum,
        pageSize,
        alertTargetType: targetTypeFilter || undefined,
        enabled: enabledFilter ? enabledFilter === 'true' : undefined,
      })
      setRules(result.list || [])
      setTotal(result.total || 0)
    } catch (error) {
      console.error('加载告警规则失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载指标列表
  const loadMetrics = async (targetType?: AlertTargetType) => {
    try {
      const result = await alertRuleApi.getMetrics(targetType)
      setMetrics(result || [])
    } catch (error) {
      console.error('加载指标列表失败:', error)
    }
  }

  useEffect(() => {
    loadRules()
  }, [pageNum, targetTypeFilter, enabledFilter])

  useEffect(() => {
    loadMetrics(formData.alertTargetType)
  }, [formData.alertTargetType])

  // 打开新增弹窗
  const handleAdd = () => {
    setSelectedRule(null)
    setFormData({
      ruleName: '',
      alertTargetType: 'site',
      conditionConfigs: [],
      alertLevel: 'NORMAL',
      alertMessage: '',
      notifyTypes: [],
      quietPeriod: 60,
    })
    setFormModalOpen(true)
  }

  // 打开编辑弹窗
  const handleEdit = (rule: AlertRuleVO) => {
    setSelectedRule(rule)
    setFormData({
      ruleName: rule.ruleName,
      alertTargetType: rule.alertTargetType,
      conditionConfigs: rule.conditionConfigs || [],
      alertLevel: rule.alertLevel,
      alertMessage: rule.alertMessage,
      notifyTypes: rule.notifyTypes || [],
      quietPeriod: rule.quietPeriod || 60,
    })
    setFormModalOpen(true)
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formData.ruleName.trim()) {
      alert('请输入规则名称')
      return
    }
    if (!formData.alertMessage.trim()) {
      alert('请输入告警消息')
      return
    }

    setSubmitting(true)
    try {
      if (selectedRule) {
        await alertRuleApi.updateRule(selectedRule.id, formData as UpdateAlertRuleRequest)
      } else {
        await alertRuleApi.createRule(formData)
      }
      setFormModalOpen(false)
      loadRules()
    } catch (error) {
      console.error('保存告警规则失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // 删除规则
  const handleDelete = async () => {
    if (!selectedRule) return
    setSubmitting(true)
    try {
      await alertRuleApi.deleteRule(selectedRule.id)
      setDeleteModalOpen(false)
      setSelectedRule(null)
      loadRules()
    } catch (error) {
      console.error('删除告警规则失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // 启用/禁用规则
  const handleToggleEnabled = async (rule: AlertRuleVO) => {
    try {
      if (rule.enabled) {
        await alertRuleApi.disableRule(rule.id)
      } else {
        await alertRuleApi.enableRule(rule.id)
      }
      loadRules()
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 添加条件
  const handleAddCondition = () => {
    setFormData({
      ...formData,
      conditionConfigs: [
        ...formData.conditionConfigs,
        {
          metricCode: '',
          operator: 'GT',
          threshold: 0,
        },
      ],
    })
  }

  // 更新条件
  const handleUpdateCondition = (index: number, field: keyof RuleConditionConfig, value: any) => {
    const newConditions = [...formData.conditionConfigs]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setFormData({ ...formData, conditionConfigs: newConditions })
  }

  // 删除条件
  const handleRemoveCondition = (index: number) => {
    const newConditions = formData.conditionConfigs.filter((_, i) => i !== index)
    setFormData({ ...formData, conditionConfigs: newConditions })
  }

  // 切换通知方式
  const handleToggleNotifyType = (type: NotifyType) => {
    const types = formData.notifyTypes || []
    if (types.includes(type)) {
      setFormData({ ...formData, notifyTypes: types.filter((t) => t !== type) })
    } else {
      setFormData({ ...formData, notifyTypes: [...types, type] })
    }
  }

  // 过滤规则
  const filteredRules = rules.filter((rule) => {
    if (searchKeyword) {
      return rule.ruleName.toLowerCase().includes(searchKeyword.toLowerCase())
    }
    return true
  })

  // 获取通知方式图标
  const getNotifyIcon = (type: NotifyType) => {
    switch (type) {
      case 'sms':
        return <Smartphone className="w-3.5 h-3.5" />
      case 'email':
        return <Mail className="w-3.5 h-3.5" />
      case 'push':
        return <Bell className="w-3.5 h-3.5" />
      case 'wechat':
        return <MessageSquare className="w-3.5 h-3.5" />
    }
  }

  // 获取级别样式
  const getLevelStyle = (level: AlertLevel) => {
    switch (level) {
      case 'URGENT':
        return 'bg-red-500'
      case 'IMPORTANT':
        return 'bg-orange-500'
      case 'NORMAL':
        return 'bg-yellow-500'
      case 'INFO':
        return 'bg-blue-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
          <input
            type="text"
            placeholder="搜索规则名称..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-clean-300 rounded-xl focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100"
          />
        </div>
        <div className="w-32">
          <Select
            placeholder="对象类型"
            value={targetTypeFilter}
            onChange={(v) => {
              setTargetTypeFilter(v as AlertTargetType | '')
              setPageNum(1)
            }}
            options={[
              { value: '', label: '全部类型' },
              { value: 'site', label: '站点' },
              { value: 'device', label: '设备' },
              { value: 'task', label: '任务' },
            ]}
          />
        </div>
        <div className="w-32">
          <Select
            placeholder="状态"
            value={enabledFilter}
            onChange={(v) => {
              setEnabledFilter(v)
              setPageNum(1)
            }}
            options={[
              { value: '', label: '全部状态' },
              { value: 'true', label: '已启用' },
              { value: 'false', label: '已禁用' },
            ]}
          />
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAdd}>
          新增规则
        </Button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-nature-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-clean-500">加载中...</span>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-clean-400">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <p>暂无告警规则</p>
          <Button variant="primary" className="mt-4" onClick={handleAdd}>
            创建第一条规则
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-white rounded-xl border border-clean-200 overflow-hidden hover:shadow-lg transition-shadow',
                !rule.enabled && 'opacity-60'
              )}
            >
              {/* 顶部色条 */}
              <div className={cn('h-1', getLevelStyle(rule.alertLevel))} />

              <div className="p-5">
                {/* 头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-clean-900 truncate">{rule.ruleName}</h3>
                    <p className="text-xs text-clean-500 mt-0.5">
                      {alertTargetTypeMap[rule.alertTargetType]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs rounded-full',
                        rule.enabled
                          ? 'bg-green-100 text-green-600'
                          : 'bg-clean-100 text-clean-500'
                      )}
                    >
                      {rule.enabled ? '启用' : '禁用'}
                    </span>
                  </div>
                </div>

                {/* 告警级别和静默期 */}
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full',
                      alertLevelMap[rule.alertLevel]?.bgColor,
                      alertLevelMap[rule.alertLevel]?.color
                    )}
                  >
                    {alertLevelMap[rule.alertLevel]?.label}
                  </span>
                  <span className="text-clean-500">静默期 {rule.quietPeriod} 分钟</span>
                </div>

                {/* 条件数量 */}
                <div className="flex items-center gap-2 mb-3 text-sm text-clean-600">
                  <span className="px-2 py-1 bg-clean-100 rounded-lg">
                    {rule.conditionConfigs?.length || 0} 个触发条件
                  </span>
                </div>

                {/* 通知方式 */}
                {Array.isArray(rule.notifyTypes) && rule.notifyTypes.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {rule.notifyTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg"
                      >
                        {getNotifyIcon(type)}
                        {notifyTypeMap[type]}
                      </span>
                    ))}
                  </div>
                )}

                {/* 告警消息 */}
                <p className="text-sm text-clean-600 line-clamp-2 mb-4">{rule.alertMessage}</p>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 pt-3 border-t border-clean-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={
                      rule.enabled ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )
                    }
                    onClick={() => handleToggleEnabled(rule)}
                  >
                    {rule.enabled ? '禁用' : '启用'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 className="w-4 h-4" />}
                    onClick={() => handleEdit(rule)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={() => {
                      setSelectedRule(rule)
                      setDeleteModalOpen(true)
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 加载更多 */}
      {total > filteredRules.length && (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => setPageNum(pageNum + 1)}
            loading={loading}
          >
            加载更多
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedRule ? '编辑告警规则' : '新增告警规则'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              保存
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="规则名称"
              value={formData.ruleName}
              onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
              placeholder="请输入规则名称"
            />
            <Select
              label="告警对象类型"
              value={formData.alertTargetType}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  alertTargetType: v as AlertTargetType,
                  conditionConfigs: [],
                })
              }
              options={[
                { value: 'site', label: '站点' },
                { value: 'device', label: '设备' },
                { value: 'task', label: '任务' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="告警级别"
              value={formData.alertLevel}
              onChange={(v) => setFormData({ ...formData, alertLevel: v as AlertLevel })}
              options={[
                { value: 'URGENT', label: '紧急' },
                { value: 'IMPORTANT', label: '重要' },
                { value: 'NORMAL', label: '一般' },
                { value: 'INFO', label: '提示' },
              ]}
            />
            <Input
              label="静默期（分钟）"
              type="number"
              value={formData.quietPeriod?.toString() || '60'}
              onChange={(e) =>
                setFormData({ ...formData, quietPeriod: parseInt(e.target.value) || 60 })
              }
              placeholder="60"
            />
          </div>

          {/* 告警消息 */}
          <div>
            <label className="block text-sm font-medium text-clean-700 mb-2">告警消息模板</label>
            <textarea
              value={formData.alertMessage}
              onChange={(e) => setFormData({ ...formData, alertMessage: e.target.value })}
              placeholder="请输入告警消息模板，可使用 {metric} {value} {threshold} 等变量"
              className="w-full px-4 py-3 border border-clean-300 rounded-xl focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100 resize-none"
              rows={2}
            />
          </div>

          {/* 触发条件 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-clean-700">触发条件</label>
              <Button variant="outline" size="sm" onClick={handleAddCondition}>
                添加条件
              </Button>
            </div>
            {formData.conditionConfigs.length === 0 ? (
              <div className="text-center py-8 text-clean-400 bg-clean-50 rounded-xl border border-dashed border-clean-200">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p>暂无触发条件，请添加</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.conditionConfigs.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-clean-50 rounded-xl border border-clean-200"
                  >
                    <Select
                      value={condition.metricCode}
                      onChange={(v) => handleUpdateCondition(index, 'metricCode', v)}
                      placeholder="选择指标"
                      options={metrics.map((m) => ({ value: m.code, label: m.name }))}
                    />
                    <Select
                      value={condition.operator}
                      onChange={(v) => handleUpdateCondition(index, 'operator', v)}
                      options={Object.entries(operatorMap).map(([value, label]) => ({
                        value,
                        label,
                      }))}
                    />
                    {condition.operator === 'BETWEEN' || condition.operator === 'NOT_BETWEEN' ? (
                      <>
                        <input
                          type="number"
                          value={condition.thresholdMin ?? ''}
                          onChange={(e) =>
                            handleUpdateCondition(index, 'thresholdMin', parseFloat(e.target.value))
                          }
                          placeholder="最小值"
                          className="w-24 px-3 py-2 border border-clean-300 rounded-lg focus:outline-none focus:border-nature-400"
                        />
                        <span className="text-clean-500">~</span>
                        <input
                          type="number"
                          value={condition.thresholdMax ?? ''}
                          onChange={(e) =>
                            handleUpdateCondition(index, 'thresholdMax', parseFloat(e.target.value))
                          }
                          placeholder="最大值"
                          className="w-24 px-3 py-2 border border-clean-300 rounded-lg focus:outline-none focus:border-nature-400"
                        />
                      </>
                    ) : (
                      <input
                        type="number"
                        value={condition.threshold ?? ''}
                        onChange={(e) =>
                          handleUpdateCondition(index, 'threshold', parseFloat(e.target.value))
                        }
                        placeholder="阈值"
                        className="w-24 px-3 py-2 border border-clean-300 rounded-lg focus:outline-none focus:border-nature-400"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4 text-red-500" />}
                      onClick={() => handleRemoveCondition(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 通知方式 */}
          <div>
            <label className="block text-sm font-medium text-clean-700 mb-3">通知方式</label>
            <div className="flex flex-wrap gap-3">
              {(Object.entries(notifyTypeMap) as [NotifyType, string][]).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => handleToggleNotifyType(type)}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                    formData.notifyTypes?.includes(type)
                      ? 'bg-nature-50 border-nature-400 text-nature-700'
                      : 'bg-white border-clean-300 text-clean-600 hover:border-clean-400'
                  )}
                >
                  {getNotifyIcon(type)}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedRule(null)
        }}
        onConfirm={handleDelete}
        title="删除告警规则"
        description={`确定要删除规则「${selectedRule?.ruleName}」吗？删除后无法恢复。`}
        confirmText="删除"
        variant="danger"
        loading={submitting}
      />
    </div>
  )
}
