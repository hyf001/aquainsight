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
  LinkOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getEnterpriseList,
  createEnterprise,
  updateEnterprise,
  deleteEnterprise,
  type Enterprise,
} from '@/services/enterprise'

const ENTERPRISE_TAGS = [
  { label: '非国控', value: '非国控' },
  { label: '国控', value: '国控' },
]

const Enterprises: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [filters, setFilters] = useState({
    enterpriseName: '',
    enterpriseTag: undefined as string | undefined,
  })
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  // 加载企业列表
  const loadEnterprises = async (pageNum: number = 1, pageSize: number = 10) => {
    setLoading(true)
    try {
      const data = await getEnterpriseList(
        pageNum,
        pageSize,
        filters.enterpriseName,
        filters.enterpriseTag
      )
      setEnterprises(data.list)
      setTotal(data.total)
      setPagination({ current: data.pageNum, pageSize: data.pageSize })
    } catch (error) {
      console.error('加载企业列表失败:', error)
      message.error('加载企业列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnterprises(1, 10)
  }, [])

  // 打开创建/编辑对话框
  const openModal = (enterprise?: Enterprise) => {
    setEditingEnterprise(enterprise || null)
    if (enterprise) {
      form.setFieldsValue({
        enterpriseName: enterprise.enterpriseName,
        enterpriseCode: enterprise.enterpriseCode,
        enterpriseTag: enterprise.enterpriseTag || undefined,
        contactPerson: enterprise.contactPerson || undefined,
        contactPhone: enterprise.contactPhone || undefined,
        address: enterprise.address || undefined,
        description: enterprise.description || undefined,
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 保存企业
  const handleSaveEnterprise = async () => {
    try {
      const values = await form.validateFields()

      if (editingEnterprise) {
        await updateEnterprise(editingEnterprise.id, values)
        message.success('企业更新成功')
      } else {
        await createEnterprise(values)
        message.success('企业创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      loadEnterprises(pagination.current, pagination.pageSize)
    } catch (error: any) {
      console.error('保存企业失败:', error)
      message.error(error.message || '保存企业失败')
    }
  }

  // 删除企业
  const handleDeleteEnterprise = async (id: number) => {
    try {
      await deleteEnterprise(id)
      message.success('企业删除成功')
      loadEnterprises(pagination.current, pagination.pageSize)
    } catch (error: any) {
      console.error('删除企业失败:', error)
      message.error(error.message || '删除企业失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的企业')
      return
    }

    try {
      await Promise.all(selectedRowKeys.map((id) => deleteEnterprise(id as number)))
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadEnterprises(pagination.current, pagination.pageSize)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      message.error(error.message || '批量删除失败')
    }
  }

  // 搜索
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setFilters(values)
    loadEnterprises(1, pagination.pageSize)
  }

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields()
    setFilters({
      enterpriseName: '',
      enterpriseTag: undefined,
    })
    setTimeout(() => {
      loadEnterprises(1, pagination.pageSize)
    }, 0)
  }

  // 表格列定义
  const columns: ColumnsType<Enterprise> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_text, _record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      },
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: 200,
    },
    {
      title: '统一社会信用编码',
      dataIndex: 'enterpriseCode',
      key: 'enterpriseCode',
      width: 180,
    },
    {
      title: '站点数量',
      dataIndex: 'siteCount',
      key: 'siteCount',
      width: 100,
      align: 'center',
    },
    {
      title: '企业标签',
      dataIndex: 'enterpriseTag',
      key: 'enterpriseTag',
      width: 100,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 140,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_text, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<LinkOutlined />}
            onClick={() => {
              // TODO: 跳转到相关站点页面
              message.info('查看相关站点功能开发中')
            }}
          >
            相关站点
          </Button>
          <Popconfirm
            title="确定要删除这个企业吗?"
            onConfirm={() => handleDeleteEnterprise(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      {/* 搜索表单 */}
      <Form
        form={searchForm}
        layout="inline"
        style={{ marginBottom: 16 }}
        initialValues={filters}
      >
        <Row gutter={16} style={{ width: '100%' }}>
          <Col>
            <Form.Item label="企业名称" name="enterpriseName">
              <Input placeholder="请输入企业名称" allowClear style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="企业标签" name="enterpriseTag">
              <Select
                placeholder="请选择企业标签"
                allowClear
                style={{ width: 150 }}
                options={ENTERPRISE_TAGS}
              />
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
              <Button onClick={handleReset}>重置</Button>
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
            title="确定要删除选中的企业吗?"
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

      {/* 企业表格 */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={enterprises}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, pageSize) => {
            loadEnterprises(page, pageSize)
          },
        }}
        scroll={{ x: 1200 }}
      />

      {/* 创建/编辑对话框 */}
      <Modal
        title={editingEnterprise ? '编辑企业' : '新增企业'}
        open={modalVisible}
        onOk={handleSaveEnterprise}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="企业名称"
            name="enterpriseName"
            rules={[{ required: true, message: '请输入企业名称' }]}
          >
            <Input placeholder="请输入企业名称" />
          </Form.Item>

          <Form.Item
            label="统一社会信用编码"
            name="enterpriseCode"
            rules={[
              { required: true, message: '请输入统一社会信用编码' },
              { len: 18, message: '统一社会信用编码应为18位' },
            ]}
          >
            <Input
              placeholder="请输入18位统一社会信用编码"
              maxLength={18}
              disabled={!!editingEnterprise}
            />
          </Form.Item>

          <Form.Item label="企业标签" name="enterpriseTag">
            <Select
              placeholder="请选择企业标签"
              allowClear
              options={ENTERPRISE_TAGS}
            />
          </Form.Item>

          <Form.Item label="联系人" name="contactPerson">
            <Input placeholder="请输入联系人" />
          </Form.Item>

          <Form.Item label="联系电话" name="contactPhone">
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item label="企业地址" name="address">
            <Input placeholder="请输入企业地址" />
          </Form.Item>

          <Form.Item label="企业描述" name="description">
            <Input.TextArea
              placeholder="请输入企业描述"
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

export default Enterprises
