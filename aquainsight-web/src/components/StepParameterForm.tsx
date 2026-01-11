import React from 'react'
import { Input, Select, Checkbox } from '@/components/ui'
import { RadioGroup, Radio } from '@/components/ui/Radio'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import type { JobParameter } from '@/services/maintenance'

interface StepParameterFormProps {
  /**
   * 参数配置
   */
  parameter: JobParameter
  /**
   * 步骤模板ID（用于生成唯一的字段名）
   */
  stepTemplateId: number
  /**
   * 是否为预览模式（预览模式下不渲染实际控件，只显示配置）
   */
  preview?: boolean
  /**
   * 是否显示标签（默认true）
   */
  showLabel?: boolean
}

/**
 * 步骤参数表单项组件
 * 用于动态渲染不同类型的参数控件
 */
export const StepParameterFormItem: React.FC<StepParameterFormProps> = ({
  parameter,
  preview = false,
  showLabel = true,
}) => {
  // 渲染表单控件
  const renderControl = () => {
    if (preview) {
      // 预览模式：显示参数配置信息
      return (
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-sm">
            <div><strong>类型:</strong> {getTypeLabel(parameter.type)}</div>
            {parameter.placeholder && <div><strong>占位符:</strong> {parameter.placeholder}</div>}
            {parameter.defaultValue && <div><strong>默认值:</strong> {parameter.defaultValue}</div>}
            {parameter.maxLength && <div><strong>最大长度:</strong> {parameter.maxLength}</div>}
            {parameter.minLength && <div><strong>最小长度:</strong> {parameter.minLength}</div>}
            {parameter.maxSelect && <div><strong>最多选择:</strong> {parameter.maxSelect}项</div>}
            {parameter.minSelect && <div><strong>最少选择:</strong> {parameter.minSelect}项</div>}
            {parameter.options && parameter.options.length > 0 && (
              <div className="mt-2">
                <strong>选项:</strong>
                <ul className="mt-1 pl-5 list-disc">
                  {parameter.options.map((opt, idx) => (
                    <li key={idx}>
                      {opt.label} ({opt.value})
                      {opt.defaultSelected && <span className="text-ocean-teal"> [默认]</span>}
                      {opt.disabled && <span className="text-gray-400"> [禁用]</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )
    }

    // 正常模式：渲染实际的表单控件
    switch (parameter.type) {
      case 'TEXT':
        return (
          <Input
            placeholder={parameter.placeholder || '请输入'}
            maxLength={parameter.maxLength}
          />
        )

      case 'IMAGE':
        return (
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-ocean-teal transition-colors cursor-pointer"
              onClick={() => {
                // 图片上传逻辑
              }}
            >
              <CloudArrowUpIcon className="w-6 h-6 text-gray-400" />
              <span className="mt-1 text-xs text-gray-500">上传图片</span>
            </button>
          </div>
        )

      case 'SELECT':
        return (
          <Select
            placeholder={parameter.placeholder || '请选择'}
            options={parameter.options?.map(opt => ({
              label: opt.label,
              value: opt.value,
              disabled: opt.disabled,
            })) || []}
          />
        )

      case 'RADIO':
        return (
          <RadioGroup>
            {parameter.options?.map(opt => (
              <Radio
                key={opt.value}
                value={opt.value}
                label={opt.label}
                disabled={opt.disabled}
              />
            ))}
          </RadioGroup>
        )

      case 'CHECKBOX':
        return (
          <div className="space-y-2">
            {parameter.options?.map(opt => (
              <Checkbox key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </Checkbox>
            ))}
          </div>
        )

      default:
        return <Input placeholder="未知参数类型" disabled />
    }
  }

  if (preview) {
    // 预览模式：不使用Form.Item包裹
    return (
      <div className="mb-4">
        {showLabel && (
          <div className="mb-2 font-medium">
            {parameter.label || parameter.name}
            {parameter.required && <span className="text-red-500"> *</span>}
          </div>
        )}
        {renderControl()}
        {parameter.hint && (
          <div className="mt-1 text-xs text-gray-500">
            {parameter.hint}
          </div>
        )}
      </div>
    )
  }

  // 正常模式
  return (
    <div className="mb-4">
      {showLabel ? (
        <>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {parameter.label || parameter.name}
            {parameter.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            {renderControl()}
          </div>
          {parameter.hint && (
            <div className="mt-1 text-xs text-gray-500">
              {parameter.hint}
            </div>
          )}
        </>
      ) : (
        renderControl()
      )}
    </div>
  )
}

/**
 * 获取参数类型的中文标签
 */
const getTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    TEXT: '文本输入',
    IMAGE: '图片上传',
    SELECT: '下拉选择',
    RADIO: '单选',
    CHECKBOX: '多选',
  }
  return typeMap[type] || type
}

export default StepParameterFormItem
