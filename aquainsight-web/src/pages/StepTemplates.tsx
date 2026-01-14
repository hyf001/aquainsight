import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Settings2, Clock, Hash, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'
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
  const [expandedId, setExpandedId] = useState<number | null>(null)

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
      const data = await stepTemplateApi.list(searchName || undefined)
      setStepTemplates(data as unknown as StepTemplate[])
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
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
          <input
            type="text"
            placeholder="搜索步骤模版名称..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-clean-300 rounded-xl focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100"
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>
          搜索
        </Button>
      </div>

      {/* 卡片网格 */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-nature-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-clean-500">加载中...</span>
        </div>
      ) : stepTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-clean-400">
          <Settings2 className="w-12 h-12 mb-4" />
          <p>暂无步骤模版</p>
          <Button variant="primary" className="mt-4" onClick={handleAdd}>
            创建第一个模版
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stepTemplates.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-clean-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* 顶部色条 */}
              <div className="h-1 bg-nature-500" />

              <div className="p-5">
                {/* 头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-nature-100 flex items-center justify-center">
                      <Settings2 className="w-5 h-5 text-nature-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-clean-900">{item.name}</h3>
                      <p className="text-xs text-clean-500">{item.code}</p>
                    </div>
                  </div>
                </div>

                {/* 信息 */}
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <span className="flex items-center gap-1 text-clean-600">
                    <Hash className="w-3.5 h-3.5" />
                    {item.parameters?.length || 0} 个参数
                  </span>
                  <span className="flex items-center gap-1 text-clean-600">
                    <Clock className="w-3.5 h-3.5" />
                    逾期 {item.overdueDays || 30} 天
                  </span>
                </div>

                {/* 描述 */}
                {item.description && (
                  <p className="text-sm text-clean-600 line-clamp-2 mb-3">{item.description}</p>
                )}

                {/* 参数预览 */}
                {item.parameters && item.parameters.length > 0 && (
                  <div className="mb-3">
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="flex items-center gap-1 text-xs text-nature-600 hover:text-nature-700"
                    >
                      {expandedId === item.id ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          收起参数
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          查看参数
                        </>
                      )}
                    </button>
                    {expandedId === item.id && (
                      <div className="mt-2 space-y-1">
                        {item.parameters.map((param, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-2 py-1 bg-clean-50 rounded text-xs"
                          >
                            <span className="font-medium text-clean-700">
                              {param.label || param.name}
                            </span>
                            <span className="text-clean-400">
                              ({parameterTypes.find((t) => t.value === param.type)?.label || param.type})
                            </span>
                            {param.required && <span className="text-red-500">*</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 pt-3 border-t border-clean-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 className="w-4 h-4" />}
                    onClick={() => handleEdit(item)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 新增/编辑模态框 */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? '编辑步骤模版' : '新增步骤模版'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
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
            disabled={!!editingItem}
          />

          <Input
            label="逾期天数"
            type="number"
            value={formData.overdueDays?.toString() || '30'}
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
                  <div key={index} className="p-4 bg-clean-50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-clean-700">参数 {index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteParameter(index)}>
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
                        value={param.label || ''}
                        onChange={(e) => handleUpdateParameter(index, 'label', e.target.value)}
                        placeholder="如: 温度"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        label="参数类型"
                        value={typeof param.type === 'string' ? param.type.toLowerCase() : 'text'}
                        onChange={(val) => handleUpdateParameter(index, 'type', val)}
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
      </Modal>
    </div>
  )
}
