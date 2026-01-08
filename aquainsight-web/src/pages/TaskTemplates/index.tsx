import React, { useState, useEffect } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  type TableColumn,
  Button,
  Modal,
  Form,
  FormField,
  Input,
  TextArea,
  Select,
  type SelectOption,
  Popconfirm,
  Drawer,
} from '@/components/ui'
import { toast } from '@/utils/toast'
import {
  getTaskTemplateList,
  createTaskTemplate,
  updateTaskTemplate,
  deleteTaskTemplate,
  batchDeleteTaskTemplates,
  getTaskTemplateItems,
  addTaskTemplateItem,
  updateTaskTemplateItem,
  deleteTaskTemplateItem,
  getStepTemplateList,
  type TaskTemplate,
  type TaskTemplateItem,
  type StepTemplate,
} from '@/services/maintenance'

const TaskTemplates: React.FC = () => {
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTaskTemplate, setEditingTaskTemplate] = useState<TaskTemplate | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchName, setSearchName] = useState('')

  // Task template items state
  const [itemDrawerVisible, setItemDrawerVisible] = useState(false)
  const [currentTaskTemplate, setCurrentTaskTemplate] = useState<TaskTemplate | null>(null)
  const [taskTemplateItems, setTaskTemplateItems] = useState<TaskTemplateItem[]>([])
  const [itemModalVisible, setItemModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<TaskTemplateItem | null>(null)
  const [stepTemplates, setStepTemplates] = useState<StepTemplate[]>([])

  const searchForm = useForm()
  const templateForm = useForm()
  const itemForm = useForm()

  // Load task templates
  const loadTaskTemplates = async (name?: string) => {
    setLoading(true)
    try {
      const data = await getTaskTemplateList(name)
      setTaskTemplates(data)
    } catch (error) {
      console.error('加载任务模版列表失败:', error)
      toast.error('加载任务模版列表失败')
    } finally {
      setLoading(false)
    }
  }

  // Load step templates
  const loadStepTemplates = async () => {
    try {
      const data = await getStepTemplateList()
      setStepTemplates(data)
    } catch (error) {
      console.error('加载步骤模版失败:', error)
    }
  }

  useEffect(() => {
    loadTaskTemplates()
    loadStepTemplates()
  }, [])

  // Open create/edit modal
  const openModal = (taskTemplate?: TaskTemplate) => {
    setEditingTaskTemplate(taskTemplate || null)
    if (taskTemplate) {
      templateForm.reset({
        name: taskTemplate.name,
        code: taskTemplate.code,
      })
    } else {
      templateForm.reset({ name: '', code: '' })
    }
    setModalVisible(true)
  }

  // Save task template
  const handleSaveTaskTemplate = async (values: any) => {
    try {
      if (editingTaskTemplate) {
        await updateTaskTemplate(editingTaskTemplate.id, values)
        toast.success('任务模版更新成功')
      } else {
        await createTaskTemplate(values)
        toast.success('任务模版创建成功')
      }
      setModalVisible(false)
      loadTaskTemplates(searchName)
    } catch (error: any) {
      console.error('保存任务模版失败:', error)
      toast.error(error.message || '保存任务模版失败')
    }
  }

  // Delete task template
  const handleDeleteTaskTemplate = async (id: number) => {
    try {
      await deleteTaskTemplate(id)
      toast.success('任务模版删除成功')
      loadTaskTemplates(searchName)
    } catch (error: any) {
      console.error('删除任务模版失败:', error)
      toast.error(error.message || '删除任务模版失败')
    }
  }

  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的任务模版')
      return
    }
    try {
      await batchDeleteTaskTemplates(selectedRowKeys as number[])
      toast.success('批量删除成功')
      setSelectedRowKeys([])
      loadTaskTemplates(searchName)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      toast.error(error.message || '批量删除失败')
    }
  }

  // Search
  const handleSearch = () => {
    const values = searchForm.getValues()
    setSearchName(values.name || '')
    loadTaskTemplates(values.name)
  }

  // Open item drawer
  const openItemDrawer = async (taskTemplate: TaskTemplate) => {
    setCurrentTaskTemplate(taskTemplate)
    setItemDrawerVisible(true)
    await loadTaskTemplateItems(taskTemplate.id)
  }

  // Load task template items
  const loadTaskTemplateItems = async (taskTemplateId: number) => {
    try {
      const data = await getTaskTemplateItems(taskTemplateId)
      setTaskTemplateItems(data)
    } catch (error) {
      console.error('加载任务模版项目失败:', error)
      toast.error('加载任务模版项目失败')
    }
  }

  // Open item modal
  const openItemModal = (item?: TaskTemplateItem) => {
    setEditingItem(item || null)
    if (item) {
      itemForm.reset({
        stepTemplateId: item.stepTemplateId,
        itemName: item.itemName,
        description: item.description || '',
      })
    } else {
      itemForm.reset({
        stepTemplateId: undefined,
        itemName: '',
        description: '',
      })
    }
    setItemModalVisible(true)
  }

  // Save item
  const handleSaveItem = async (values: any) => {
    if (!currentTaskTemplate) return
    try {
      const itemData = {
        stepTemplateId: values.stepTemplateId,
        itemName: values.itemName,
        description: values.description,
      }

      if (editingItem) {
        await updateTaskTemplateItem(editingItem.id, itemData)
        toast.success('任务模版项目更新成功')
      } else {
        await addTaskTemplateItem({
          taskTemplateId: currentTaskTemplate.id,
          ...itemData,
        })
        toast.success('任务模版项目添加成功')
      }
      setItemModalVisible(false)
      await loadTaskTemplateItems(currentTaskTemplate.id)
    } catch (error: any) {
      console.error('保存任务模版项目失败:', error)
      toast.error(error.message || '保存任务模版项目失败')
    }
  }

  // Delete item
  const handleDeleteItem = async (id: number) => {
    if (!currentTaskTemplate) return
    try {
      await deleteTaskTemplateItem(id)
      toast.success('任务模版项目删除成功')
      await loadTaskTemplateItems(currentTaskTemplate.id)
    } catch (error: any) {
      console.error('删除任务模版项目失败:', error)
      toast.error(error.message || '删除任务模版项目失败')
    }
  }

  // Step template options
  const stepTemplateOptions: SelectOption[] = stepTemplates.map((t) => ({
    label: t.name,
    value: t.id,
  }))

  // Task template table columns
  const columns: TableColumn<TaskTemplate>[] = [
    {
      title: '序号',
      key: 'index',
      width: '80px',
      render: (_, __, index) => <span className="text-sm text-gray-600">{index + 1}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<ListBulletIcon className="w-4 h-4" />}
            onClick={() => openItemDrawer(record)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="确定要删除这个任务模版吗?"
            onConfirm={() => handleDeleteTaskTemplate(record.id)}
          >
            <Button variant="ghost" size="sm" danger icon={<TrashIcon className="w-4 h-4" />} />
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '任务模版名称',
      dataIndex: 'name',
      key: 'name',
      width: '200px',
      render: (name) => <span className="text-sm text-gray-600">{name as string}</span>,
    },
    {
      title: '任务模版编码',
      dataIndex: 'code',
      key: 'code',
      width: '200px',
      render: (code) => <span className="font-mono text-sm">{code as string}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: '120px',
      render: (creator) => <span className="text-sm text-gray-600">{(creator as string) || '/'}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '180px',
      render: (time) => <span className="text-sm text-gray-600">{time as string}</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '180px',
      render: (time) => <span className="text-sm text-gray-600">{time as string}</span>,
    },
  ]

  // Task template items table columns
  const itemColumns: TableColumn<TaskTemplateItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: '80px',
      render: (_, __, index) => <span className="text-sm text-gray-600">{index + 1}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: '120px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => openItemModal(record)}
          />
          <Popconfirm
            title="确定要删除这个项目吗?"
            onConfirm={() => handleDeleteItem(record.id)}
          >
            <Button variant="ghost" size="sm" danger icon={<TrashIcon className="w-4 h-4" />} />
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      key: 'itemName',
      width: '200px',
      render: (name) => <span className="text-sm text-gray-600">{name as string}</span>,
    },
    {
      title: '步骤模版',
      dataIndex: ['stepTemplate', 'name'],
      key: 'stepTemplateName',
      width: '200px',
      render: (name) => <span className="text-sm text-gray-600">{name as string}</span>,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => <span className="text-sm text-gray-600 line-clamp-2">{(desc as string) || '/'}</span>,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">任务模版管理</h2>
        </CardHeader>
        <CardBody>
          {/* Search Form */}
          <Form form={searchForm} onSubmit={handleSearch}>
            <div className="mb-6 flex items-center gap-4">
              <FormField name="name" label="任务模版名称">
                {({ field }) => <Input {...field} placeholder="请输入任务模版名称" />}
              </FormField>
              <Button
                type="submit"
                variant="primary"
                icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              >
                查询
              </Button>
            </div>
          </Form>

          {/* Action Buttons */}
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant="primary"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => openModal()}
            >
              新增
            </Button>
            <Popconfirm
              title="确定要删除选中的任务模版吗?"
              onConfirm={handleBatchDelete}
            >
              <Button
                variant="outline"
                danger
                icon={<TrashIcon className="w-4 h-4" />}
                disabled={selectedRowKeys.length === 0}
              >
                删除
              </Button>
            </Popconfirm>
          </div>

          {/* Task Templates Table */}
          <Table
            columns={columns}
            dataSource={taskTemplates}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            size="small"
          />
        </CardBody>
      </Card>

      {/* Create/Edit Task Template Modal */}
      <Modal
        title={editingTaskTemplate ? '编辑任务模版' : '新增任务模版'}
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        width={600}
      >
        <Form form={templateForm} onSubmit={handleSaveTaskTemplate}>
          <div className="space-y-4">
            <FormField
              name="name"
              label="任务模版名称"
              rules={{ required: '请输入任务模版名称' }}
            >
              {({ field }) => <Input {...field} placeholder="请输入任务模版名称" />}
            </FormField>

            <FormField
              name="code"
              label="任务模版编码"
              rules={{ required: '请输入任务模版编码' }}
            >
              {({ field }) => (
                <Input {...field} placeholder="请输入任务模版编码" disabled={!!editingTaskTemplate} />
              )}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalVisible(false)}>
              关闭
            </Button>
            <Button type="submit" variant="primary">
              保存
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Task Template Items Drawer */}
      <Drawer
        title={`任务模版项目 - ${currentTaskTemplate?.name || ''}`}
        open={itemDrawerVisible}
        onClose={() => setItemDrawerVisible(false)}
        width={900}
      >
        <div className="mb-4 flex justify-end">
          <Button
            variant="primary"
            icon={<PlusIcon className="w-4 h-4" />}
            onClick={() => openItemModal()}
          >
            添加项目
          </Button>
        </div>

        <Table
          columns={itemColumns}
          dataSource={taskTemplateItems}
          rowKey="id"
          size="small"
        />
      </Drawer>

      {/* Create/Edit Item Modal */}
      <Modal
        title={editingItem ? '编辑任务模版项目' : '新增任务模版项目'}
        open={itemModalVisible}
        onClose={() => setItemModalVisible(false)}
        width={600}
      >
        <Form form={itemForm} onSubmit={handleSaveItem}>
          <div className="space-y-4">
            <FormField
              name="itemName"
              label="项目名称"
              rules={{ required: '请输入项目名称' }}
            >
              {({ field }) => <Input {...field} placeholder="请输入项目名称" />}
            </FormField>

            <FormField
              name="stepTemplateId"
              label="步骤模版"
              rules={{ required: '请选择步骤模版' }}
            >
              {({ field }) => (
                <Select {...field} placeholder="请选择步骤模版" options={stepTemplateOptions} />
              )}
            </FormField>

            <FormField name="description" label="说明">
              {({ field }) => <TextArea {...field} rows={4} placeholder="请输入说明" maxLength={500} />}
            </FormField>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setItemModalVisible(false)}>
              关闭
            </Button>
            <Button type="submit" variant="primary">
              保存
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default TaskTemplates
