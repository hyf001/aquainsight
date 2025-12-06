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
  getSchemeList,
  createScheme,
  updateScheme,
  deleteScheme,
  batchDeleteSchemes,
  getSchemeItems,
  addSchemeItem,
  updateSchemeItem,
  deleteSchemeItem,
  getJobCategoryList,
  type Scheme,
  type SchemeItem,
  type JobCategory,
} from '@/services/maintenance'

const Schemes: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchName, setSearchName] = useState('')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  // 方案项目相关状态
  const [itemDrawerVisible, setItemDrawerVisible] = useState(false)
  const [currentScheme, setCurrentScheme] = useState<Scheme | null>(null)
  const [schemeItems, setSchemeItems] = useState<SchemeItem[]>([])
  const [itemModalVisible, setItemModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<SchemeItem | null>(null)
  const [itemForm] = Form.useForm()
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])

  // 加载方案列表
  const loadSchemes = async (name?: string) => {
    setLoading(true)
    try {
      const data = await getSchemeList(name)
      setSchemes(data)
    } catch (error) {
      console.error('加载方案列表失败:', error)
      message.error('加载方案列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载作业类别
  const loadJobCategories = async () => {
    try {
      const data = await getJobCategoryList()
      setJobCategories(data)
    } catch (error) {
      console.error('加载作业类别失败:', error)
    }
  }

  useEffect(() => {
    loadSchemes()
    loadJobCategories()
  }, [])

  // 打开创建/编辑方案对话框
  const openModal = (scheme?: Scheme) => {
    setEditingScheme(scheme || null)
    if (scheme) {
      form.setFieldsValue({
        name: scheme.name,
        code: scheme.code,
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 保存方案
  const handleSaveScheme = async () => {
    try {
      const values = await form.validateFields()

      if (editingScheme) {
        await updateScheme(editingScheme.id, values)
        message.success('方案更新成功')
      } else {
        await createScheme(values)
        message.success('方案创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      loadSchemes(searchName)
    } catch (error: any) {
      console.error('保存方案失败:', error)
      message.error(error.message || '保存方案失败')
    }
  }

  // 删除方案
  const handleDeleteScheme = async (id: number) => {
    try {
      await deleteScheme(id)
      message.success('方案删除成功')
      loadSchemes(searchName)
    } catch (error: any) {
      console.error('删除方案失败:', error)
      message.error(error.message || '删除方案失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的方案')
      return
    }

    try {
      await batchDeleteSchemes(selectedRowKeys as number[])
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadSchemes(searchName)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      message.error(error.message || '批量删除失败')
    }
  }

  // 搜索
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setSearchName(values.name || '')
    loadSchemes(values.name)
  }


  // 打开方案项目抽屉
  const openItemDrawer = async (scheme: Scheme) => {
    setCurrentScheme(scheme)
    setItemDrawerVisible(true)
    await loadSchemeItems(scheme.id)
  }

  // 加载方案项目
  const loadSchemeItems = async (schemeId: number) => {
    try {
      const data = await getSchemeItems(schemeId)
      setSchemeItems(data)
    } catch (error) {
      console.error('加载方案项目失败:', error)
      message.error('加载方案项目失败')
    }
  }

  // 打开方案项目编辑对话框
  const openItemModal = (item?: SchemeItem) => {
    setEditingItem(item || null)
    if (item) {
      itemForm.setFieldsValue({
        jobCategoryId: item.jobCategoryId,
        itemName: item.itemName,
        description: item.description || undefined,
      })
    } else {
      itemForm.resetFields()
    }
    setItemModalVisible(true)
  }

  // 保存方案项目
  const handleSaveItem = async () => {
    if (!currentScheme) return

    try {
      const values = await itemForm.validateFields()

      const itemData = {
        jobCategoryId: values.jobCategoryId,
        itemName: values.itemName,
        description: values.description,
      }

      if (editingItem) {
        await updateSchemeItem(editingItem.id, itemData)
        message.success('方案项目更新成功')
      } else {
        await addSchemeItem({
          schemeId: currentScheme.id,
          ...itemData,
        })
        message.success('方案项目添加成功')
      }

      setItemModalVisible(false)
      itemForm.resetFields()
      await loadSchemeItems(currentScheme.id)
    } catch (error: any) {
      console.error('保存方案项目失败:', error)
      message.error(error.message || '保存方案项目失败')
    }
  }

  // 删除方案项目
  const handleDeleteItem = async (id: number) => {
    if (!currentScheme) return

    try {
      await deleteSchemeItem(id)
      message.success('方案项目删除成功')
      await loadSchemeItems(currentScheme.id)
    } catch (error: any) {
      console.error('删除方案项目失败:', error)
      message.error(error.message || '删除方案项目失败')
    }
  }

  // 方案表格列定义
  const columns: ColumnsType<Scheme> = [
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
            title="确定要删除这个方案吗?"
            onConfirm={() => handleDeleteScheme(record.id)}
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
      title: '方案名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '方案编码',
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

  // 方案项目表格列定义
  const itemColumns: ColumnsType<SchemeItem> = [
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
      title: '作业类别',
      dataIndex: ['jobCategory', 'name'],
      key: 'jobCategoryName',
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
    <Card title="方案管理">
      {/* 搜索表单 */}
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col>
            <Form.Item label="方案名称:" name="name">
              <Input placeholder="请输入方案名称" allowClear style={{ width: 200 }} />
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
            title="确定要删除选中的方案吗?"
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

      {/* 方案表格 */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={schemes}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      {/* 创建/编辑方案对话框 */}
      <Modal
        title={editingScheme ? '编辑方案' : '新增方案'}
        open={modalVisible}
        onOk={handleSaveScheme}
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
            label="方案名称:"
            name="name"
            rules={[{ required: true, message: '请输入方案名称' }]}
          >
            <Input placeholder="请输入方案名称" />
          </Form.Item>

          <Form.Item
            label="方案编码:"
            name="code"
            rules={[{ required: true, message: '请输入方案编码' }]}
          >
            <Input placeholder="请输入方案编码" disabled={!!editingScheme} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 方案项目抽屉 */}
      <Drawer
        title={`方案项目 - ${currentScheme?.name || ''}`}
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
          dataSource={schemeItems}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Drawer>

      {/* 创建/编辑方案项目对话框 */}
      <Modal
        title={editingItem ? '编辑方案项目' : '新增方案项目'}
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
            label="作业类别:"
            name="jobCategoryId"
            rules={[{ required: true, message: '请选择作业类别' }]}
          >
            <Select
              placeholder="请选择作业类别"
              options={jobCategories.map((cat) => ({
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

export default Schemes
