import React, { createContext, useContext } from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { cn } from '@/utils/cn'

interface RadioGroupContextValue {
  value?: string | number
  onChange?: (value: string | number) => void
  disabled?: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps {
  /** 当前值 */
  value?: string | number
  /** 变化回调 */
  onChange?: (value: string | number) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 子元素 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  disabled = false,
  children,
  className,
}) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, disabled }}>
      <HeadlessRadioGroup
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn('space-y-2', className)}
      >
        {children}
      </HeadlessRadioGroup>
    </RadioGroupContext.Provider>
  )
}

export interface RadioProps {
  /** 单选框的值 */
  value: string | number
  /** 标签文字 */
  label?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 是否选中 (受控模式) */
  checked?: boolean
  /** 自定义类名 */
  className?: string
}

export const Radio: React.FC<RadioProps> = ({ value, label, disabled, checked: checkedProp, className }) => {
  const context = useContext(RadioGroupContext)

  // 如果没有传入 checked，则使用 context 中的值
  const isChecked = checkedProp ?? (context?.value === value)

  return (
    <label
      className={cn(
        'flex items-center gap-2 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative">
        <input
          type="radio"
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={() => {
            if (!disabled) {
              context?.onChange?.(value)
            }
          }}
          className="sr-only"
        />
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 transition-colors',
            isChecked
              ? 'border-ocean-teal bg-white'
              : 'border-gray-300 bg-white',
            !disabled && 'hover:border-ocean-teal'
          )}
        >
          {isChecked && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-ocean-teal" />
          )}
        </div>
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
}

RadioGroup.displayName = 'RadioGroup'
Radio.displayName = 'Radio'

export default Radio
