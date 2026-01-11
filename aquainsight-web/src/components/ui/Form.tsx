import React, { createContext, useContext } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form'
import { cn } from '@/utils/cn'

type FormContextValue<TFieldValues extends FieldValues = FieldValues> = UseFormReturn<TFieldValues>

const FormContext = createContext<FormContextValue | null>(null)

export const useFormContext = <TFieldValues extends FieldValues = FieldValues>() => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }
  return context as UseFormReturn<TFieldValues>
}

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** React Hook Form 配置 */
  form?: UseFormReturn<TFieldValues>
  /** 表单提交处理函数 */
  onSubmit?: SubmitHandler<TFieldValues>
  /** 表单布局 */
  layout?: 'horizontal' | 'vertical'
  /** 是否禁用所有表单项 */
  disabled?: boolean
  /** 子元素 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
}

function FormInner<TFieldValues extends FieldValues = FieldValues>(
  {
    form: externalForm,
    onSubmit,
    layout = 'vertical',
    disabled = false,
    children,
    className,
    ...props
  }: FormProps<TFieldValues>,
  ref: React.Ref<HTMLFormElement>
) {
  // 如果外部传入了 form，使用外部的；否则创建一个新的
  const internalForm = useForm<TFieldValues>()
  const form = externalForm || internalForm

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) {
      form.handleSubmit(onSubmit)(e)
    }
  }

  return (
    <FormContext.Provider value={form as FormContextValue}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          'w-full',
          layout === 'vertical' && 'space-y-4',
          layout === 'horizontal' && 'space-y-3',
          className
        )}
        {...props}
      >
        <fieldset disabled={disabled} className="space-y-4">
          {children}
        </fieldset>
      </form>
    </FormContext.Provider>
  )
}

// 使用泛型 forwardRef
const FormComponent = React.forwardRef(FormInner) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues> & { ref?: React.Ref<HTMLFormElement> }
) => React.ReactElement

FormComponent.displayName = 'Form'

export default FormComponent
