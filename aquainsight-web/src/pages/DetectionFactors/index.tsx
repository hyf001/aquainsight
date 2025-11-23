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
  List,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getFactorList,
  createFactor,
  updateFactor,
  deleteFactor,
  getAllDeviceModels,
  type Factor,
  type DeviceModel,
  type PageResult,
} from '@/services/monitoring'

const CATEGORIES = [
  { key: 'water_quality', name: '水环境质量' },
  { key: 'air_quality', name: '大气环境质量' },
]

const DetectionFactors: React.FC = () => {
  const [factors, setFactors] = useState<Factor[]>([])
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingFactor, setEditingFactor] = useState<Factor | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].key)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // Load factors
  const loadFactors = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getFactorList(pageNum, pageSize, selectedCategory)
      setFactors(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize })
    } catch (error) {
      console.error('加载监测因子失败:', error)
      message.error('加载监测因子失败')
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

  useEffect(() => {
    loadFactors(1, 10)
    loadDeviceModels()
  }, [])

  // Change category
  const handleCategoryChange = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setSelectedRowKeys([])
    setSearchText('')
    loadFactors(1, 10)
  }

  // Open create/edit modal
  const openModal = (factor?: Factor) => {
    setEditingFactor(factor || null)
    if (factor) {
      form.setFieldsValue({
        factorCode: factor.factorCode,
        nationalCode: factor.nationalCode || undefined,
        factorName: factor.factorName,
        shortName: factor.shortName || undefined,
        deviceModelId: factor.deviceModelId,
        category: factor.category || selectedCategory,
        unit: factor.unit || undefined,
        upperLimit: factor.upperLimit || undefined,
        lowerLimit: factor.lowerLimit || undefined,
        precisionDigits: factor.precisionDigits || 2,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ category: selectedCategory, precisionDigits: 2 })
    }
    setModalVisible(true)
  }

  // Save factor
  const handleSaveFactor = async () => {
    try {
      const values = await form.validateFields()
      if (editingFactor) {
        await updateFactor(editingFactor.id, values)
        message.success('更新成功')
      } else {
        await createFactor(values)
        message.success('创建成功')
      }
      setModalVisible(false)
      loadFactors(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存监测因子失败:', error)
    }
  }

  // Delete factor
  const handleDeleteFactor = async (id: number) => {
    try {
      await deleteFactor(id)
      message.success('删除成功')
      loadFactors(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除监测因子失败:', error)
    }
  }

  // Delete multiple factors
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的因子')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteFactor(id as number)
      }
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadFactors(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }

  // Handle search
  const handleSearch = () => {
    loadFactors(1, 10)
  }

  // Filter factors by search text
  const filteredFactors = searchText.trim()
    ? factors.filter(
        f =>
          f.factorCode?.includes(searchText) ||
          f.factorName?.includes(searchText)
      )
    : factors

  // Table columns
  const columns: ColumnsType<Factor> = [
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
            description="确定要删除该因子吗？"
            onConfirm={() => handleDeleteFactor(record.id)}
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
      title: '因子代码',
      dataIndex: 'factorCode',
      key: 'factorCode',
      width: 120,
    },
    {
      title: '国标代码',
      dataIndex: 'nationalCode',
      key: 'nationalCode',
      render: (text) => text || '-',
    },
    {
      title: '因子名称',
      dataIndex: 'factorName',
      key: 'factorName',
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      key: 'shortName',
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
      <Row gutter={16}>
        {/* 左侧因子类别 */}
        <Col span={4}>
          <Card
            title="因子类别"
            size="small"
            bodyStyle={{ padding: '8px 16px' }}
          >
            <List
              dataSource={CATEGORIES}
              renderItem={(category) => (
                <List.Item
                  key={category.key}
                  style={{
                    padding: '8px 0',
                    cursor: 'pointer',
                    paddingLeft: 12,
                    borderLeft:
                      selectedCategory === category.key ? '3px solid #1890ff' : '3px solid transparent',
                    backgroundColor:
                      selectedCategory === category.key ? '#f0f5ff' : 'transparent',
                  }}
                  onClick={() => handleCategoryChange(category.key)}
                >
                  {category.name}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 右侧因子列表 */}
        <Col span={20}>
          <Card size="small" bodyStyle={{ padding: 16 }}>
            {/* 搜索栏 */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <span>因子代码/名称：</span>
                <Input
                  placeholder="请输入因子代码或名称"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                  onPressEnter={handleSearch}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  查询
                </Button>
              </Space>
            </div>

            {/* 操作按钮 */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                  新增
                </Button>
                <Popconfirm
                  title="确认删除"
                  description="确定要删除选中的因子吗？"
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

            {/* 因子表格 */}
            <Table
              columns={columns}
              dataSource={filteredFactors}
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
                  loadFactors(page, pageSize)
                  setPagination({ current: page, pageSize })
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingFactor ? '编辑因子' : '新增因子'}
        open={modalVisible}
        onOk={handleSaveFactor}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="factorCode"
            label="因子代码"
            rules={[{ required: true, message: '请输入因子代码' }]}
          >
            <Input placeholder="请输入因子代码" />
          </Form.Item>
          <Form.Item name="nationalCode" label="国标代码">
            <Input placeholder="请输入国标代码" />
          </Form.Item>
          <Form.Item
            name="factorName"
            label="因子名称"
            rules={[{ required: true, message: '请输入因子名称' }]}
          >
            <Input placeholder="请输入因子名称" />
          </Form.Item>
          <Form.Item name="shortName" label="简称">
            <Input placeholder="请输入简称" />
          </Form.Item>
          <Form.Item
            name="deviceModelId"
            label="关联设备型号"
            rules={[{ required: true, message: '请选择设备型号' }]}
          >
            <Select
              placeholder="请选择设备型号"
              options={deviceModels.map(m => ({
                label: m.modelName,
                value: m.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="category" label="类别">
            <Select
              placeholder="请选择类别"
              options={CATEGORIES.map(c => ({
                label: c.name,
                value: c.key,
              }))}
            />
          </Form.Item>
          <Form.Item name="unit" label="单位">
            <Input placeholder="请输入单位" />
          </Form.Item>
          <Form.Item name="upperLimit" label="上限">
            <Input placeholder="请输入上限值" />
          </Form.Item>
          <Form.Item name="lowerLimit" label="下限">
            <Input placeholder="请输入下限值" />
          </Form.Item>
          <Form.Item name="precisionDigits" label="精度" initialValue={2}>
            <Input type="number" placeholder="请输入精度数字" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DetectionFactors
