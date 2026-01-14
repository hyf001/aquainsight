import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, Circle, Play, Check, Upload,
  Calendar, MapPin, User, Clock, FileText, ImagePlus, X, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import {
  taskApi,
  TaskDetail,
  TaskStatus,
  taskStatusMap,
  ParameterValue,
  Step,
  StepParameter,
} from '@/services/maintenance'
import { commonApi } from '@/services/common'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [stepData, setStepData] = useState<Record<number, Record<string, unknown>>>({})
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // 获取任务详情
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return
      setLoading(true)
      try {
        const data = await taskApi.getDetail(parseInt(id))
        setTask(data)
        // 初始化步骤数据
        const initialData: Record<number, Record<string, unknown>> = {}
        data.steps?.forEach(step => {
          const values: Record<string, unknown> = {}
          step.parameterValues?.forEach(pv => {
            values[pv.name] = pv.value
          })
          initialData[step.stepTemplateId] = values
        })
        setStepData(initialData)
      } catch (error) {
        console.error('获取任务详情失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [id])

  // 更新步骤参数
  const updateStepParam = (stepTemplateId: number, paramName: string, value: unknown) => {
    setStepData(prev => ({
      ...prev,
      [stepTemplateId]: {
        ...(prev[stepTemplateId] || {}),
        [paramName]: value,
      },
    }))
  }

  // 获取步骤的执行数据
  const getStepData = (stepTemplateId: number) => {
    return stepData[stepTemplateId] || {}
  }

  // 处理任务
  const handleProcess = async (complete = false) => {
    if (!task || !id) return
    setProcessing(true)
    try {
      const stepDataList = task.taskTemplateItems?.map(item => ({
        stepTemplateId: item.stepTemplateId,
        stepName: item.itemName,
        parameters: getStepData(item.stepTemplateId),
      })) || []

      await taskApi.process(parseInt(id), {
        stepDataList,
        complete,
      })

      // 刷新数据
      const data = await taskApi.getDetail(parseInt(id))
      setTask(data)
      setStepData({})
    } catch (error) {
      console.error('处理任务失败:', error)
      alert('处理任务失败')
    } finally {
      setProcessing(false)
    }
  }

  // 开始任务
  const handleStart = () => {
    handleProcess(false)
  }

  // 完成任务
  const handleComplete = () => {
    if (!confirm('确定要完成任务吗？')) return
    handleProcess(true)
  }

  // 格式化时间
  const formatTime = (time: string | undefined) => {
    if (!time) return '-'
    return time.replace('T', ' ').substring(0, 16)
  }

  // 获取状态样式
  const getStatusClass = (status: TaskStatus) => {
    return taskStatusMap[status]?.color || 'badge-info'
  }

  // 检查步骤是否已填写
  const isStepFilled = (stepTemplateId: number) => {
    const data = getStepData(stepTemplateId)
    return Object.keys(data).length > 0
  }

  // 处理图片上传（支持多张图片）
  const handleImageUpload = async (
    stepTemplateId: number,
    paramName: string,
    files: FileList
  ) => {
    const key = `${stepTemplateId}-${paramName}`
    setUploadingImages(prev => ({ ...prev, [key]: true }))
    try {
      const currentImages = (getStepData(stepTemplateId)[paramName] as string[]) || []
      const uploadPromises = Array.from(files).map(file => commonApi.uploadImage(file))
      const results = await Promise.all(uploadPromises)
      const newUrls = results.map(r => (r as unknown as { url: string }).url)
      updateStepParam(stepTemplateId, paramName, [...currentImages, ...newUrls])
    } catch (error) {
      console.error('图片上传失败:', error)
      alert('图片上传失败')
    } finally {
      setUploadingImages(prev => ({ ...prev, [key]: false }))
    }
  }

  // 删除单张图片
  const handleRemoveImage = (stepTemplateId: number, paramName: string, index: number) => {
    const currentImages = (getStepData(stepTemplateId)[paramName] as string[]) || []
    const newImages = currentImages.filter((_, i) => i !== index)
    updateStepParam(stepTemplateId, paramName, newImages)
  }

  // 处理多选框值变化
  const handleCheckboxChange = (
    stepTemplateId: number,
    paramName: string,
    optionValue: string,
    checked: boolean
  ) => {
    const currentValue = (getStepData(stepTemplateId)[paramName] as string[]) || []
    let newValue: string[]
    if (checked) {
      newValue = [...currentValue, optionValue]
    } else {
      newValue = currentValue.filter(v => v !== optionValue)
    }
    updateStepParam(stepTemplateId, paramName, newValue)
  }

  // 渲染参数输入
  const renderParameterInput = (param: StepParameter, stepTemplateId: number) => {
    const value = getStepData(stepTemplateId)[param.name]
    const uploadKey = `${stepTemplateId}-${param.name}`
    const isUploading = uploadingImages[uploadKey]

    switch (param.type?.toUpperCase()) {
      case 'TEXT':
        return (
          <div>
            <Input
              label={param.label || param.name}
              value={value as string || ''}
              onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
              placeholder={param.placeholder || undefined}
            />
            {param.hint && (
              <p className="text-xs text-clean-400 mt-1">{param.hint}</p>
            )}
          </div>
        )

      case 'IMAGE':
        const images = (Array.isArray(value) ? value : (value ? [value] : [])) as string[]
        return (
          <div>
            <label className="block text-sm text-clean-600 mb-2">
              {param.label || param.name}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-3">
              {/* 已上传的图片缩略图列表 */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={commonApi.getImageUrl(imgUrl)}
                        alt={`图片${index + 1}`}
                        className="w-20 h-20 rounded-lg border border-clean-200 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(commonApi.getImageUrl(imgUrl), '_blank')}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(stepTemplateId, param.name, index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* 上传按钮 */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={(el) => { fileInputRefs.current[uploadKey] = el }}
                  onChange={(e) => {
                    const files = e.target.files
                    if (files && files.length > 0) {
                      handleImageUpload(stepTemplateId, param.name, files)
                      e.target.value = ''
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRefs.current[uploadKey]?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      上传中...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4 mr-2" />
                      上传图片
                    </>
                  )}
                </Button>
                <span className="text-xs text-clean-400 ml-2">支持多张图片</span>
              </div>
            </div>
            {param.hint && (
              <p className="text-xs text-clean-400 mt-1">{param.hint}</p>
            )}
          </div>
        )

      case 'SELECT':
        return (
          <div>
            <Select
              label={param.label || param.name}
              value={String(value || '')}
              onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
              options={[
                { value: '', label: param.placeholder || '请选择' },
                ...(param.options?.map(o => ({ value: o.value, label: o.label })) || []),
              ]}
            />
            {param.hint && (
              <p className="text-xs text-clean-400 mt-1">{param.hint}</p>
            )}
          </div>
        )

      case 'CHECKBOX':
        // 多选框
        return (
          <div>
            <label className="block text-sm text-clean-600 mb-2">
              {param.label || param.name}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {param.options?.map(option => {
                const currentValues = (value as string[]) || []
                const isChecked = currentValues.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-nature-400 bg-nature-50'
                        : 'border-clean-200 hover:border-clean-300'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={option.disabled}
                      onChange={(e) => handleCheckboxChange(
                        stepTemplateId,
                        param.name,
                        option.value,
                        e.target.checked
                      )}
                      className="w-5 h-5 rounded border-clean-300 text-nature-500 focus:ring-nature-200"
                    />
                    <span className="text-clean-700">{option.label}</span>
                  </label>
                )
              })}
            </div>
            {param.hint && (
              <p className="text-xs text-clean-400 mt-1">{param.hint}</p>
            )}
          </div>
        )

      case 'RADIO':
        // 单选框
        return (
          <div>
            <label className="block text-sm text-clean-600 mb-2">
              {param.label || param.name}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {param.options?.map(option => {
                const isSelected = value === option.value
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-nature-400 bg-nature-50'
                        : 'border-clean-200 hover:border-clean-300'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`${stepTemplateId}-${param.name}`}
                      value={option.value}
                      checked={isSelected}
                      disabled={option.disabled}
                      onChange={() => updateStepParam(stepTemplateId, param.name, option.value)}
                      className="w-5 h-5 border-clean-300 text-nature-500 focus:ring-nature-200"
                    />
                    <span className="text-clean-700">{option.label}</span>
                  </label>
                )
              })}
            </div>
            {param.hint && (
              <p className="text-xs text-clean-400 mt-1">{param.hint}</p>
            )}
          </div>
        )

      default:
        // 默认作为文本输入框处理
        return (
          <div>
            <Input
              label={param.label || param.name}
              value={value as string || ''}
              onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
              placeholder={param.placeholder || undefined}
            />
            {param.hint && (
              <p className="text-xs text-clean-400 mt-1">{param.hint}</p>
            )}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-clean-400">加载中...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-clean-400 mb-4">任务不存在</div>
        <Button variant="secondary" onClick={() => navigate('/tasks')}>
          返回列表
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <Button variant="ghost" onClick={() => navigate('/tasks')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回任务列表
      </Button>

      {/* 任务基本信息 */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge ${getStatusClass(task.status)}`}>
                  {taskStatusMap[task.status]?.label || task.status}
                </span>
                <span className="text-sm text-clean-500">任务编号: {task.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-clean-900 mb-4">
                {task.taskTemplateName}
              </h1>
              <div className="flex items-center gap-6 text-sm text-clean-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {task.siteName} ({task.siteCode})
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  触发: {formatTime(task.triggerTime)}
                </span>
                {task.startTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    开始: {formatTime(task.startTime)}
                  </span>
                )}
                {task.endTime && (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    完成: {formatTime(task.endTime)}
                  </span>
                )}
              </div>
              {task.operator && (
                <div className="flex items-center gap-2 mt-3 text-sm text-clean-500">
                  <User className="w-4 h-4" />
                  处理人: {task.operator}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            {(task.status === 'PENDING' || task.status === 'EXPIRING') && (
              <Button onClick={handleStart}>
                <Play className="w-4 h-4 mr-2" />
                开始执行
              </Button>
            )}
            {task.status === 'IN_PROGRESS' && (
              <Button onClick={handleComplete} loading={processing}>
                <Check className="w-4 h-4 mr-2" />
                完成
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 步骤执行区域 */}
      {task.status !== 'PENDING' && task.status !== 'EXPIRING' && task.taskTemplateItems && task.taskTemplateItems.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-clean-900">执行步骤</h2>
          </CardHeader>
          <CardContent>
            {/* 步骤指示器 */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {task.taskTemplateItems.map((item, index) => {
                const isActive = index === activeStepIndex
                const isFilled = isStepFilled(item.stepTemplateId)
                const isCompleted = task.steps?.some(
                  s => s.stepTemplateId === item.stepTemplateId && s.hasAnyParameter()
                )

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveStepIndex(index)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap
                      ${isActive
                        ? 'bg-nature-500 text-white'
                        : isCompleted
                          ? 'bg-nature-100 text-nature-700'
                          : 'bg-clean-100 text-clean-600'
                      }
                    `}
                  >
                    {isCompleted || isFilled ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                    <span className="font-medium">{item.itemName}</span>
                  </button>
                )
              })}
            </div>

            {/* 当前步骤详情 */}
            {task.taskTemplateItems[activeStepIndex] && (
              <div className="border border-clean-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-clean-100">
                  <FileText className="w-5 h-5 text-nature-500" />
                  <h3 className="font-medium text-clean-900">
                    {task.taskTemplateItems[activeStepIndex].itemName}
                  </h3>
                  <span className="text-sm text-clean-400">
                    ({task.taskTemplateItems[activeStepIndex].stepTemplate?.name})
                  </span>
                </div>

                {task.taskTemplateItems[activeStepIndex].stepTemplate?.description && (
                  <p className="text-sm text-clean-600 mb-4">
                    {task.taskTemplateItems[activeStepIndex].stepTemplate?.description}
                  </p>
                )}

                {/* 参数表单 */}
                <div className="space-y-4">
                  {task.taskTemplateItems[activeStepIndex].stepTemplate?.parameters?.map(param => (
                    <div key={param.name}>
                      {renderParameterInput(
                        param,
                        task.taskTemplateItems[activeStepIndex].stepTemplateId
                      )}
                    </div>
                  ))}
                  {(!task.taskTemplateItems[activeStepIndex].stepTemplate?.parameters ||
                    task.taskTemplateItems[activeStepIndex].stepTemplate!.parameters!.length === 0) && (
                    <p className="text-sm text-clean-400 text-center py-4">
                      该步骤无需填写参数
                    </p>
                  )}
                </div>

                {/* 保存按钮 */}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => handleProcess(false)}
                    loading={processing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    保存进度
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 历史记录 */}
      {task.status === 'COMPLETED' && task.steps && task.steps.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-clean-900">执行记录</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {task.steps.map((step: Step) => (
                <div key={step.id} className="p-4 bg-clean-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-clean-800">{step.stepName}</span>
                    <span className="text-sm text-clean-400">
                      {formatTime(step.createTime)}
                    </span>
                  </div>
                  {step.parameterValues && step.parameterValues.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {step.parameterValues.map((pv: ParameterValue) => {
                        const isArray = Array.isArray(pv.value)
                        // 检查是否为图片数组
                        const isImageArray = isArray && (pv.value as string[]).some(v =>
                          v.startsWith('http') || v.includes('/api/common/image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(v)
                        )
                        // 检查是否为单个图片
                        const valueStr = String(pv.value)
                        const isSingleImage = !isArray && (
                          valueStr.startsWith('http') ||
                          valueStr.includes('/api/common/image/') ||
                          /\.(jpg|jpeg|png|gif|webp)$/i.test(valueStr)
                        )

                        return (
                          <div key={pv.name} className="text-sm">
                            <span className="text-clean-500">{pv.name}:</span>
                            {isImageArray ? (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {(pv.value as string[]).map((imgUrl, idx) => (
                                  <img
                                    key={idx}
                                    src={commonApi.getImageUrl(imgUrl)}
                                    alt={`${pv.name}-${idx + 1}`}
                                    className="w-16 h-16 rounded-lg border border-clean-200 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => window.open(commonApi.getImageUrl(imgUrl), '_blank')}
                                  />
                                ))}
                              </div>
                            ) : isSingleImage ? (
                              <div className="mt-1">
                                <img
                                  src={commonApi.getImageUrl(valueStr)}
                                  alt={pv.name}
                                  className="w-16 h-16 rounded-lg border border-clean-200 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(commonApi.getImageUrl(valueStr), '_blank')}
                                />
                              </div>
                            ) : isArray ? (
                              <span className="text-clean-800 ml-2">
                                {(pv.value as string[]).join(', ')}
                              </span>
                            ) : (
                              <span className="text-clean-800 ml-2">
                                {valueStr}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
