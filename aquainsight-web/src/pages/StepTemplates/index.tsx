import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline'
import { Button, Table, Modal, Form, FormField, Input, Select, Tag, Popconfirm, Card, CardHeader, CardBody, Checkbox } from '@/components/ui'
import type { TableColumn } from '@/components/ui'
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
import { toast } from '@/utils/toast'

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

  // Form state for parameters (manually managed due to complex nested structure)
  const [parameters, setParameters] = useState<JobParameter[]>([])

  const form = useForm()
  const searchForm = useForm()

  // 加载步骤模版列表
  const loadStepTemplates = async (name?: string) => {
    setLoading(true)
    try {
      const data = await getStepTemplateList(name)
      setStepTemplates(data)
    } catch (error) {
      console.error('加载步骤模版列表失败:', error)
      toast.error('加载步骤模版列表失败')
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
      form.reset({
        name: stepTemplate.name,
        code: stepTemplate.code,
        overdueDays: stepTemplate.overdueDays,
        description: stepTemplate.description || '',
      })
      setParameters(stepTemplate.parameters || [])
    } else {
      form.reset({
        name: '',
        code: '',
        overdueDays: 0,
        description: '',
      })
      // 设置默认值：一个空参数
      setParameters([{ name: '', type: 'TEXT', required: false } as JobParameter])
    }
    setModalVisible(true)
  }

  // 保存步骤模版
  const handleSaveStepTemplate = async (values: any) => {
    try {
      const requestData = {
        ...values,
        parameters: parameters
      }

      if (editingStepTemplate) {
        await updateStepTemplate(editingStepTemplate.id, requestData)
        toast.success('步骤模版更新成功')
      } else {
        await createStepTemplate(requestData)
        toast.success('步骤模版创建成功')
      }

      setModalVisible(false)
      form.reset()
      loadStepTemplates(searchName)
    } catch (error: any) {
      console.error('保存步骤模版失败:', error)
      toast.error(error.message || '保存步骤模版失败')
    }
  }

  // 删除步骤模版
  const handleDeleteStepTemplate = async (id: number) => {
    try {
      await deleteStepTemplate(id)
      toast.success('步骤模版删除成功')
      loadStepTemplates(searchName)
    } catch (error: any) {
      console.error('删除步骤模版失败:', error)
      toast.error(error.message || '删除步骤模版失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('请选择要删除的步骤模版')
      return
    }

    try {
      await batchDeleteJobCategories(selectedRowKeys as number[])
      toast.success('批量删除成功')
      setSelectedRowKeys([])
      loadStepTemplates(searchName)
    } catch (error: any) {
      console.error('批量删除失败:', error)
      toast.error(error.message || '批量删除失败')
    }
  }

  // 搜索
  const handleSearch = (values: any) => {
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
    const config = typeMap[type] || { text: type, color: 'gray' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  // Add parameter
  const addParameter = () => {
    setParameters([...parameters, { name: '', type: 'TEXT', required: false } as JobParameter])
  }

  // Remove parameter
  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index))
  }

  // Update parameter
  const updateParameter = (index: number, field: string, value: any) => {
    const newParams = [...parameters]
    newParams[index] = { ...newParams[index], [field]: value }
    setParameters(newParams)
  }

  // Add option to parameter
  const addOption = (paramIndex: number) => {
    const newParams = [...parameters]
    if (!newParams[paramIndex].options) {
      newParams[paramIndex].options = []
    }
    newParams[paramIndex].options!.push({ label: '', value: '', defaultSelected: false, disabled: false })
    setParameters(newParams)
  }

  // Remove option from parameter
  const removeOption = (paramIndex: number, optionIndex: number) => {
    const newParams = [...parameters]
    newParams[paramIndex].options = newParams[paramIndex].options!.filter((_, i) => i !== optionIndex)
    setParameters(newParams)
  }

  // Update option
  const updateOption = (paramIndex: number, optionIndex: number, field: string, value: any) => {
    const newParams = [...parameters]
    newParams[paramIndex].options![optionIndex] = {
      ...newParams[paramIndex].options![optionIndex],
      [field]: value
    }
    setParameters(newParams)
  }

  // 表格列定义
  const columns: TableColumn<StepTemplate>[] = [
    {
      title: '序号',
      key: 'index',
      width: '80px',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: '操作',
      key: 'action',
      width: '120px',
      render: (_text, record) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openPreviewModal(record)}
            className="p-1 h-auto"
            title="查看表单"
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openModal(record)}
            className="p-1 h-auto"
            title="编辑"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Popconfirm
            title="确定要删除这个步骤模版吗?"
            onConfirm={() => handleDeleteStepTemplate(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-red-500 hover:text-red-700"
              title="删除"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '150px',
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: '180px',
    },
    {
      title: '参数配置',
      dataIndex: 'parameters',
      key: 'parameters',
      width: '300px',
      render: (parameters: JobParameter[] | null) => {
        if (!parameters || parameters.length === 0) {
          return <span className="text-gray-400">无</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {parameters.map((param, index) => (
              <Tag key={index} color={param.required ? 'red' : 'gray'}>
                {param.name} {renderParameterType(param.type)} {param.required && '(必填)'}
              </Tag>
            ))}
          </div>
        )
      },
    },
    {
      title: '逾期天数(天)',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: '120px',
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || '/',
    },
  ]

  return (
    <Card>
      <CardHeader title="任务名称" />
      <CardBody>
        {/* 搜索表单 */}
        <Form form={searchForm} onSubmit={handleSearch}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-ocean-midnight">任务名称:</label>
              <Input
                {...searchForm.register('name')}
                placeholder="请输入任务名称"
                className="w-48"
              />
            </div>
            <Button type="submit">
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              查询
            </Button>
          </div>
        </Form>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 mb-4">
          <Button onClick={() => openModal()}>
            <PlusIcon className="w-4 h-4 mr-2" />
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
              variant="outline"
              disabled={selectedRowKeys.length === 0}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              删除
            </Button>
          </Popconfirm>
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
        />
      </CardBody>

      {/* 创建/编辑对话框 */}
      <Modal
        title={editingStepTemplate ? '编辑步骤模版' : '新增步骤模版'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.reset()
        }}
        width="1200px"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalVisible(false)}>
              关闭
            </Button>
            <Button onClick={() => form.handleSubmit(handleSaveStepTemplate)()}>
              保存
            </Button>
          </div>
        }
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <Form form={form} onSubmit={handleSaveStepTemplate}>
            <FormField
              label="步骤名称"
              name="name"
              required
              error={form.formState.errors.name?.message}
            >
              <Input
                {...form.register('name', { required: '请输入步骤名称' })}
                placeholder="例行维护"
              />
            </FormField>

            <FormField
              label="步骤编码"
              name="code"
              required
              error={form.formState.errors.code?.message}
            >
              <Input
                {...form.register('code', { required: '请输入步骤编码' })}
                placeholder="routine_maintenance"
                disabled={!!editingStepTemplate}
              />
            </FormField>

            <div className="mb-4">
              <label className="block text-sm font-medium text-ocean-midnight mb-2">
                参数列表
              </label>
              {parameters.map((param, paramIndex) => {
                const needsOptions = ['SELECT', 'CHECKBOX', 'RADIO'].includes(param.type)

                return (
                  <div
                    key={paramIndex}
                    className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParameter(paramIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MinusCircleIcon className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* 基础信息 */}
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">参数名称</label>
                        <Input
                          value={param.name}
                          onChange={(e) => updateParameter(paramIndex, 'name', e.target.value)}
                          placeholder="例: checkResult"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">显示标签</label>
                        <Input
                          value={param.label}
                          onChange={(e) => updateParameter(paramIndex, 'label', e.target.value)}
                          placeholder="例: 是否检查"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">参数类型</label>
                        <Select
                          value={param.type}
                          onChange={(value) => {
                            updateParameter(paramIndex, 'type', value)
                            // 切换类型时清空选项配置
                            updateParameter(paramIndex, 'options', undefined)
                          }}
                          placeholder="选择类型"
                          options={PARAMETER_TYPE_OPTIONS}
                        />
                      </div>
                      <div className="flex items-end">
                        <Checkbox
                          checked={param.required}
                          onChange={(checked) => updateParameter(paramIndex, 'required', checked)}
                        >
                          必填
                        </Checkbox>
                      </div>
                    </div>

                    {/* TEXT类型的额外配置 */}
                    {param.type === 'TEXT' && (
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">占位符</label>
                          <Input
                            value={param.placeholder}
                            onChange={(e) => updateParameter(paramIndex, 'placeholder', e.target.value)}
                            placeholder="请输入占位符"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">默认值</label>
                          <Input
                            value={param.defaultValue}
                            onChange={(e) => updateParameter(paramIndex, 'defaultValue', e.target.value)}
                            placeholder="默认值"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">最小长度</label>
                          <Input
                            type="number"
                            value={param.minLength}
                            onChange={(e) => updateParameter(paramIndex, 'minLength', Number(e.target.value))}
                            placeholder="0"
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">最大长度</label>
                          <Input
                            type="number"
                            value={param.maxLength}
                            onChange={(e) => updateParameter(paramIndex, 'maxLength', Number(e.target.value))}
                            placeholder="100"
                            min={0}
                          />
                        </div>
                      </div>
                    )}

                    {/* CHECKBOX类型的额外配置 */}
                    {param.type === 'CHECKBOX' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">最小选择数</label>
                          <Input
                            type="number"
                            value={param.minSelect}
                            onChange={(e) => updateParameter(paramIndex, 'minSelect', Number(e.target.value))}
                            placeholder="0"
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">最大选择数</label>
                          <Input
                            type="number"
                            value={param.maxSelect}
                            onChange={(e) => updateParameter(paramIndex, 'maxSelect', Number(e.target.value))}
                            placeholder="不限"
                            min={0}
                          />
                        </div>
                      </div>
                    )}

                    {/* 提示信息 */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">提示信息</label>
                      <Input
                        value={param.hint}
                        onChange={(e) => updateParameter(paramIndex, 'hint', e.target.value)}
                        placeholder="给用户的提示说明"
                      />
                    </div>

                    {/* SELECT/CHECKBOX/RADIO的选项配置 */}
                    {needsOptions && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">选项配置</label>
                        {param.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2 mb-2">
                            <Input
                              value={option.label}
                              onChange={(e) => updateOption(paramIndex, optionIndex, 'label', e.target.value)}
                              placeholder="显示文本"
                              className="w-32"
                            />
                            <Input
                              value={option.value}
                              onChange={(e) => updateOption(paramIndex, optionIndex, 'value', e.target.value)}
                              placeholder="选项值"
                              className="w-32"
                            />
                            <Checkbox
                              checked={option.defaultSelected}
                              onChange={(checked) => updateOption(paramIndex, optionIndex, 'defaultSelected', checked)}
                            >
                              默认选中
                            </Checkbox>
                            <Checkbox
                              checked={option.disabled}
                              onChange={(checked) => updateOption(paramIndex, optionIndex, 'disabled', checked)}
                            >
                              禁用
                            </Checkbox>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOption(paramIndex, optionIndex)}
                              className="text-red-500"
                            >
                              <MinusCircleIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(paramIndex)}
                          className="w-full"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          添加选项
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}

              <Button
                variant="outline"
                onClick={addParameter}
                className="w-full"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                添加参数
              </Button>
            </div>

            <FormField
              label="逾期天数(天)"
              name="overdueDays"
              required
              error={form.formState.errors.overdueDays?.message}
            >
              <Input
                {...form.register('overdueDays', { required: '请输入逾期天数' })}
                type="number"
                placeholder="0"
                min={0}
              />
            </FormField>

            <FormField
              label="项说明"
              name="description"
            >
              <Input
                {...form.register('description')}
                placeholder="请输入说明"
              />
            </FormField>
          </Form>
        </div>
      </Modal>

      {/* 表单预览对话框 */}
      <Modal
        title={`表单预览 - ${previewStepTemplate?.name || ''}`}
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        width="600px"
        footer={
          <div className="flex justify-end">
            <Button onClick={() => setPreviewModalVisible(false)}>
              关闭
            </Button>
          </div>
        }
      >
        {previewStepTemplate && (
          <div className="py-4">
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
              <div className="text-center text-gray-400 py-10">
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
