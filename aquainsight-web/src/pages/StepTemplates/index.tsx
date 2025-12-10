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
  Checkbox,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  getStepTemplateList,
  createStepTemplate,
  updateStepTemplate,
  deleteStepTemplate,
  batchDeleteJobCategories,
  type StepTemplate,
  type JobParameter,
} from '@/services/maintenance'

const PARAMETER_TYPE_OPTIONS = [
  { label: '文本', value: 'TEXT' },
  { label: '图片', value: 'IMAGE' },
  { label: '文本列表', value: 'TEXT_LIST' },
  { label: '图片列表', value: 'IMAGE_LIST' },
]

const StepTemplates: React.FC = () => {
  const [stepTemplates, setStepTemplates] = useState<StepTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingStepTemplate, setEditingStepTemplate] = useState<StepTemplate | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchName, setSearchName] = useState('')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  // 加载步骤模版列表
  const loadStepTemplates = async (name?: string) => {
    setLoading(true)
    try {
      const data = await getStepTemplateList(name)
      setStepTemplates(data)
    } catch (error) {
      console.error('加载步骤模版列表失败:', error)
      message.error('加载步骤模版列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStepTemplates()
  }, [])

  // 打开创建/编辑对话框
  const openModal = (stepTemplate?: StepTemplate) => {
    setEditingStepTemplate(stepTemplate || null)
    if (stepTemplate) {
      form.setFieldsValue({
        name: stepTemplate.name,
        code: stepTemplate.code,
        parameters: stepTemplate.parameters || [],
        overdueDays: stepTemplate.overdueDays,
        description: stepTemplate.description || undefined,
      })
    } else {
      form.resetFields()
      // 设置默认值：一个空参数
      form.setFieldsValue({
        parameters: [{ name: '', type: 'TEXT', required: false }],
      })
    }
    setModalVisible(true)
  }

  // 保存步骤模版
  const handleSaveStepTemplate = async () => {
    try {
      const values = await form.validateFields()
      const requestData = { ...values }

      if (editingStepTemplate) {
        await updateStepTemplate(editingStepTemplate.id, requestData)
        message.success('步骤模版更新成功')
      } else {
        await createStepTemplate(requestData)
        message.success('步骤模版创建成功')
      }

      setModalVisible(false)
      form.resetFields()
      loadStepTemplates(searchName)
    } catch (error: any) {
      console.error('保存步骤模版失败:', error)
      message.error(error.message || '保存步骤模版失败')
    }
  }

  // 删除步骤模版
  const handleDeleteStepTemplate = async (id: number) => {
    try {
      await deleteStepTemplate(id)
      message.success('步骤模版删除成功')
      loadStepTemplates(searchName)
    } catch (error: any) {
      console.error('删除步骤模版失败:', error)
      message.error(error.message || '删除步骤模版失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的步骤模版')
      return
    }

    try {
      await batchDeleteJobCategories(selectedRowKeys as number[])
      message.success('批量删除成功')
      setSelectedRowKeys([])
      loadStepTemplates(searchName)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      message.error(error.message || '批量删除失败')
    }
  }

  // 搜索
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setSearchName(values.name || '')
    loadStepTemplates(values.name)
  }


  // 渲染参数类型标签
  const renderParameterType = (type: string) => {
    const typeMap: Record<string, { text: string; color: string }> = {
      TEXT: { text: '文本', color: 'blue' },
      IMAGE: { text: '图片', color: 'green' },
      TEXT_LIST: { text: '文本列表', color: 'cyan' },
      IMAGE_LIST: { text: '图片列表', color: 'purple' },
    }
    const config = typeMap[type] || { text: type, color: 'default' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  // 表格列定义
  const columns: ColumnsType<StepTemplate> = [
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
            title="确定要删除这个步骤模版吗?"
            onConfirm={() => handleDeleteStepTemplate(record.id)}
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
      title: '参数配置',
      dataIndex: 'parameters',
      key: 'parameters',
      width: 300,
      render: (parameters: JobParameter[] | null) => {
        if (!parameters || parameters.length === 0) {
          return <span style={{ color: '#999' }}>无</span>
        }
        return (
          <Space size={4} wrap>
            {parameters.map((param, index) => (
              <Tag key={index} color={param.required ? 'red' : 'default'}>
                {param.name} {renderParameterType(param.type)} {param.required && '(必填)'}
              </Tag>
            ))}
          </Space>
        )
      },
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
            title="确定要删除选中的步骤模版吗?"
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

      {/* 步骤模版表格 */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={stepTemplates}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1200 }}
      />

      {/* 创建/编辑对话框 */}
      <Modal
        title={editingStepTemplate ? '编辑步骤模版' : '新增步骤模版'}
        open={modalVisible}
        onOk={handleSaveStepTemplate}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={700}
        okText="保存"
        cancelText="关闭"
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          autoComplete="off"
        >
          <Form.Item
            label="步骤名称"
            name="name"
            rules={[{ required: true, message: '请输入步骤名称' }]}
          >
            <Input placeholder="例行维护" />
          </Form.Item>

          <Form.Item
            label="步骤编码"
            name="code"
            rules={[{ required: true, message: '请输入步骤编码' }]}
          >
            <Input placeholder="routine_maintenance" disabled={!!editingStepTemplate} />
          </Form.Item>

          <Form.Item label="参数列表">
            <Form.List name="parameters">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: '请输入参数名称' }]}
                        style={{ marginBottom: 0, width: 150 }}
                      >
                        <Input placeholder="参数名称" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: '请选择类型' }]}
                        style={{ marginBottom: 0, width: 120 }}
                      >
                        <Select placeholder="类型" options={PARAMETER_TYPE_OPTIONS} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'required']}
                        valuePropName="checked"
                        initialValue={false}
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>必填</Checkbox>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加参数
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            label="逾期天数(天)"
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
            label="项说明"
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

export default StepTemplates
