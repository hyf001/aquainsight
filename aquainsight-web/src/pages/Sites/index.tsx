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
  Checkbox,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getSiteList,
  createSite,
  updateSite,
  deleteSite,
  type Site,
  type PageResult,
} from '@/services/monitoring'
import { getAllEnterprises, type Enterprise } from '@/services/enterprise'

const SITE_TYPES = [
  { label: '污水', value: 'wastewater' },
  { label: '雨水', value: 'rainwater' },
]

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [filters, setFilters] = useState({
    siteType: undefined as string | undefined,
    enterpriseId: undefined as number | undefined,
  })
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [form] = Form.useForm()

  // Load sites
  const loadSites = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getSiteList(pageNum, pageSize, filters.siteType, filters.enterpriseId)
      setSites(data.list)
      setPagination({ current: data.pageNum, pageSize: data.pageSize })
    } catch (error) {
      console.error('加载站点列表失败:', error)
      message.error('加载站点列表失败')
    } finally {
      setLoading(false)
    }
  }

  // Load enterprises
  const loadEnterprises = async () => {
    try {
      const data = await getAllEnterprises()
      setEnterprises(data)
    } catch (error) {
      console.error('加载企业列表失败:', error)
    }
  }

  useEffect(() => {
    loadSites(1, 10)
    loadEnterprises()
  }, [])

  // Open create/edit modal
  const openModal = (site?: Site) => {
    setEditingSite(site || null)
    if (site) {
      form.setFieldsValue({
        siteCode: site.siteCode,
        siteName: site.siteName,
        siteType: site.siteType || undefined,
        siteTag: site.siteTag || undefined,
        longitude: site.longitude || undefined,
        latitude: site.latitude || undefined,
        address: site.address || undefined,
        enterpriseId: site.enterpriseId || undefined,
        isAutoUpload: site.isAutoUpload === 1,
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // Save site
  const handleSaveSite = async () => {
    try {
      const values = await form.validateFields()
      const data = {
        ...values,
        isAutoUpload: values.isAutoUpload ? 1 : 0,
      }

      if (editingSite) {
        await updateSite(editingSite.id, data)
        message.success('更新成功')
      } else {
        await createSite(data)
        message.success('创建成功')
      }
      setModalVisible(false)
      loadSites(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('保存站点失败:', error)
    }
  }

  // Delete site
  const handleDeleteSite = async (id: number) => {
    try {
      await deleteSite(id)
      message.success('删除成功')
      loadSites(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除站点失败:', error)
    }
  }

  // Delete multiple sites
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的站点')
      return
    }
    try {
      for (const id of selectedRowKeys) {
        await deleteSite(id as number)
      }
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadSites(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }

  // Handle filter
  const handleFilter = () => {
    loadSites(1, 10)
  }

  // Table columns
  const columns: ColumnsType<Site> = [
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
            description="确定要删除该站点吗？"
            onConfirm={() => handleDeleteSite(record.id)}
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
      title: '站点编码',
      dataIndex: 'siteCode',
      key: 'siteCode',
      width: 120,
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      key: 'siteName',
    },
    {
      title: '站点类型',
      dataIndex: 'siteType',
      key: 'siteType',
      render: (text) => {
        if (text === 'wastewater') return '污水'
        if (text === 'rainwater') return '雨水'
        return text || '-'
      },
    },
    {
      title: '站点标签',
      dataIndex: 'siteTag',
      key: 'siteTag',
      render: (text) => text || '-',
    },
    {
      title: '所属企业',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      render: (text) => text || '-',
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
      render: (text) => text || '-',
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
      render: (text) => text || '-',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
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
            <Select
              placeholder="选择站点类型"
              allowClear
              value={filters.siteType}
              onChange={(value) => setFilters({ ...filters, siteType: value })}
              options={SITE_TYPES}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择企业"
              allowClear
              showSearch
              value={filters.enterpriseId}
              onChange={(value) => setFilters({ ...filters, enterpriseId: value })}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={enterprises.map((e) => ({
                label: e.enterpriseName,
                value: e.id,
              }))}
            />
          </Col>
          <Col span={12}>
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
              description="确定要删除选中的站点吗？"
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

        {/* 站点表格 */}
        <Table
          columns={columns}
          dataSource={sites}
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
              loadSites(page, pageSize)
              setPagination({ current: page, pageSize })
            },
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingSite ? '编辑站点' : '新增站点'}
        open={modalVisible}
        onOk={handleSaveSite}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="siteCode"
            label="站点编码"
            rules={[{ required: true, message: '请输入站点编码' }]}
          >
            <Input placeholder="请输入站点编码" />
          </Form.Item>
          <Form.Item
            name="siteName"
            label="站点名称"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input placeholder="请输入站点名称" />
          </Form.Item>
          <Form.Item name="siteType" label="站点类型">
            <Select
              placeholder="请选择站点类型"
              allowClear
              options={SITE_TYPES}
            />
          </Form.Item>
          <Form.Item name="siteTag" label="站点标签">
            <Input placeholder="请输入站点标签" />
          </Form.Item>
          <Form.Item name="longitude" label="经度">
            <Input placeholder="请输入经度" />
          </Form.Item>
          <Form.Item name="latitude" label="纬度">
            <Input placeholder="请输入纬度" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item name="enterpriseId" label="所属企业">
            <Select
              placeholder="请选择企业"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={enterprises.map((e) => ({
                label: e.enterpriseName,
                value: e.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="isAutoUpload" valuePropName="checked" initialValue={false}>
            <Checkbox>启用自动上传</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Sites
