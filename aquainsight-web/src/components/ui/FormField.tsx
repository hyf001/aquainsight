import React from 'react'
import { Controller, FieldValues, Path, ControllerProps, FieldError } from 'react-hook-form'
import { useFormContext } from './Form'
import { cn } from '@/utils/cn'

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** 字段名称 */
  name: Path<TFieldValues>
  /** 字段标签 */
  label?: React.ReactNode
  /** 字段描述 */
  description?: React.ReactNode
  /** 是否必填 */
  required?: boolean
  /** 布局方式 */
  layout?: 'horizontal' | 'vertical'
  /** 标签宽度（仅在 horizontal 布局下生效） */
  labelWidth?: string
  /** 自定义类名 */
  className?: string
  /** 渲染函数 */
  children: ControllerProps<TFieldValues>['render']
  /** 验证规则 */
  rules?: ControllerProps<TFieldValues>['rules']
}

function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required = false,
  layout = 'vertical',
  labelWidth = '120px',
  className,
  children,
  rules,
}: FormFieldProps<TFieldValues>) {
  const { control, formState } = useFormContext<TFieldValues>()
  const error = formState.errors[name] as FieldError | undefined

  return (
    <div
      className={cn(
        'form-field',
        layout === 'horizontal' && 'flex items-start',
        layout === 'vertical' && 'flex flex-col',
        className
      )}
    >
      {label && (
        <label
          className={cn(
            'text-sm font-medium text-gray-700',
            layout === 'horizontal' && 'pt-2 flex-shrink-0',
            layout === 'vertical' && 'mb-1.5',
            required && "after:content-['*'] after:ml-1 after:text-red-500"
          )}
          style={layout === 'horizontal' ? { width: labelWidth } : undefined}
        >
          {label}
        </label>
      )}

      <div className={cn('flex-1', layout === 'horizontal' && 'ml-4')}>
        <Controller<TFieldValues>
          name={name}
          control={control}
          rules={rules}
          render={children}
        />

        {description && !error && (
          <div className="mt-1 text-xs text-gray-500">{description}</div>
        )}

        {error && (
          <div className="mt-1 text-xs text-red-500 flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error.message}
          </div>
        )}
      </div>
    </div>
  )
}

FormField.displayName = 'FormField'

export default FormField
