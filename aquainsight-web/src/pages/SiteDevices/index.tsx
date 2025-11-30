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
  DatePicker,
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
import dayjs from 'dayjs'
import {
  getDeviceList,
  createDevice,
  updateDevice,
  deleteDevice,
  getAllDeviceModels,
  getSiteList,
  type Device,
  type DeviceModel,
  type Site,
  type PageResult,
} from '@/services/monitoring'

const SiteDevices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([])
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [filters, setFilters] = useState({
    enterpriseName: '',
    siteId: undefined as number | undefined,
    deviceModelId: undefined as number | undefined,
  })
  const [form] = Form.useForm()

  // Load devices
  const loadDevices = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getDeviceList(
        pageNum,
        pageSize,
        filters.siteId,
        filters.deviceModelId
      )
      setDevices(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize })
    } catch (error) {
      console.error('加载设备列表失败:', error)
      message.error('加载设备列表失败')
    } finally {
      setLoading(false)
    }
  }

  // Load device models
  const loadDeviceModels = async () => {
    try {
      const data = await getAllDeviceModels()
      setDeviceModels(data)
    } catch (error) {
      console.error('加载设备型号失败:', error)
    }
  }

  // Load sites
  const loadSites = async () => {
    try {
      const data = await getSiteList(1, 100)
      setSites(data.list)
    } catch (error) {
      console.error('加载站点列表失败:', error)
    }
  }

  useEffect(() => {
    loadDevices(1, 10)
    loadDeviceModels()
    loadSites()
  }, [])

  // Open create/edit modal
  const openModal = (device?: Device) => {
    setEditingDevice(device || null)
    if (device) {
      form.setFieldsValue({
        deviceCode: device.deviceCode,
        deviceName: device.deviceName,
        siteId: device.siteId,
        deviceModelId: device.deviceModelId,
        serialNumber: device.serialNumber || undefined,
        installLocation: device.installLocation || undefined,
        status: device.status,
        installDate: device.installDate ? dayjs(device.installDate) : undefined,
        maintenanceDate: device.maintenanceDate ? dayjs(device.maintenanceDate) : undefined,
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // Save device
  const handleSaveDevice = async () => {
    try {
      const values = await form.validateFields()
      const data = {
        ...values,
        installDate: values.installDate ? values.installDate.format('YYYY-MM-DD') : undefined,
        maintenanceDate: values.maintenanceDate ? values.maintenanceDate.format('YYYY-MM-DD') : undefined,
      }

      if (editingDevice) {
        await updateDevice(editingDevice.id, data)
        message.success('更新成功')
      } else {
        await createDevice(data)
        message.success('创建成功')
      }
      setModalVisible(false)
      loadDevices(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存设备失败:', error)
    }
  }

  // Delete device
  const handleDeleteDevice = async (id: number) => {
    try {
      await deleteDevice(id)
      message.success('删除成功')
      loadDevices(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除设备失败:', error)
    }
  }

  // Delete multiple devices
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的设备')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteDevice(id as number)
      }
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadDevices(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }

  // Handle filter
  const handleFilter = () => {
    loadDevices(1, 10)
  }

  // Table columns
  const columns: ColumnsType<Device> = [
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
            description="确定要删除该设备吗？"
            onConfirm={() => handleDeleteDevice(record.id)}
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
      title: '设备编号',
      dataIndex: 'deviceCode',
      key: 'deviceCode',
      width: 120,
    },
    {
      title: '所在站点',
      dataIndex: 'siteName',
      key: 'siteName',
      render: (text) => text || '-',
    },
    {
      title: '设备类型',
      dataIndex: 'modelName',
      key: 'modelName',
      render: (text) => text || '-',
    },
    {
      title: '量程',
      dataIndex: 'range',
      key: 'range',
      render: (text) => text || '-',
    },
    {
      title: '关联因子',
      dataIndex: 'factorName',
      key: 'factorName',
      render: (text) => text || '-',
    },
    {
      title: '规格参数',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      render: (text) => text || '-',
    },
    {
      title: '制造商',
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
          <Col span={6}>
            <Input
              placeholder="企业名称"
              value={filters.enterpriseName}
              onChange={(e) => setFilters({ ...filters, enterpriseName: e.target.value })}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择站点"
              allowClear
              value={filters.siteId}
              onChange={(value) => setFilters({ ...filters, siteId: value })}
              options={sites.map(s => ({
                label: s.siteName,
                value: s.id,
              }))}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择设备类型"
              allowClear
              value={filters.deviceModelId}
              onChange={(value) => setFilters({ ...filters, deviceModelId: value })}
              options={deviceModels.map(m => ({
                label: m.modelName,
                value: m.id,
              }))}
            />
          </Col>
          <Col span={6}>
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
              description="确定要删除选中的设备吗？"
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

        {/* 设备表格 */}
        <Table
          columns={columns}
          dataSource={devices}
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
              loadDevices(page, pageSize)
              setPagination({ current: page, pageSize })
            },
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingDevice ? '编辑设备' : '新增设备'}
        open={modalVisible}
        onOk={handleSaveDevice}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="deviceCode"
            label="设备编号"
            rules={[{ required: true, message: '请输入设备编号' }]}
          >
            <Input placeholder="请输入设备编号" />
          </Form.Item>
          <Form.Item
            name="deviceName"
            label="设备名称"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item
            name="siteId"
            label="所在站点"
            rules={[{ required: true, message: '请选择站点' }]}
          >
            <Select
              placeholder="请选择站点"
              options={sites.map(s => ({
                label: s.siteName,
                value: s.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="deviceModelId"
            label="设备类型"
            rules={[{ required: true, message: '请选择设备类型' }]}
          >
            <Select
              placeholder="请选择设备类型"
              options={deviceModels.map(m => ({
                label: m.modelName,
                value: m.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="serialNumber" label="序列号">
            <Input placeholder="请输入序列号" />
          </Form.Item>
          <Form.Item name="installLocation" label="安装位置">
            <Input placeholder="请输入安装位置" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select
              options={[
                { label: '在线', value: 1 },
                { label: '离线', value: 0 },
                { label: '故障', value: 2 },
              ]}
            />
          </Form.Item>
          <Form.Item name="installDate" label="安装日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maintenanceDate" label="维护日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SiteDevices
