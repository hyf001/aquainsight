import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Layers, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import {
  taskTemplateApi,
  taskTemplateItemApi,
  stepTemplateApi,
  TaskTemplate,
  TaskTemplateItem,
  StepTemplate,
  CreateTaskTemplateRequest,
  UpdateTaskTemplateRequest,
  CreateTaskTemplateItemRequest,
  UpdateTaskTemplateItemRequest,
} from '@/services/maintenance'

export default function TaskTemplates() {
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([])
  const [stepTemplates, setStepTemplates] = useState<StepTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState<TaskTemplate | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [selectedTemplateForItems, setSelectedTemplateForItems] = useState<TaskTemplate | null>(null)

  // 模版表单状态
  const [templateForm, setTemplateForm] = useState<CreateTaskTemplateRequest>({
    name: '',
    code: '',
  })

  // 项目表单状态
  const [itemForm, setItemForm] = useState<CreateTaskTemplateItemRequest & { id?: number }>({
    taskTemplateId: 0,
    stepTemplateId: 0,
    itemName: '',
    description: '',
  })

  // 获取任务模版列表
  const fetchTaskTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const data = await taskTemplateApi.list(searchName || undefined)
      setTaskTemplates(data as unknown as TaskTemplate[])
    } catch (error) {
      console.error('获取任务模版列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [searchName])

  // 获取步骤模版列表
  const fetchStepTemplates = useCallback(async () => {
    try {
      const data = await stepTemplateApi.list()
      setStepTemplates(data as unknown as StepTemplate[])
    } catch (error) {
      console.error('获取步骤模版列表失败:', error)
    }
  }, [])

  useEffect(() => {
    fetchTaskTemplates()
    fetchStepTemplates()
  }, [fetchTaskTemplates, fetchStepTemplates])

  // 搜索
  const handleSearch = () => {
    fetchTaskTemplates()
  }

  // 打开新增模态框
  const handleAddTemplate = () => {
    setEditingItem(null)
    setTemplateForm({
      name: '',
      code: '',
    })
    setShowModal(true)
  }

  // 打开编辑模态框
  const handleEditTemplate = (item: TaskTemplate) => {
    setEditingItem(item)
    setTemplateForm({
      name: item.name,
      code: item.code,
    })
    setShowModal(true)
  }

  // 保存模版
  const handleSaveTemplate = async () => {
    if (!templateForm.name.trim() || !templateForm.code.trim()) {
      alert('请填写名称和编码')
      return
    }

    try {
      if (editingItem) {
        const data: UpdateTaskTemplateRequest = {
          name: templateForm.name,
        }
        await taskTemplateApi.update(editingItem.id, data)
      } else {
        await taskTemplateApi.create(templateForm)
      }
      setShowModal(false)
      fetchTaskTemplates()
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    }
  }

  // 删除模版
  const handleDeleteTemplate = async (id: number) => {
    if (!confirm('确定要删除此任务模版吗？相关项目也会被删除。')) return
    try {
      await taskTemplateApi.delete(id)
      fetchTaskTemplates()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  // 展开/收起详情
  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      // 展开时获取详情
      try {
        const detail = await taskTemplateApi.getById(id, true)
        setTaskTemplates((prev) =>
          prev.map((t) => (t.id === id ? (detail as unknown as TaskTemplate) : t))
        )
      } catch (error) {
        console.error('获取任务模版详情失败:', error)
      }
    }
  }

  // 打开添加项目模态框
  const handleAddItem = (template: TaskTemplate) => {
    setSelectedTemplateForItems(template)
    setItemForm({
      taskTemplateId: template.id,
      stepTemplateId: 0,
      itemName: '',
      description: '',
    })
    setShowItemModal(true)
  }

  // 打开编辑项目模态框
  const handleEditItem = (item: TaskTemplateItem) => {
    setItemForm({
      id: item.id,
      taskTemplateId: item.taskTemplateId,
      stepTemplateId: item.stepTemplateId,
      itemName: item.itemName,
      description: item.description || '',
    })
    setShowItemModal(true)
  }

  // 保存项目
  const handleSaveItem = async () => {
    if (!itemForm.stepTemplateId) {
      alert('请选择步骤模版')
      return
    }
    if (!itemForm.itemName.trim()) {
      alert('请输入项目名称')
      return
    }

    try {
      if (itemForm.id) {
        const data: UpdateTaskTemplateItemRequest & { id: number } = {
          id: itemForm.id,
          itemName: itemForm.itemName,
          description: itemForm.description,
        }
        await taskTemplateItemApi.update(itemForm.id, data)
      } else {
        await taskTemplateItemApi.create(itemForm)
      }
      setShowItemModal(false)
      // 重新获取模版详情
      if (selectedTemplateForItems) {
        const detail = await taskTemplateApi.getById(selectedTemplateForItems.id, true)
        setTaskTemplates((prev) =>
          prev.map((t) =>
            t.id === selectedTemplateForItems.id ? (detail as unknown as TaskTemplate) : t
          )
        )
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    }
  }

  // 删除项目
  const handleDeleteItem = async (id: number) => {
    if (!confirm('确定要删除此项目吗？')) return
    try {
      await taskTemplateItemApi.delete(id)
      // 重新获取模版详情
      if (selectedTemplateForItems) {
        const detail = await taskTemplateApi.getById(selectedTemplateForItems.id, true)
        setTaskTemplates((prev) =>
          prev.map((t) =>
            t.id === selectedTemplateForItems.id ? (detail as unknown as TaskTemplate) : t
          )
        )
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-clean-900">任务模版</h1>
          <p className="text-clean-500 mt-1">管理运维任务的标准模版</p>
        </div>
        <Button onClick={handleAddTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          新增任务模版
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clean-400" />
          <input
            type="text"
            placeholder="搜索任务模版名称..."
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
      ) : taskTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-clean-400">
          <Layers className="w-12 h-12 mb-4" />
          <p>暂无任务模版</p>
          <Button variant="primary" className="mt-4" onClick={handleAddTemplate}>
            创建第一个模版
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskTemplates.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-clean-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* 顶部色条 */}
              <div className="h-1 bg-blue-500" />

              <div className="p-5">
                {/* 头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-blue-600" />
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
                    <ClipboardList className="w-3.5 h-3.5" />
                    {item.items?.length ?? 0} 个步骤项
                  </span>
                  <span className="text-clean-500">创建人: {item.creator}</span>
                </div>

                {/* 步骤项预览 */}
                <div className="mb-3">
                  <button
                    onClick={() => {
                      setSelectedTemplateForItems(item)
                      toggleExpand(item.id)
                    }}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    {expandedId === item.id ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        收起步骤
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        查看步骤
                      </>
                    )}
                  </button>
                  {expandedId === item.id && (
                    <div className="mt-2 space-y-2">
                      {item.items == null || item.items.length === 0 ? (
                        <p className="text-xs text-clean-400 py-2">暂无步骤项</p>
                      ) : (
                        item.items.map((stepItem, idx) => (
                          <div
                            key={stepItem.id}
                            className="flex items-center justify-between px-3 py-2 bg-clean-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                                {idx + 1}
                              </span>
                              <span className="text-sm text-clean-700">{stepItem.itemName}</span>
                              <span className="text-xs text-clean-400">
                                ({stepItem.stepTemplate?.name || '未设置'})
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditItem(stepItem)
                                }}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteItem(stepItem.id)
                                }}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleAddItem(item)}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        添加步骤项
                      </Button>
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 pt-3 border-t border-clean-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 className="w-4 h-4" />}
                    onClick={() => handleEditTemplate(item)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={() => handleDeleteTemplate(item.id)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 新增/编辑模版模态框 */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? '编辑任务模版' : '新增任务模版'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button onClick={handleSaveTemplate}>保存</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="模版名称"
            value={templateForm.name}
            onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
            placeholder="请输入模版名称"
          />

          <Input
            label="模版编码"
            value={templateForm.code}
            onChange={(e) => setTemplateForm({ ...templateForm, code: e.target.value })}
            placeholder="请输入模版编码"
            disabled={!!editingItem}
          />
        </div>
      </Modal>

      {/* 添加/编辑项目模态框 */}
      <Modal
        open={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={itemForm.id ? '编辑步骤项' : '添加步骤项'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowItemModal(false)}>
              取消
            </Button>
            <Button onClick={handleSaveItem}>保存</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="text-sm text-clean-600 pb-2">
            模版: {selectedTemplateForItems?.name}
          </div>

          <Input
            label="项目名称"
            value={itemForm.itemName}
            onChange={(e) => setItemForm({ ...itemForm, itemName: e.target.value })}
            placeholder="请输入项目名称"
          />

          <Select
            label="关联步骤模版"
            value={String(itemForm.stepTemplateId)}
            onChange={(val) => setItemForm({ ...itemForm, stepTemplateId: parseInt(val) })}
            options={[
              { value: '0', label: '请选择步骤模版' },
              ...stepTemplates.map((st) => ({ value: String(st.id), label: st.name })),
            ]}
          />

          <div>
            <label className="block text-sm text-clean-600 mb-2">描述</label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-clean-300 rounded-xl text-clean-800 placeholder-clean-400 focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100 transition-all duration-200"
              rows={3}
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              placeholder="请输入描述"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
