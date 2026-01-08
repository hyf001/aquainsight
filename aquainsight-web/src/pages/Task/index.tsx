import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PlusIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { Button, Table, Modal, Form, FormField, Input, Select, Tag, Steps, DatePicker, RangePicker, Card, CardHeader, CardBody } from '@/components/ui'
import type { TableColumn, Step } from '@/components/ui'
import { format } from 'date-fns'
import {
  getTaskPage,
  createManualJobInstance,
  getTaskDetail,
  processTask,
  type Task,
  type TaskDetail,
  type StepData,
} from '@/services/maintenance'
import { getAllDepartments, type Department } from '@/services/organization'
import { getEnterpriseSiteTree, type EnterpriseSiteTree } from '@/services/monitoring'
import { getTaskTemplateList, type TaskTemplate } from '@/services/maintenance'
import StepParameterFormItem from '@/components/StepParameterForm'
import { toast } from '@/utils/toast'

// 任务状态映射
const STATUS_MAP: { [key: string]: { text: string; color: string } } = {
  PENDING: { text: '待处理', color: 'gray' },
  IN_PROGRESS: { text: '进行中', color: 'blue' },
  COMPLETED: { text: '已完成', color: 'green' },
  OVERDUE: { text: '已逾期', color: 'red' },
  CANCELLED: { text: '已取消', color: 'orange' },
  EXPIRING: { text: '即将逾期', color: 'orange' },
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

  // 处理任务弹窗相关
  const [processModalVisible, setProcessModalVisible] = useState(false)
  const [processLoading, setProcessLoading] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null)
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

  const createForm = useForm()
  const processForm = useForm()

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
      toast.error('加载任务列表失败')
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
  const handleTimeRangeChange = (dates: [Date | null, Date | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setSearchForm({
        ...searchForm,
        startTime: format(dates[0], 'yyyy-MM-dd HH:mm:ss'),
        endTime: format(dates[1], 'yyyy-MM-dd HH:mm:ss'),
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
    createForm.reset()
  }

  // 提交新建任务
  const handleCreateSubmit = async (values: any) => {
    try {
      setCreateLoading(true)

      await createManualJobInstance({
        siteId: values.siteId,
        taskTemplateId: values.taskTemplateId,
        departmentId: values.departmentId,
      })

      toast.success('任务创建成功')
      handleCloseCreateModal()
      // 重新加载列表
      loadTask()
    } catch (error: any) {
      console.error('创建任务失败:', error)
      toast.error(error.message || '创建任务失败')
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
        processForm.reset(initialValues)
      }
    } catch (error: any) {
      console.error('加载任务详情失败:', error)
      toast.error('加载任务详情失败')
    }
  }

  // 关闭处理任务弹窗
  const handleCloseProcessModal = () => {
    setProcessModalVisible(false)
    setCurrentTask(null)
    setTaskDetail(null)
    setCurrentStepIndex(0)
    processForm.reset()
  }

  // 保存草稿（保存当前填写的数据，不验证必填项）
  const handleSaveDraft = async () => {
    try {
      setProcessLoading(true)

      if (!currentTask || !taskDetail) {
        toast.error('任务信息不完整')
        return
      }

      // 获取表单数据（不验证）
      const values = processForm.getValues()

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

      toast.success('草稿保存成功')
    } catch (error: any) {
      console.error('保存草稿失败:', error)
      toast.error(error.message || '保存草稿失败')
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
        await processForm.trigger(fieldsToValidate)
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
  const handleCompleteTask = async (values: any) => {
    try {
      setProcessLoading(true)

      if (!currentTask || !taskDetail) {
        toast.error('任务信息不完整')
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

      toast.success('任务完成成功')
      handleCloseProcessModal()
      // 重新加载列表
      loadTask()
    } catch (error: any) {
      console.error('完成任务失败:', error)
      toast.error(error.message || '完成任务失败')
    } finally {
      setProcessLoading(false)
    }
  }

  // 表格列定义
  const columns: TableColumn<Task>[] = [
    {
      title: '序号',
      width: '60px',
      render: (_, __, index) => (pageNum - 1) * pageSize + index + 1,
    },
    {
      title: '站点任务',
      dataIndex: 'siteName',
      width: '180px',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      width: '100px',
      render: (status) => {
        const statusInfo = STATUS_MAP[status] || { text: status, color: 'gray' }
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: '任务期限',
      dataIndex: 'expiredTime',
      width: '160px',
      render: (text) => text || '-',
    },
    {
      title: '所属客户',
      dataIndex: 'enterpriseName',
      width: '200px',
      render: (text) => text || '-',
    },
    {
      title: '运维任务模版',
      dataIndex: 'taskTemplateName',
      width: '150px',
      render: (text) => text || '-',
    },
    {
      title: '任务项量',
      dataIndex: 'taskItemCount',
      width: '100px',
      render: (count) => count || 0,
    },
    {
      title: '运维小组',
      dataIndex: 'departmentName',
      width: '150px',
      render: (text) => text || '-',
    },
    {
      title: '发布者',
      dataIndex: 'creator',
      width: '120px',
      render: (text) => text || '-',
    },
    {
      title: '派发时间',
      dataIndex: 'triggerTime',
      width: '160px',
      render: (text) => text || '-',
    },
    {
      title: '操作',
      width: '150px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenProcessModal(record)}
            disabled={record.status === 'COMPLETED' || record.status === 'CANCELLED'}
          >
            处理
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <Card>
        <CardHeader title="任务" />
        <CardBody>
          {/* 筛选条件 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="请输入站点名称"
              value={searchForm.siteName}
              onChange={(e) => setSearchForm({ ...searchForm, siteName: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select
              placeholder="请选择任务状态"
              value={searchForm.status}
              onChange={(value) => setSearchForm({ ...searchForm, status: value as string })}
              allowClear
              options={[
                { label: '待处理', value: 'PENDING' },
                { label: '进行中', value: 'IN_PROGRESS' },
                { label: '已完成', value: 'COMPLETED' },
                { label: '已逾期', value: 'OVERDUE' },
                { label: '已取消', value: 'CANCELLED' },
              ]}
            />
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              showTime
              onChange={handleTimeRangeChange}
              value={
                searchForm.startTime && searchForm.endTime
                  ? [new Date(searchForm.startTime), new Date(searchForm.endTime)]
                  : null
              }
            />
            <Input
              placeholder="请输入创建人"
              value={searchForm.creator}
              onChange={(e) => setSearchForm({ ...searchForm, creator: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <Select
              placeholder="请选择运维小组"
              value={searchForm.departmentId}
              onChange={(value) => setSearchForm({ ...searchForm, departmentId: value as number })}
              allowClear
              options={departments.map((dept) => ({
                label: dept.name,
                value: dept.id,
              }))}
            />
            <div className="col-span-3 flex items-center gap-2">
              <Button onClick={handleSearch}>
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                查询
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                重置
              </Button>
              <Button onClick={handleOpenCreateModal}>
                <PlusIcon className="w-4 h-4 mr-2" />
                新建任务
              </Button>
            </div>
          </div>

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
          />
        </CardBody>
      </Card>

      {/* 新建任务弹窗 */}
      <Modal
        title="新建任务"
        open={createModalVisible}
        onCancel={handleCloseCreateModal}
        width="600px"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseCreateModal}>
              取消
            </Button>
            <Button
              onClick={() => createForm.handleSubmit(handleCreateSubmit)()}
              loading={createLoading}
            >
              确定
            </Button>
          </div>
        }
      >
        <Form form={createForm} onSubmit={handleCreateSubmit}>
          <FormField
            label="选择站点"
            name="siteId"
            required
            error={createForm.formState.errors.siteId?.message}
          >
            <Select
              {...createForm.register('siteId', { required: '请选择站点' })}
              placeholder="请选择站点"
              showSearch
              options={enterpriseSiteTree.flatMap((enterprise) =>
                enterprise.sites.map((site) => ({
                  label: `${enterprise.enterpriseName} - ${site.siteName}`,
                  value: site.id,
                }))
              )}
            />
          </FormField>

          <FormField
            label="运维小组"
            name="departmentId"
            required
            error={createForm.formState.errors.departmentId?.message}
          >
            <Select
              {...createForm.register('departmentId', { required: '请选择运维小组' })}
              placeholder="请选择运维小组"
              options={departments.map((dept) => ({
                label: dept.name,
                value: dept.id,
              }))}
            />
          </FormField>

          <FormField
            label="运维任务模版"
            name="taskTemplateId"
            required
            error={createForm.formState.errors.taskTemplateId?.message}
          >
            <Select
              {...createForm.register('taskTemplateId', { required: '请选择运维任务模版' })}
              placeholder="请选择运维任务模版"
              options={taskTemplates.map((taskTemplate) => ({
                label: taskTemplate.name,
                value: taskTemplate.id,
              }))}
            />
          </FormField>
        </Form>
      </Modal>

      {/* 处理任务弹窗 */}
      <Modal
        title={`处理任务 - ${currentTask?.siteName || ''}`}
        open={processModalVisible}
        onCancel={handleCloseProcessModal}
        width="1000px"
        footer={null}
      >
        <Form form={processForm} onSubmit={handleCompleteTask}>
          {currentTask && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>任务模版:</strong> {currentTask.taskTemplateName}</div>
                <div><strong>任务状态:</strong> {STATUS_MAP[currentTask.status]?.text}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div><strong>任务期限:</strong> {currentTask.expiredTime}</div>
                <div><strong>运维小组:</strong> {currentTask.departmentName}</div>
              </div>
            </div>
          )}

          {/* 步骤导航 */}
          {taskDetail?.taskTemplateItems && taskDetail.taskTemplateItems.length > 1 && (
            <Steps
              current={currentStepIndex}
              className="mb-6"
              size="small"
              items={taskDetail.taskTemplateItems.map((item, index): Step => ({
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
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-base">
                      {currentStepIndex + 1}. {currentItem.itemName}
                    </h4>
                    {currentItem.description && (
                      <div className="text-gray-600 mb-4 text-sm p-2 bg-gray-50 rounded">
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
                      <div className="text-center text-gray-400 py-10 bg-gray-50 rounded">
                        此步骤无需填写参数
                      </div>
                    )}
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>正在加载任务详情...</p>
            </div>
          )}

          {/* 操作按钮 */}
          {taskDetail?.taskTemplateItems && taskDetail.taskTemplateItems.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                    上一步
                  </Button>
                  {currentStepIndex < taskDetail.taskTemplateItems.length - 1 ? (
                    <Button
                      onClick={handleNextStep}
                    >
                      下一步
                      <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => processForm.handleSubmit(handleCompleteTask)()}
                      loading={processLoading}
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      完成任务
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    loading={processLoading}
                  >
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    保存草稿
                  </Button>
                  <Button variant="outline" onClick={handleCloseProcessModal}>
                    取消
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default TaskExecution
