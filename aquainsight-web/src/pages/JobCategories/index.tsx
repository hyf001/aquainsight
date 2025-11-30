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
  InputNumber,
  message,
  Popconfirm,
  Row,
  Col,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getJobCategoryList,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
  batchDeleteJobCategories,
  type JobCategory,
} from '@/services/maintenance'

const PHOTO_TYPE_OPTIONS = [
  { label: '故障处理照片', value: '故障处理照片' },
  { label: '仪器设备照片', value: '仪器设备照片' },
  { label: '采样照片', value: '采样照片' },
  { label: '数采仪数据照片', value: '数采仪数据照片' },
  { label: '站点全景照片', value: '站点全景照片' },
  { label: '台账本照片', value: '台账本照片' },
  { label: '故障单照片', value: '故障单照片' },
  { label: '更换配件前照片', value: '更换配件前照片' },
  { label: '设备校准记录照片', value: '设备校准记录照片' },
  { label: '对比记录单照片', value: '对比记录单照片' },
  { label: '更换配件后照片', value: '更换配件后照片' },
  { label: '核查记录照片', value: '核查记录照片' },
]

const JobCategories: React.FC = () => {
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingJobCategory, setEditingJobCategory] = useState<JobCategory | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchName, setSearchName] = useState('')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  // 加载作业类别列表
  const loadJobCategories = async (name?: string) => {
    setLoading(true)
    try {
      const data = await getJobCategoryList(name)
      setJobCategories(data)
    } catch (error) {
      console.error('加载作业类别列表失败:', error)
      message.error('加载作业类别列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobCategories()
  }, [])

  // 打开创建/编辑对话框
  const openModal = (jobCategory?: JobCategory) => {
    setEditingJobCategory(jobCategory || null)
    if (jobCategory) {
      // 将逗号分隔的字符串转换为数组
      const photoTypesArray = jobCategory.photoTypes
        ? jobCategory.photoTypes.split(',').map((item) => item.trim())
        : []

      form.setFieldsValue({
        name: jobCategory.name,
        code: jobCategory.code,
        needPhoto: jobCategory.needPhoto,
        photoTypes: photoTypesArray,
        overdueDays: jobCategory.overdueDays,
        description: jobCategory.description || undefined,
      })
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 保存作业类别
  const handleSaveJobCategory = async () => {
    try {
      const values = await form.validateFields()

      // 将照片类型数组转换为逗号分隔的字符串
      const photoTypesString = values.photoTypes
        ? values.photoTypes.join(',')
        : undefined

      const requestData = {
        ...values,
        photoTypes: photoTypesString,
      }

      if (editingJobCategory) {
        await updateJobCategory(editingJobCategory.id, requestData)
        message.success('作业类别更新成功')
      } else {
        await createJobCategory(requestData)
        message.success('作业类别创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      loadJobCategories(searchName)
    } catch (error: any) {
      console.error('保存作业类别失败:', error)
      message.error(error.message || '保存作业类别失败')
    }
  }

  // 删除作业类别
  const handleDeleteJobCategory = async (id: number) => {
    try {
      await deleteJobCategory(id)
      message.success('作业类别删除成功')
      loadJobCategories(searchName)
    } catch (error: any) {
      console.error('删除作业类别失败:', error)
      message.error(error.message || '删除作业类别失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的作业类别')
      return
    }

    try {
      await batchDeleteJobCategories(selectedRowKeys as number[])
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadJobCategories(searchName)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      message.error(error.message || '批量删除失败')
    }
  }

  // 搜索
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setSearchName(values.name || '')
    loadJobCategories(values.name)
  }

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields()
    setSearchName('')
    loadJobCategories()
  }

  // 表格列定义
  const columns: ColumnsType<JobCategory> = [
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
      width: 80,
      align: 'center',
      render: (_text, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这个作业类别吗?"
            onConfirm={() => handleDeleteJobCategory(record.id)}
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
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 180,
    },
    {
      title: '是否需要拍照',
      dataIndex: 'needPhoto',
      key: 'needPhoto',
      width: 120,
      align: 'center',
      render: (needPhoto) => (
        <Tag color={needPhoto === 1 ? 'green' : 'default'}>
          {needPhoto === 1 ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '照片类型',
      dataIndex: 'photoTypes',
      key: 'photoTypes',
      width: 200,
      ellipsis: true,
      render: (photoTypes) => photoTypes || '/',
    },
    {
      title: '逾期天数(天)',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 120,
      align: 'center',
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
    <Card title="任务名称">
      {/* 搜索表单 */}
      <Form
        form={searchForm}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16} style={{ width: '100%' }}>
          <Col>
            <Form.Item label="任务名称:" name="name">
              <Input placeholder="请输入任务名称" allowClear style={{ width: 200 }} />
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
            title="确定要删除选中的作业类别吗?"
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

      {/* 作业类别表格 */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={jobCategories}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      {/* 创建/编辑对话框 */}
      <Modal
        title="编辑任务类别"
        open={modalVisible}
        onOk={handleSaveJobCategory}
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
            label="任务名称:"
            name="name"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="例行" />
          </Form.Item>

          <Form.Item
            label="任务类别编码:"
            name="code"
            rules={[{ required: true, message: '请输入任务类别编码' }]}
          >
            <Input placeholder="routine" disabled={!!editingJobCategory} />
          </Form.Item>

          <Form.Item
            label="是否需要拍照:"
            name="needPhoto"
            rules={[{ required: true, message: '请选择是否需要拍照' }]}
          >
            <Select
              placeholder="是"
              options={[
                { label: '是', value: 1 },
                { label: '否', value: 0 },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="照片类型:"
            name="photoTypes"
          >
            <Select
              mode="multiple"
              placeholder="请选择照片类型"
              options={PHOTO_TYPE_OPTIONS}
              maxTagCount={2}
            />
          </Form.Item>

          <Form.Item
            label="逾期天数(天):"
            name="overdueDays"
            rules={[{ required: true, message: '请输入逾期天数' }]}
          >
            <InputNumber
              placeholder="0"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="项说明:"
            name="description"
          >
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

export default JobCategories
