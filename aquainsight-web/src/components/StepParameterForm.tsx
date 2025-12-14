import React from 'react'
import { Form, Input, Select, Radio, Checkbox, Upload, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd'
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
   * 表单实例（可选，用于在表单中渲染）
   */
  form?: FormInstance
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
  stepTemplateId,
  form,
  preview = false,
  showLabel = true,
}) => {
  const fieldName = `step_${stepTemplateId}_${parameter.name}`

  // 渲染表单控件
  const renderControl = () => {
    if (preview) {
      // 预览模式：显示参数配置信息
      return (
        <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div><strong>类型:</strong> {getTypeLabel(parameter.type)}</div>
          {parameter.placeholder && <div><strong>占位符:</strong> {parameter.placeholder}</div>}
          {parameter.defaultValue && <div><strong>默认值:</strong> {parameter.defaultValue}</div>}
          {parameter.maxLength && <div><strong>最大长度:</strong> {parameter.maxLength}</div>}
          {parameter.minLength && <div><strong>最小长度:</strong> {parameter.minLength}</div>}
          {parameter.maxSelect && <div><strong>最多选择:</strong> {parameter.maxSelect}项</div>}
          {parameter.minSelect && <div><strong>最少选择:</strong> {parameter.minSelect}项</div>}
          {parameter.options && parameter.options.length > 0 && (
            <div>
              <strong>选项:</strong>
              <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20 }}>
                {parameter.options.map((opt, idx) => (
                  <li key={idx}>
                    {opt.label} ({opt.value})
                    {opt.defaultSelected && <span style={{ color: '#1890ff' }}> [默认]</span>}
                    {opt.disabled && <span style={{ color: '#999' }}> [禁用]</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
            showCount={!!parameter.maxLength}
          />
        )

      case 'IMAGE':
        return (
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false} // 阻止自动上传，需要手动处理
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        )

      case 'SELECT':
        return (
          <Select
            placeholder={parameter.placeholder || '请选择'}
            options={parameter.options?.map(opt => ({
              label: opt.label,
              value: opt.value,
              disabled: opt.disabled,
            }))}
          />
        )

      case 'RADIO':
        return (
          <Radio.Group>
            <Space direction="vertical">
              {parameter.options?.map(opt => (
                <Radio key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )

      case 'CHECKBOX':
        return (
          <Checkbox.Group>
            <Space direction="vertical">
              {parameter.options?.map(opt => (
                <Checkbox key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        )

      default:
        return <Input placeholder="未知参数类型" disabled />
    }
  }

  // 构建验证规则
  const getRules = () => {
    if (preview) return []

    const rules: any[] = []

    // 必填验证
    if (parameter.required) {
      rules.push({
        required: true,
        message: `请${parameter.type === 'TEXT' ? '输入' : '选择'}${parameter.label || parameter.name}`,
      })
    }

    // 最小长度验证
    if (parameter.minLength) {
      rules.push({
        min: parameter.minLength,
        message: `最少输入${parameter.minLength}个字符`,
      })
    }

    // 复选框选择数量验证
    if (parameter.type === 'CHECKBOX' && (parameter.minSelect || parameter.maxSelect)) {
      rules.push({
        validator: (_: any, value: any) => {
          if (value && Array.isArray(value)) {
            if (parameter.minSelect && value.length < parameter.minSelect) {
              return Promise.reject(new Error(`至少选择${parameter.minSelect}项`))
            }
            if (parameter.maxSelect && value.length > parameter.maxSelect) {
              return Promise.reject(new Error(`最多选择${parameter.maxSelect}项`))
            }
          }
          return Promise.resolve()
        },
      })
    }

    return rules
  }

  if (preview) {
    // 预览模式：不使用Form.Item包裹
    return (
      <div style={{ marginBottom: 16 }}>
        {showLabel && (
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            {parameter.label || parameter.name}
            {parameter.required && <span style={{ color: 'red' }}> *</span>}
          </div>
        )}
        {renderControl()}
        {parameter.hint && (
          <div style={{ marginTop: 4, fontSize: '12px', color: '#999' }}>
            {parameter.hint}
          </div>
        )}
      </div>
    )
  }

  // 正常模式：使用Form.Item
  return (
    <Form.Item
      key={fieldName}
      label={showLabel ? (parameter.label || parameter.name) : undefined}
      name={fieldName}
      rules={getRules()}
      extra={parameter.hint}
    >
      {renderControl()}
    </Form.Item>
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
