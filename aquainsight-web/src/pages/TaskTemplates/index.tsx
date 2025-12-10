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
  Row,
  Col,
  Drawer,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
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
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  // 任务模版项目相关状态
  const [itemDrawerVisible, setItemDrawerVisible] = useState(false)
  const [currentTaskTemplate, setCurrentTaskTemplate] = useState<TaskTemplate | null>(null)
  const [taskTemplateItems, setTaskTemplateItems] = useState<TaskTemplateItem[]>([])
  const [itemModalVisible, setItemModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<TaskTemplateItem | null>(null)
  const [itemForm] = Form.useForm()
  const [stepTemplates, setStepTemplates] = useState<StepTemplate[]>([])

  // 加载任务模版列表
  const loadTaskTemplates = async (name?: string) => {
    setLoading(true)
    try {
      const data = await getTaskTemplateList(name)
      setTaskTemplates(data)
    } catch (error) {
      console.error('加载任务模版列表失败:', error)
      message.error('加载任务模版列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载步骤模版
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

  // 打开创建/编辑任务模版对话框
  const openModal = (taskTemplate?: TaskTemplate) => {
    setEditingTaskTemplate(taskTemplate || null)
    if (taskTemplate) {
      form.setFieldsValue({
        name: taskTemplate.name,
        code: taskTemplate.code,
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 保存任务模版
  const handleSaveTaskTemplate = async () => {
    try {
      const values = await form.validateFields()

      if (editingTaskTemplate) {
        await updateTaskTemplate(editingTaskTemplate.id, values)
        message.success('任务模版更新成功')
      } else {
        await createTaskTemplate(values)
        message.success('任务模版创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      loadTaskTemplates(searchName)
    } catch (error: any) {
      console.error('保存任务模版失败:', error)
      message.error(error.message || '保存任务模版失败')
    }
  }

  // 删除任务模版
  const handleDeleteTaskTemplate = async (id: number) => {
    try {
      await deleteTaskTemplate(id)
      message.success('任务模版删除成功')
      loadTaskTemplates(searchName)
    } catch (error: any) {
      console.error('删除任务模版失败:', error)
      message.error(error.message || '删除任务模版失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的任务模版')
      return
    }

    try {
      await batchDeleteTaskTemplates(selectedRowKeys as number[])
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadTaskTemplates(searchName)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      message.error(error.message || '批量删除失败')
    }
  }

  // 搜索
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setSearchName(values.name || '')
    loadTaskTemplates(values.name)
  }


  // 打开任务模版项目抽屉
  const openItemDrawer = async (taskTemplate: TaskTemplate) => {
    setCurrentTaskTemplate(taskTemplate)
    setItemDrawerVisible(true)
    await loadTaskTemplateItems(taskTemplate.id)
  }

  // 加载任务模版项目
  const loadTaskTemplateItems = async (taskTemplateId: number) => {
    try {
      const data = await getTaskTemplateItems(taskTemplateId)
      setTaskTemplateItems(data)
    } catch (error) {
      console.error('加载任务模版项目失败:', error)
      message.error('加载任务模版项目失败')
    }
  }

  // 打开任务模版项目编辑对话框
  const openItemModal = (item?: TaskTemplateItem) => {
    setEditingItem(item || null)
    if (item) {
      itemForm.setFieldsValue({
        stepTemplateId: item.stepTemplateId,
        itemName: item.itemName,
        description: item.description || undefined,
      })
    } else {
      itemForm.resetFields()
    }
    setItemModalVisible(true)
  }

  // 保存任务模版项目
  const handleSaveItem = async () => {
    if (!currentTaskTemplate) return

    try {
      const values = await itemForm.validateFields()

      const itemData = {
        stepTemplateId: values.stepTemplateId,
        itemName: values.itemName,
        description: values.description,
      }

      if (editingItem) {
        await updateTaskTemplateItem(editingItem.id, itemData)
        message.success('任务模版项目更新成功')
      } else {
        await addTaskTemplateItem({
          taskTemplateId: currentTaskTemplate.id,
          ...itemData,
        })
        message.success('任务模版项目添加成功')
      }

      setItemModalVisible(false)
      itemForm.resetFields()
      await loadTaskTemplateItems(currentTaskTemplate.id)
    } catch (error: any) {
      console.error('保存任务模版项目失败:', error)
      message.error(error.message || '保存任务模版项目失败')
    }
  }

  // 删除任务模版项目
  const handleDeleteItem = async (id: number) => {
    if (!currentTaskTemplate) return

    try {
      await deleteTaskTemplateItem(id)
      message.success('任务模版项目删除成功')
      await loadTaskTemplateItems(currentTaskTemplate.id)
    } catch (error: any) {
      console.error('删除任务模版项目失败:', error)
      message.error(error.message || '删除任务模版项目失败')
    }
  }

  // 任务模版表格列定义
  const columns: ColumnsType<TaskTemplate> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_text, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => openItemDrawer(record)}
            title="项目"
          />
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这个任务模版吗?"
            onConfirm={() => handleDeleteTaskTemplate(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: '任务模版名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '任务模版编码',
      dataIndex: 'code',
      key: 'code',
      width: 200,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
      render: (text) => text || '/',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
  ]

  // 任务模版项目表格列定义
  const itemColumns: ColumnsType<TaskTemplateItem> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_text, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openItemModal(record)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这个项目吗?"
            onConfirm={() => handleDeleteItem(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: '项目名称',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
    },
    {
      title: '步骤模版',
      dataIndex: ['stepTemplate', 'name'],
      key: 'stepTemplateName',
      width: 200,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || '/',
    },
  ]

  return (
    <Card title="任务模版管理">
      {/* 搜索表单 */}
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col>
            <Form.Item label="任务模版名称:" name="name">
              <Input placeholder="请输入任务模版名称" allowClear style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                查询
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      {/* 操作按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            新增
          </Button>
          <Popconfirm
            title="确定要删除选中的任务模版吗?"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
            disabled={selectedRowKeys.length === 0}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* 任务模版表格 */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={taskTemplates}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      {/* 创建/编辑任务模版对话框 */}
      <Modal
        title={editingTaskTemplate ? '编辑任务模版' : '新增任务模版'}
        open={modalVisible}
        onOk={handleSaveTaskTemplate}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={600}
        okText="保存"
        cancelText="关闭"
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
        >
          <Form.Item
            label="任务模版名称:"
            name="name"
            rules={[{ required: true, message: '请输入任务模版名称' }]}
          >
            <Input placeholder="请输入任务模版名称" />
          </Form.Item>

          <Form.Item
            label="任务模版编码:"
            name="code"
            rules={[{ required: true, message: '请输入任务模版编码' }]}
          >
            <Input placeholder="请输入任务模版编码" disabled={!!editingTaskTemplate} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务模版项目抽屉 */}
      <Drawer
        title={`任务模版项目 - ${currentTaskTemplate?.name || ''}`}
        open={itemDrawerVisible}
        onClose={() => setItemDrawerVisible(false)}
        width={900}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openItemModal()}
          >
            添加项目
          </Button>
        }
      >
        <Table
          columns={itemColumns}
          dataSource={taskTemplateItems}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Drawer>

      {/* 创建/编辑任务模版项目对话框 */}
      <Modal
        title={editingItem ? '编辑任务模版项目' : '新增任务模版项目'}
        open={itemModalVisible}
        onOk={handleSaveItem}
        onCancel={() => {
          setItemModalVisible(false)
          itemForm.resetFields()
        }}
        width={600}
        okText="保存"
        cancelText="关闭"
      >
        <Form
          form={itemForm}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item
            label="项目名称:"
            name="itemName"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>

          <Form.Item
            label="步骤模版:"
            name="stepTemplateId"
            rules={[{ required: true, message: '请选择步骤模版' }]}
          >
            <Select
              placeholder="请选择步骤模版"
              options={stepTemplates.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="说明:" name="description">
            <Input.TextArea
              placeholder="请输入说明"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default TaskTemplates
