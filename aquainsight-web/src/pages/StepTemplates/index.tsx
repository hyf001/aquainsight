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
  Radio,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  MinusCircleOutlined,
  EyeOutlined,
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
import StepParameterFormItem from '@/components/StepParameterForm'

const PARAMETER_TYPE_OPTIONS = [
  { label: '文本', value: 'TEXT' },
  { label: '图片', value: 'IMAGE' },
  { label: '下拉框', value: 'SELECT' },
  { label: '复选框', value: 'CHECKBOX' },
  { label: '单选框', value: 'RADIO' },
]

const StepTemplates: React.FC = () => {
  const [stepTemplates, setStepTemplates] = useState<StepTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [previewModalVisible, setPreviewModalVisible] = useState(false)
  const [editingStepTemplate, setEditingStepTemplate] = useState<StepTemplate | null>(null)
  const [previewStepTemplate, setPreviewStepTemplate] = useState<StepTemplate | null>(null)
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

  // 打开预览对话框
  const openPreviewModal = (stepTemplate: StepTemplate) => {
    setPreviewStepTemplate(stepTemplate)
    setPreviewModalVisible(true)
  }


  // 渲染参数类型标签
  const renderParameterType = (type: string) => {
    const typeMap: Record<string, { text: string; color: string }> = {
      TEXT: { text: '文本', color: 'blue' },
      IMAGE: { text: '图片', color: 'green' },
      SELECT: { text: '下拉框', color: 'cyan' },
      CHECKBOX: { text: '复选框', color: 'purple' },
      RADIO: { text: '单选框', color: 'orange' },
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
      width: 120,
      align: 'center',
      render: (_text, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openPreviewModal(record)}
            title="查看表单"
          />
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
        width={1200}
        okText="保存"
        cancelText="关闭"
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
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

          <Form.Item label="参数列表" style={{ marginBottom: 16 }}>
            <Form.List name="parameters">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    const paramType = form.getFieldValue(['parameters', name, 'type'])
                    const needsOptions = ['SELECT', 'CHECKBOX', 'RADIO'].includes(paramType)

                    return (
                      <Card
                        key={key}
                        size="small"
                        style={{ marginBottom: 12, backgroundColor: '#fafafa' }}
                        extra={
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ color: 'red', cursor: 'pointer', fontSize: 16 }}
                          />
                        }
                      >
                        {/* 基础信息 */}
                        <Row gutter={16}>
                          <Col span={7}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              label="参数名称"
                              rules={[{ required: true, message: '必填' }]}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input placeholder="例: checkResult" />
                            </Form.Item>
                          </Col>
                          <Col span={7}>
                            <Form.Item
                              {...restField}
                              name={[name, 'label']}
                              label="显示标签"
                              rules={[{ required: true, message: '必填' }]}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input placeholder="例: 是否检查" />
                            </Form.Item>
                          </Col>
                          <Col span={7}>
                            <Form.Item
                              {...restField}
                              name={[name, 'type']}
                              label="参数类型"
                              rules={[{ required: true, message: '必填' }]}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Select
                                placeholder="选择类型"
                                options={PARAMETER_TYPE_OPTIONS}
                                onChange={() => {
                                  // 切换类型时清空选项配置
                                  form.setFieldValue(['parameters', name, 'options'], undefined)
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={3}>
                            <Form.Item
                              {...restField}
                              name={[name, 'required']}
                              valuePropName="checked"
                              initialValue={false}
                              label=" "
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Checkbox>必填</Checkbox>
                            </Form.Item>
                          </Col>
                        </Row>

                        {/* TEXT类型的额外配置 */}
                        {paramType === 'TEXT' && (
                          <Row gutter={16}>
                            <Col span={9}>
                              <Form.Item
                                {...restField}
                                name={[name, 'placeholder']}
                                label="占位符"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input placeholder="请输入占位符" />
                              </Form.Item>
                            </Col>
                            <Col span={9}>
                              <Form.Item
                                {...restField}
                                name={[name, 'defaultValue']}
                                label="默认值"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input placeholder="默认值" />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item
                                {...restField}
                                name={[name, 'minLength']}
                                label="最小长度"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <InputNumber placeholder="0" min={0} style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item
                                {...restField}
                                name={[name, 'maxLength']}
                                label="最大长度"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <InputNumber placeholder="100" min={0} style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}

                        {/* CHECKBOX类型的额外配置 */}
                        {paramType === 'CHECKBOX' && (
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'minSelect']}
                                label="最小选择数"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <InputNumber placeholder="0" min={0} style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'maxSelect']}
                                label="最大选择数"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <InputNumber placeholder="不限" min={0} style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}

                        {/* 提示信息 */}
                        <Row gutter={16}>
                          <Col span={24}>
                            <Form.Item
                              {...restField}
                              name={[name, 'hint']}
                              label="提示信息"
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input.TextArea placeholder="给用户的提示说明" rows={2} />
                            </Form.Item>
                          </Col>
                        </Row>

                        {/* SELECT/CHECKBOX/RADIO的选项配置 */}
                        {needsOptions && (
                          <Form.Item label="选项配置" style={{ marginBottom: 0 }}>
                            <Form.List name={[name, 'options']}>
                              {(optionFields, { add: addOption, remove: removeOption }) => (
                                <>
                                  {optionFields.map(({ key: optionKey, name: optionName, ...optionRestField }) => (
                                    <Space key={optionKey} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'label']}
                                        rules={[{ required: true, message: '必填' }]}
                                        style={{ marginBottom: 0, width: 140 }}
                                      >
                                        <Input placeholder="显示文本" />
                                      </Form.Item>
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'value']}
                                        rules={[{ required: true, message: '必填' }]}
                                        style={{ marginBottom: 0, width: 140 }}
                                      >
                                        <Input placeholder="选项值" />
                                      </Form.Item>
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'defaultSelected']}
                                        valuePropName="checked"
                                        initialValue={false}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <Checkbox>默认选中</Checkbox>
                                      </Form.Item>
                                      <Form.Item
                                        {...optionRestField}
                                        name={[optionName, 'disabled']}
                                        valuePropName="checked"
                                        initialValue={false}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <Checkbox>禁用</Checkbox>
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        onClick={() => removeOption(optionName)}
                                        style={{ color: 'red' }}
                                      />
                                    </Space>
                                  ))}
                                  <Form.Item style={{ marginBottom: 0 }}>
                                    <Button
                                      type="dashed"
                                      onClick={() => addOption()}
                                      block
                                      icon={<PlusOutlined />}
                                      size="small"
                                    >
                                      添加选项
                                    </Button>
                                  </Form.Item>
                                </>
                              )}
                            </Form.List>
                          </Form.Item>
                        )}
                      </Card>
                    )
                  })}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="dashed"
                      onClick={() => add({ type: 'TEXT', required: false })}
                      block
                      icon={<PlusOutlined />}
                    >
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

      {/* 表单预览对话框 */}
      <Modal
        title={`表单预览 - ${previewStepTemplate?.name || ''}`}
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {previewStepTemplate && (
          <div style={{ padding: '16px 0' }}>
            {previewStepTemplate.parameters && previewStepTemplate.parameters.length > 0 ? (
              previewStepTemplate.parameters.map((param, index) => (
                <StepParameterFormItem
                  key={index}
                  parameter={param}
                  stepTemplateId={previewStepTemplate.id}
                  preview={true}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                该步骤模版暂无参数配置
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default StepTemplates
