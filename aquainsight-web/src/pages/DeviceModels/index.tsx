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
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getDeviceModelList,
  createDeviceModel,
  updateDeviceModel,
  deleteDeviceModel,
  type DeviceModel,
  type PageResult,
} from '@/services/monitoring'

const DeviceModels: React.FC = () => {
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingModel, setEditingModel] = useState<DeviceModel | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [filters, setFilters] = useState({
    modelName: '',
    deviceType: '',
  })
  const [form] = Form.useForm()

  // Load device models
  const loadDeviceModels = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getDeviceModelList(pageNum, pageSize, filters.deviceType)
      setDeviceModels(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize })
    } catch (error) {
      console.error('加载设备型号失败:', error)
      message.error('加载设备型号失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeviceModels(1, 10)
  }, [])

  // Open create/edit modal
  const openModal = (model?: DeviceModel) => {
    setEditingModel(model || null)
    if (model) {
      form.setFieldsValue({
        modelCode: model.modelCode,
        modelName: model.modelName,
        deviceType: model.deviceType || undefined,
        manufacturer: model.manufacturer || undefined,
        description: model.description || undefined,
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // Save device model
  const handleSaveModel = async () => {
    try {
      const values = await form.validateFields()
      if (editingModel) {
        await updateDeviceModel(editingModel.id, values)
        message.success('更新成功')
      } else {
        await createDeviceModel(values)
        message.success('创建成功')
      }
      setModalVisible(false)
      loadDeviceModels(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存设备型号失败:', error)
    }
  }

  // Delete device model
  const handleDeleteModel = async (id: number) => {
    try {
      await deleteDeviceModel(id)
      message.success('删除成功')
      loadDeviceModels(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除设备型号失败:', error)
    }
  }

  // Delete multiple device models
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的设备型号')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteDeviceModel(id as number)
      }
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadDeviceModels(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }

  // Handle filter
  const handleFilter = () => {
    loadDeviceModels(1, 10)
  }

  // Filter models by model name
  const filteredModels = filters.modelName.trim()
    ? deviceModels.filter(m =>
        m.modelName?.includes(filters.modelName) ||
        m.modelCode?.includes(filters.modelName)
      )
    : deviceModels

  // Table columns
  const columns: ColumnsType<DeviceModel> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <a onClick={() => openModal(record)}>
            <EditOutlined /> 编辑
          </a>
          <Popconfirm
            title="确认删除"
            description="确定要删除该设备型号吗？"
            onConfirm={() => handleDeleteModel(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#ff4d4f' }}>
              <DeleteOutlined /> 删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: '简称',
      dataIndex: 'modelCode',
      key: 'modelCode',
      width: 100,
    },
    {
      title: '设备类别',
      dataIndex: 'deviceType',
      key: 'deviceType',
      render: (text) => text || '-',
    },
    {
      title: '型号名称',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '规格参数',
      key: 'specs',
      render: () => '-',
    },
    {
      title: '关联因子',
      key: 'factors',
      render: () => '-',
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      render: (text) => text || '-',
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys)
    },
  }

  return (
    <div>
      <Card size="small" bodyStyle={{ padding: 16 }}>
        {/* 搜索栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="型号名称/代码"
              value={filters.modelName}
              onChange={(e) => setFilters({ ...filters, modelName: e.target.value })}
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="设备类别"
              value={filters.deviceType}
              onChange={(e) => setFilters({ ...filters, deviceType: e.target.value })}
            />
          </Col>
          <Col span={8}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleFilter}>
              查询
            </Button>
          </Col>
        </Row>

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
              新增
            </Button>
            <Popconfirm
              title="确认删除"
              description="确定要删除选中的设备型号吗？"
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        </div>

        {/* 设备型号表格 */}
        <Table
          columns={columns}
          dataSource={filteredModels}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          size="small"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              loadDeviceModels(page, pageSize)
              setPagination({ current: page, pageSize })
            },
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingModel ? '编辑设备型号' : '新增设备型号'}
        open={modalVisible}
        onOk={handleSaveModel}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="modelCode"
            label="设备代码(简称)"
            rules={[{ required: true, message: '请输入设备代码' }]}
          >
            <Input placeholder="请输入设备代码" />
          </Form.Item>
          <Form.Item
            name="modelName"
            label="型号名称"
            rules={[{ required: true, message: '请输入型号名称' }]}
          >
            <Input placeholder="请输入型号名称" />
          </Form.Item>
          <Form.Item name="deviceType" label="设备类别">
            <Input placeholder="请输入设备类别" />
          </Form.Item>
          <Form.Item name="manufacturer" label="生产厂商">
            <Input placeholder="请输入生产厂商" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DeviceModels
