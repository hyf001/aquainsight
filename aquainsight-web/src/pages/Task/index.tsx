import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Space,
  Tag,
  DatePicker,
  Modal,
  Form,
  Radio,
  Checkbox,
  Upload,
  Divider,
  Steps,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  SaveOutlined,
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import {
  getTaskPage,
  createManualJobInstance,
  getTaskDetail,
  processTask,
  type Task,
  type TaskDetail,
  type JobParameter,
  type StepData,
} from '@/services/maintenance'
import { getAllDepartments, type Department } from '@/services/organization'
import { getEnterpriseSiteTree, type EnterpriseSiteTree } from '@/services/monitoring'
import { getTaskTemplateList, type TaskTemplate } from '@/services/maintenance'
import StepParameterFormItem from '@/components/StepParameterForm'

const { RangePicker } = DatePicker

// 任务状态映射
const STATUS_MAP: { [key: string]: { text: string; color: string } } = {
  PENDING: { text: '待处理', color: 'default' },
  IN_PROGRESS: { text: '进行中', color: 'processing' },
  COMPLETED: { text: '已完成', color: 'success' },
  OVERDUE: { text: '已逾期', color: 'error' },
  CANCELLED: { text: '已取消', color: 'warning' },
  EXPIRING: { text: '即将逾期', color: 'warning' },
}

const TaskExecution: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 部门列表
  const [departments, setDepartments] = useState<Department[]>([])

  // 新建任务弹窗相关
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createForm] = Form.useForm()

  // 处理任务弹窗相关
  const [processModalVisible, setProcessModalVisible] = useState(false)
  const [processLoading, setProcessLoading] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null)
  const [processForm] = Form.useForm()
  const [currentStepIndex, setCurrentStepIndex] = useState(0) // 当前步骤索引

  // 站点树列表
  const [enterpriseSiteTree, setEnterpriseSiteTree] = useState<EnterpriseSiteTree[]>([])
  // 任务模版列表
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([])

  // 搜索条件（表单输入）
  const [searchForm, setSearchForm] = useState({
    siteName: '',
    status: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
    creator: '',
    departmentId: undefined as number | undefined,
  })

  // 实际查询条件（点击查询后生效）
  const [queryParams, setQueryParams] = useState({
    siteName: undefined as string | undefined,
    status: undefined as string | undefined,
    startTime: undefined as string | undefined,
    endTime: undefined as string | undefined,
    creator: undefined as string | undefined,
    departmentId: undefined as number | undefined,
  })

  // 加载任务列表
  const loadTask = async () => {
    setLoading(true)
    try {
      const response = await getTaskPage({
        pageNum,
        pageSize,
        ...queryParams,
      })

      setTasks(response.list || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('加载任务列表失败:', error)
      message.error('加载任务列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments()
      setDepartments(data)
    } catch (error) {
      console.error('加载部门列表失败:', error)
    }
  }

  // 加载站点树
  const loadEnterpriseSiteTree = async () => {
    try {
      const data = await getEnterpriseSiteTree()
      setEnterpriseSiteTree(data)
    } catch (error) {
      console.error('加载站点列表失败:', error)
    }
  }

  // 加载任务模版列表
  const loadTaskTemplates = async () => {
    try {
      const data = await getTaskTemplateList()
      setTaskTemplates(data)
    } catch (error) {
      console.error('加载任务模版列表失败:', error)
    }
  }

  // 初始化加载部门列表
  useEffect(() => {
    loadDepartments()
  }, [])

  // 当分页或查询参数变化时重新加载数据
  useEffect(() => {
    loadTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageSize, queryParams])

  // 搜索处理
  const handleSearch = () => {
    setPageNum(1)
    setQueryParams({
      siteName: searchForm.siteName || undefined,
      status: searchForm.status,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      creator: searchForm.creator || undefined,
      departmentId: searchForm.departmentId,
    })
  }

  // 重置处理
  const handleReset = () => {
    const emptyForm = {
      siteName: '',
      status: undefined,
      startTime: undefined,
      endTime: undefined,
      creator: '',
      departmentId: undefined,
    }
    setSearchForm(emptyForm)
    setQueryParams({
      siteName: undefined,
      status: undefined,
      startTime: undefined,
      endTime: undefined,
      creator: undefined,
      departmentId: undefined,
    })
    setPageNum(1)
  }

  // 时间范围变化
  const handleTimeRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setSearchForm({
        ...searchForm,
        startTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      })
    } else {
      setSearchForm({
        ...searchForm,
        startTime: undefined,
        endTime: undefined,
      })
    }
  }

  // 打开新建任务弹窗
  const handleOpenCreateModal = () => {
    loadEnterpriseSiteTree()
    loadTaskTemplates()
    setCreateModalVisible(true)
  }

  // 关闭新建任务弹窗
  const handleCloseCreateModal = () => {
    setCreateModalVisible(false)
    createForm.resetFields()
  }

  // 提交新建任务
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields()
      setCreateLoading(true)

      await createManualJobInstance({
        siteId: values.siteId,
        taskTemplateId: values.taskTemplateId,
        departmentId: values.departmentId,
      })

      message.success('任务创建成功')
      handleCloseCreateModal()
      // 重新加载列表
      loadTask()
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误，不显示消息
        return
      }
      console.error('创建任务失败:', error)
      message.error(error.message || '创建任务失败')
    } finally {
      setCreateLoading(false)
    }
  }

  // 打开处理任务弹窗
  const handleOpenProcessModal = async (task: Task) => {
    setCurrentTask(task)
    setProcessModalVisible(true)

    // 加载任务详情（包含步骤模板信息和已填写的步骤数据）
    try {
      const detail = await getTaskDetail(task.id)
      setTaskDetail(detail)

      // 预填充已有的步骤数据
      if (detail.steps && detail.steps.length > 0) {
        const initialValues: any = {}
        detail.steps.forEach(step => {
          if (step.parameterValues) {
            step.parameterValues.forEach(pv => {
              // 使用 stepTemplateId-parameterName 作为字段key
              initialValues[`step_${step.stepTemplateId}_${pv.name}`] = pv.value
            })
          }
        })
        processForm.setFieldsValue(initialValues)
      }
    } catch (error: any) {
      console.error('加载任务详情失败:', error)
      message.error('加载任务详情失败')
    }
  }

  // 关闭处理任务弹窗
  const handleCloseProcessModal = () => {
    setProcessModalVisible(false)
    setCurrentTask(null)
    setTaskDetail(null)
    setCurrentStepIndex(0)
    processForm.resetFields()
  }

  // 保存草稿（保存当前填写的数据，不验证必填项）
  const handleSaveDraft = async () => {
    try {
      setProcessLoading(true)

      if (!currentTask || !taskDetail) {
        message.error('任务信息不完整')
        return
      }

      // 获取表单数据（不验证）
      const values = processForm.getFieldsValue()

      // 组装步骤数据
      const stepDataList: StepData[] = []

      taskDetail.taskTemplateItems.forEach(item => {
        if (item.stepTemplate?.parameters && item.stepTemplate.parameters.length > 0) {
          const parameters: Record<string, any> = {}

          item.stepTemplate.parameters.forEach(param => {
            const fieldKey = `step_${item.stepTemplateId}_${param.name}`
            if (values[fieldKey] !== undefined && values[fieldKey] !== null && values[fieldKey] !== '') {
              parameters[param.name] = values[fieldKey]
            }
          })

          // 只有当有参数值时才添加
          if (Object.keys(parameters).length > 0) {
            stepDataList.push({
              stepTemplateId: item.stepTemplateId,
              stepName: item.itemName,
              parameters,
            })
          }
        }
      })

      await processTask(currentTask.id, {
        stepDataList,
        complete: false,
      })

      message.success('草稿保存成功')
    } catch (error: any) {
      console.error('保存草稿失败:', error)
      message.error(error.message || '保存草稿失败')
    } finally {
      setProcessLoading(false)
    }
  }

  // 上一步
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  // 下一步（验证当前步骤）
  const handleNextStep = async () => {
    if (!taskDetail) return

    const currentItem = taskDetail.taskTemplateItems[currentStepIndex]
    if (!currentItem) return

    // 验证当前步骤的必填字段
    if (currentItem.stepTemplate?.parameters && currentItem.stepTemplate.parameters.length > 0) {
      const fieldsToValidate = currentItem.stepTemplate.parameters
        .map(param => `step_${currentItem.stepTemplateId}_${param.name}`)

      try {
        await processForm.validateFields(fieldsToValidate)
        // 验证通过，进入下一步
        if (currentStepIndex < taskDetail.taskTemplateItems.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1)
        }
      } catch (error) {
        // 验证失败，不跳转
        return
      }
    } else {
      // 没有参数，直接进入下一步
      if (currentStepIndex < taskDetail.taskTemplateItems.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
      }
    }
  }

  // 完成任务（验证所有步骤）
  const handleCompleteTask = async () => {
    try {
      const values = await processForm.validateFields()
      setProcessLoading(true)

      if (!currentTask || !taskDetail) {
        message.error('任务信息不完整')
        return
      }

      // 组装步骤数据
      const stepDataList: StepData[] = []

      taskDetail.taskTemplateItems.forEach(item => {
        if (item.stepTemplate?.parameters && item.stepTemplate.parameters.length > 0) {
          const parameters: Record<string, any> = {}

          item.stepTemplate.parameters.forEach(param => {
            const fieldKey = `step_${item.stepTemplateId}_${param.name}`
            if (values[fieldKey] !== undefined && values[fieldKey] !== null && values[fieldKey] !== '') {
              parameters[param.name] = values[fieldKey]
            }
          })

          // 只有当有参数值时才添加
          if (Object.keys(parameters).length > 0) {
            stepDataList.push({
              stepTemplateId: item.stepTemplateId,
              stepName: item.itemName,
              parameters,
            })
          }
        }
      })

      await processTask(currentTask.id, {
        stepDataList,
        complete: true, // 完成任务
      })

      message.success('任务完成成功')
      handleCloseProcessModal()
      // 重新加载列表
      loadTask()
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误，不显示消息
        return
      }
      console.error('完成任务失败:', error)
      message.error(error.message || '完成任务失败')
    } finally {
      setProcessLoading(false)
    }
  }


  // 表格列定义
  const columns: ColumnsType<Task> = [
    {
      title: '序号',
      width: 60,
      fixed: 'left',
      render: (_, __, index) => (pageNum - 1) * pageSize + index + 1,
    },
    {
      title: '站点任务',
      dataIndex: 'siteName',
      width: 180,
      fixed: 'left',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const statusInfo = STATUS_MAP[status] || { text: status, color: 'default' }
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: '任务期限',
      dataIndex: 'expiredTime',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '所属客户',
      dataIndex: 'enterpriseName',
      width: 200,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => text || '-',
    },
    {
      title: '运维任务模版',
      dataIndex: 'taskTemplateName',
      width: 150,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => text || '-',
    },
    {
      title: '任务项量',
      dataIndex: 'taskItemCount',
      width: 100,
      align: 'center',
      render: (count) => count || 0,
    },
    {
      title: '运维小组',
      dataIndex: 'departmentName',
      width: 150,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => text || '-',
    },
    {
      title: '发布者',
      dataIndex: 'creator',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '派发时间',
      dataIndex: 'triggerTime',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleOpenProcessModal(record)}
            disabled={record.status === 'COMPLETED' || record.status === 'CANCELLED'}
          >
            处理
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '0 24px' }}>
      <Card title="任务" bodyStyle={{ padding: '16px' }}>
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="请输入站点名称"
              value={searchForm.siteName}
              onChange={(e) => setSearchForm({ ...searchForm, siteName: e.target.value })}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="请选择任务状态"
              value={searchForm.status}
              onChange={(value) => setSearchForm({ ...searchForm, status: value })}
              allowClear
              style={{ width: '100%' }}
            >
              <Select.Option value="PENDING">待处理</Select.Option>
              <Select.Option value="IN_PROGRESS">进行中</Select.Option>
              <Select.Option value="COMPLETED">已完成</Select.Option>
              <Select.Option value="OVERDUE">已逾期</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={handleTimeRangeChange}
              style={{ width: '100%' }}
              value={
                searchForm.startTime && searchForm.endTime
                  ? [dayjs(searchForm.startTime), dayjs(searchForm.endTime)]
                  : null
              }
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="请输入创建人"
              value={searchForm.creator}
              onChange={(e) => setSearchForm({ ...searchForm, creator: e.target.value })}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              placeholder="请选择运维小组"
              value={searchForm.departmentId}
              onChange={(value) => setSearchForm({ ...searchForm, departmentId: value })}
              allowClear
              style={{ width: '100%' }}
            >
              {departments.map((dept) => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={18}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateModal}>
                新建任务
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 任务表格 */}
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setPageNum(page)
              setPageSize(size || 20)
            },
          }}
          size="small"
          scroll={{ x: 1600, y: 'calc(100vh - 340px)' }}
        />
      </Card>

      {/* 新建任务弹窗 */}
      <Modal
        title="新建任务"
        open={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={handleCloseCreateModal}
        confirmLoading={createLoading}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="选择站点"
            name="siteId"
            rules={[{ required: true, message: '请选择站点' }]}
          >
            <Select
              placeholder="请选择站点"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {enterpriseSiteTree.map((enterprise) => (
                <Select.OptGroup key={enterprise.enterpriseId} label={enterprise.enterpriseName}>
                  {enterprise.sites.map((site) => (
                    <Select.Option key={site.id} value={site.id} label={site.siteName}>
                      {site.siteName}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="运维小组"
            name="departmentId"
            rules={[{ required: true, message: '请选择运维小组' }]}
          >
            <Select placeholder="请选择运维小组">
              {departments.map((dept) => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="运维任务模版"
            name="taskTemplateId"
            rules={[{ required: true, message: '请选择运维任务模版' }]}
          >
            <Select placeholder="请选择运维任务模版">
              {taskTemplates.map((taskTemplate) => (
                <Select.Option key={taskTemplate.id} value={taskTemplate.id}>
                  {taskTemplate.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 处理任务弹窗 */}
      <Modal
        title={`处理任务 - ${currentTask?.siteName || ''}`}
        open={processModalVisible}
        onCancel={handleCloseProcessModal}
        width={1000}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        footer={null}
      >
        <Form
          form={processForm}
          layout="vertical"
          autoComplete="off"
        >
          {currentTask && (
            <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div><strong>任务模版:</strong> {currentTask.taskTemplateName}</div>
                </Col>
                <Col span={12}>
                  <div><strong>任务状态:</strong> {STATUS_MAP[currentTask.status]?.text}</div>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <div><strong>任务期限:</strong> {currentTask.expiredTime}</div>
                </Col>
                <Col span={12}>
                  <div><strong>运维小组:</strong> {currentTask.departmentName}</div>
                </Col>
              </Row>
            </div>
          )}

          {/* 步骤导航 */}
          {taskDetail?.taskTemplateItems && taskDetail.taskTemplateItems.length > 1 && (
            <Steps
              current={currentStepIndex}
              style={{ marginBottom: 24 }}
              size="small"
              items={taskDetail.taskTemplateItems.map((item, index) => ({
                title: item.itemName,
                description: index === currentStepIndex ? '当前步骤' : undefined,
              }))}
            />
          )}

          {/* 当前步骤内容 */}
          {taskDetail?.taskTemplateItems && taskDetail.taskTemplateItems.length > 0 ? (
            (() => {
              const currentItem = taskDetail.taskTemplateItems[currentStepIndex]
              if (!currentItem) return null

              return (
                <div key={currentItem.id}>
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '16px' }}>
                      {currentStepIndex + 1}. {currentItem.itemName}
                    </h4>
                    {currentItem.description && (
                      <div style={{ color: '#666', marginBottom: 16, fontSize: '13px', padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                        {currentItem.description}
                      </div>
                    )}

                    {/* 渲染步骤参数 */}
                    {currentItem.stepTemplate?.parameters && currentItem.stepTemplate.parameters.length > 0 ? (
                      <div>
                        {currentItem.stepTemplate.parameters.map(param => (
                          <StepParameterFormItem
                            key={`step_${currentItem.stepTemplateId}_${param.name}`}
                            parameter={param}
                            stepTemplateId={currentItem.stepTemplateId}
                            form={processForm}
                          />
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#999', padding: '40px 0', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                        此步骤无需填写参数
                      </div>
                    )}
                  </div>
                </div>
              )
            })()
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <p>正在加载任务详情...</p>
            </div>
          )}

          {/* 操作按钮 */}
          {taskDetail?.taskTemplateItems && taskDetail.taskTemplateItems.length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Space>
                    <Button
                      icon={<LeftOutlined />}
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                    >
                      上一步
                    </Button>
                    {currentStepIndex < taskDetail.taskTemplateItems.length - 1 ? (
                      <Button
                        type="primary"
                        icon={<RightOutlined />}
                        onClick={handleNextStep}
                      >
                        下一步
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleCompleteTask}
                        loading={processLoading}
                      >
                        完成任务
                      </Button>
                    )}
                  </Space>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button
                      icon={<SaveOutlined />}
                      onClick={handleSaveDraft}
                      loading={processLoading}
                    >
                      保存草稿
                    </Button>
                    <Button onClick={handleCloseProcessModal}>
                      取消
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default TaskExecution
