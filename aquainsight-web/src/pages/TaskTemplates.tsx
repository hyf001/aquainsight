import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, ChevronDown, ChevronUp, Layers, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
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
      const data = await taskTemplateApi.list(searchName || undefined) as any
      setTaskTemplates(data)
    } catch (error) {
      console.error('获取任务模版列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [searchName])

  // 获取步骤模版列表
  const fetchStepTemplates = useCallback(async () => {
    try {
      const data = await stepTemplateApi.list() as any
      setStepTemplates(data)
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
        const detail = await taskTemplateApi.getById(selectedTemplateForItems.id, true) as any
        setTaskTemplates(prev => prev.map(t =>
          t.id === selectedTemplateForItems.id ? detail : t
        ))
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
        const detail = await taskTemplateApi.getById(selectedTemplateForItems.id, true) as any
        setTaskTemplates(prev => prev.map(t =>
          t.id === selectedTemplateForItems.id ? detail : t
        ))
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  // 切换展开/收起
  const toggleExpand = async (id: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
      // 展开时获取详情
      try {
        const detail = await taskTemplateApi.getById(id, true) as any
        setTaskTemplates(prev => prev.map(t =>
          t.id === id ? detail : t
        ))
      } catch (error) {
        console.error('获取任务模版详情失败:', error)
      }
    }
    setExpandedItems(newExpanded)
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
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索任务模版名称..."
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
        ) : taskTemplates.length === 0 ? (
          <div className="text-center py-12 text-clean-400">暂无数据</div>
        ) : (
          taskTemplates.map((item) => (
            <Card key={item.id} hover>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-nature-100 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-nature-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-clean-900">{item.name}</h3>
                      <p className="text-sm text-clean-500">
                        编码: {item.code} | 项目数: {item.items?.length ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-clean-500">
                      创建人: {item.creator}
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 展开详情 - 项目列表 */}
                {expandedItems.has(item.id) && (
                  <div className="mt-4 pt-4 border-t border-clean-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-clean-800 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        步骤项目列表
                      </h4>
                      <Button variant="secondary" size="sm" onClick={() => handleAddItem(item)}>
                        <Plus className="w-4 h-4 mr-1" />
                        添加项目
                      </Button>
                    </div>

                    {(item.items == null || item.items.length === 0) ? (
                      <p className="text-sm text-clean-400 text-center py-4">暂无项目，点击上方按钮添加</p>
                    ) : (
                      <div className="space-y-2">
                        {item.items!.map((itemDetail, idx) => (
                          <div
                            key={itemDetail.id}
                            className="flex items-center justify-between p-3 bg-clean-50 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-nature-100 text-nature-600 text-sm flex items-center justify-center font-medium">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-medium text-clean-800">{itemDetail.itemName}</span>
                                <span className="text-sm text-clean-400 mx-2">|</span>
                                <span className="text-sm text-clean-500">
                                  步骤: {itemDetail.stepTemplate?.name || '未设置'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditItem(itemDetail)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(itemDetail.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 新增/编辑模版模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-clean-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-clean-900">
                {editingItem ? '编辑任务模版' : '新增任务模版'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-clean-400 hover:text-clean-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
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
              />
            </div>

            <div className="px-6 py-4 border-t border-clean-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveTemplate}>
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 添加/编辑项目模态框 */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-clean-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-clean-900">
                {itemForm.id ? '编辑项目' : '添加项目'}
              </h2>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-clean-400 hover:text-clean-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
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
                onChange={(e) => setItemForm({ ...itemForm, stepTemplateId: parseInt(e.target.value) })}
                options={[
                  { value: '0', label: '请选择步骤模版' },
                  ...stepTemplates.map(st => ({ value: String(st.id), label: st.name })),
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

            <div className="px-6 py-4 border-t border-clean-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowItemModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveItem}>
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
