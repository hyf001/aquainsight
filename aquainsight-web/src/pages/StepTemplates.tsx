import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, ChevronDown, ChevronUp, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import {
  stepTemplateApi,
  StepTemplate,
  StepParameter,
  CreateStepTemplateRequest,
  UpdateStepTemplateRequest,
} from '@/services/maintenance'

// 参数类型选项
const parameterTypes = [
  { value: 'text', label: '文本' },
  { value: 'textarea', label: '多行文本' },
  { value: 'number', label: '数字' },
  { value: 'select', label: '单选' },
  { value: 'multiSelect', label: '多选' },
  { value: 'date', label: '日期' },
  { value: 'datetime', label: '日期时间' },
  { value: 'photo', label: '照片' },
  { value: 'checkbox', label: '复选框' },
]

export default function StepTemplates() {
  const [stepTemplates, setStepTemplates] = useState<StepTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<StepTemplate | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  // 表单状态
  const [formData, setFormData] = useState<CreateStepTemplateRequest>({
    name: '',
    code: '',
    parameters: [],
    overdueDays: 30,
    description: '',
  })

  // 获取步骤模版列表
  const fetchStepTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const data = await stepTemplateApi.list(searchName || undefined) as any
      setStepTemplates(data)
    } catch (error) {
      console.error('获取步骤模版列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [searchName])

  useEffect(() => {
    fetchStepTemplates()
  }, [fetchStepTemplates])

  // 搜索
  const handleSearch = () => {
    fetchStepTemplates()
  }

  // 打开新增模态框
  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      code: '',
      parameters: [],
      overdueDays: 30,
      description: '',
    })
    setShowModal(true)
  }

  // 打开编辑模态框
  const handleEdit = (item: StepTemplate) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      code: item.code,
      parameters: item.parameters || [],
      overdueDays: item.overdueDays || 30,
      description: item.description || '',
    })
    setShowModal(true)
  }

  // 保存
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('请填写名称和编码')
      return
    }

    try {
      if (editingItem) {
        const data: UpdateStepTemplateRequest = {
          name: formData.name,
          parameters: formData.parameters,
          overdueDays: formData.overdueDays,
          description: formData.description,
        }
        await stepTemplateApi.update(editingItem.id, data)
      } else {
        await stepTemplateApi.create(formData)
      }
      setShowModal(false)
      fetchStepTemplates()
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    }
  }

  // 删除
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此步骤模版吗？')) return
    try {
      await stepTemplateApi.delete(id)
      fetchStepTemplates()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  // 添加参数
  const handleAddParameter = () => {
    const newParam: StepParameter = {
      name: `param_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
    }
    setFormData({
      ...formData,
      parameters: [...(formData.parameters || []), newParam],
    })
  }

  // 更新参数
  const handleUpdateParameter = (index: number, field: keyof StepParameter, value: unknown) => {
    const newParams = [...formData.parameters]
    newParams[index] = { ...newParams[index], [field]: value }
    setFormData({ ...formData, parameters: newParams })
  }

  // 删除参数
  const handleDeleteParameter = (index: number) => {
    const newParams = formData.parameters.filter((_, i) => i !== index)
    setFormData({ ...formData, parameters: newParams })
  }

  // 切换展开/收起
  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-clean-900">步骤模版</h1>
          <p className="text-clean-500 mt-1">管理运维任务的步骤定义模版</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增步骤模版
        </Button>
      </div>

      {/* 搜索栏 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索步骤模版名称..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="secondary" onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-clean-400">加载中...</div>
        ) : stepTemplates.length === 0 ? (
          <div className="text-center py-12 text-clean-400">暂无数据</div>
        ) : (
          stepTemplates.map((item) => (
            <Card key={item.id} hover>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-nature-100 flex items-center justify-center">
                      <Settings2 className="w-5 h-5 text-nature-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-clean-900">{item.name}</h3>
                      <p className="text-sm text-clean-500">编码: {item.code} | 参数数: {item.parameters?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-clean-500">
                      逾期天数: {item.overdueDays || '-'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 展开详情 */}
                {expandedItems.has(item.id) && (
                  <div className="mt-4 pt-4 border-t border-clean-100">
                    {item.description && (
                      <p className="text-sm text-clean-600 mb-4">{item.description}</p>
                    )}
                    <div className="space-y-2">
                      <h4 className="font-medium text-clean-800">参数列表</h4>
                      {item.parameters?.length === 0 ? (
                        <p className="text-sm text-clean-400">暂无参数</p>
                      ) : (
                        <div className="grid gap-3">
                          {item.parameters?.map((param, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-3 bg-clean-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-clean-800">{param.label || param.name}</span>
                                  <span className="text-xs text-clean-400">({param.name})</span>
                                  {param.required && (
                                    <span className="text-xs text-red-500">*必填</span>
                                  )}
                                </div>
                                <div className="text-sm text-clean-500 mt-1">
                                  类型: {parameterTypes.find(t => t.value === (typeof param.type === 'string' ? param.type.toLowerCase() : String(param.type || '').toLowerCase()))?.label || param.type || '未知'}
                                  {param.placeholder && ` | 占位符: ${param.placeholder}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 新增/编辑模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-clean-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-clean-900">
                {editingItem ? '编辑步骤模版' : '新增步骤模版'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-clean-400 hover:text-clean-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <Input
                  label="模版名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入模版名称"
                />

                <Input
                  label="模版编码"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="请输入模版编码"
                />

                <Input
                  label="逾期天数"
                  type="number"
                  value={formData.overdueDays}
                  onChange={(e) => setFormData({ ...formData, overdueDays: parseInt(e.target.value) || 0 })}
                  placeholder="请输入逾期天数"
                />

                <div>
                  <label className="block text-sm text-clean-600 mb-2">描述</label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-clean-300 rounded-xl text-clean-800 placeholder-clean-400 focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100 transition-all duration-200"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入描述"
                  />
                </div>

                {/* 参数列表 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-clean-600">参数定义</label>
                    <Button variant="ghost" size="sm" onClick={handleAddParameter}>
                      <Plus className="w-4 h-4 mr-1" />
                      添加参数
                    </Button>
                  </div>

                  {formData.parameters.length === 0 ? (
                    <p className="text-sm text-clean-400 text-center py-4">暂无参数，点击上方按钮添加</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.parameters.map((param, index) => (
                        <div
                          key={index}
                          className="p-4 bg-clean-50 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-clean-700">
                              参数 {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteParameter(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              label="参数名 (name)"
                              value={param.name}
                              onChange={(e) => handleUpdateParameter(index, 'name', e.target.value)}
                              placeholder="如: temperature"
                            />
                            <Input
                              label="显示标签 (label)"
                              value={param.label}
                              onChange={(e) => handleUpdateParameter(index, 'label', e.target.value)}
                              placeholder="如: 温度"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Select
                              label="参数类型"
                              value={typeof param.type === 'string' ? param.type.toLowerCase() : String(param.type || 'text').toLowerCase()}
                              onChange={(e) => handleUpdateParameter(index, 'type', e.target.value)}
                              options={parameterTypes}
                            />
                            <Input
                              label="占位符"
                              value={param.placeholder || ''}
                              onChange={(e) => handleUpdateParameter(index, 'placeholder', e.target.value)}
                              placeholder="占位符提示"
                            />
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={param.required || false}
                                onChange={(e) => handleUpdateParameter(index, 'required', e.target.checked)}
                                className="rounded border-clean-300 text-nature-500 focus:ring-nature-200"
                              />
                              <span className="text-sm text-clean-600">必填</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-clean-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
