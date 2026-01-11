import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, Circle, Play, Check, Upload,
  Calendar, MapPin, User, Clock, FileText
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
} from '@/services/maintenance'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [stepData, setStepData] = useState<Record<number, Record<string, unknown>>>({})

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

  // 渲染参数输入
  const renderParameterInput = (param: {
    name: string
    label: string
    type: string
    required?: boolean
    placeholder?: string
    options?: { value: string; label: string }[]
  }, stepTemplateId: number) => {
    const value = getStepData(stepTemplateId)[param.name]

    switch (param.type) {
      case 'text':
        return (
          <Input
            label={param.label}
            value={value as string || ''}
            onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
            placeholder={param.placeholder}
          />
        )
      case 'textarea':
        return (
          <div>
            <label className="block text-sm text-clean-600 mb-2">{param.label}</label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-clean-300 rounded-xl text-clean-800 placeholder-clean-400 focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100 transition-all duration-200"
              rows={4}
              value={value as string || ''}
              onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
              placeholder={param.placeholder}
            />
          </div>
        )
      case 'number':
        return (
          <Input
            type="number"
            label={param.label}
            value={value as number || ''}
            onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
            placeholder={param.placeholder}
          />
        )
      case 'select':
        return (
          <Select
            label={param.label}
            value={String(value || '')}
            onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
            options={[
              { value: '', label: param.placeholder || '请选择' },
              ...(param.options?.map(o => ({ value: o.value, label: o.label })) || []),
            ]}
          />
        )
      case 'date':
        return (
          <Input
            type="date"
            label={param.label}
            value={value as string || ''}
            onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
          />
        )
      case 'datetime':
        return (
          <Input
            type="datetime-local"
            label={param.label}
            value={value as string || ''}
            onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
          />
        )
      case 'checkbox':
        return (
          <div>
            <label className="block text-sm text-clean-600 mb-2">{param.label}</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean || false}
                onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.checked)}
                className="w-5 h-5 rounded border-clean-300 text-nature-500 focus:ring-nature-200"
              />
              <span className="text-clean-700">{param.placeholder || '是'}</span>
            </label>
          </div>
        )
      default:
        return (
          <Input
            label={param.label}
            value={value as string || ''}
            onChange={(e) => updateStepParam(stepTemplateId, param.name, e.target.value)}
            placeholder={param.placeholder}
          />
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
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {step.parameterValues.map((pv: ParameterValue) => (
                        <div key={pv.name} className="text-sm">
                          <span className="text-clean-500">{pv.name}:</span>
                          <span className="text-clean-800 ml-2">
                            {String(pv.value)}
                          </span>
                        </div>
                      ))}
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
