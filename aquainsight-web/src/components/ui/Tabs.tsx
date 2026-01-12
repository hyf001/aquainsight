import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface Tab {
  key: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeKey?: string
  defaultActiveKey?: string
  onChange?: (key: string) => void
  variant?: 'line' | 'pills' | 'enclosed'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

export function Tabs({
  tabs,
  activeKey,
  defaultActiveKey,
  onChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className,
}: TabsProps) {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || tabs[0]?.key)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const currentKey = activeKey ?? internalActiveKey

  // 更新指示器位置
  useEffect(() => {
    const activeTab = tabRefs.current.get(currentKey)
    if (activeTab && tabsRef.current) {
      const containerRect = tabsRef.current.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      })
    }
  }, [currentKey, tabs])

  const handleTabClick = (key: string) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key)
    }
    onChange?.(key)
  }

  const sizeStyles = {
    sm: 'text-sm py-2 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-5',
  }

  const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
    const base = cn(
      'relative flex items-center gap-2 font-medium transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-nature-400 focus-visible:ring-offset-2',
      sizeStyles[size],
      fullWidth && 'flex-1 justify-center',
      isDisabled && 'opacity-50 cursor-not-allowed'
    )

    switch (variant) {
      case 'line':
        return cn(
          base,
          isActive ? 'text-nature-600' : 'text-clean-500 hover:text-clean-700'
        )
      case 'pills':
        return cn(
          base,
          'rounded-lg',
          isActive
            ? 'bg-nature-500 text-white shadow-sm'
            : 'text-clean-600 hover:bg-clean-100'
        )
      case 'enclosed':
        return cn(
          base,
          'rounded-t-lg border-x border-t',
          isActive
            ? 'bg-white text-nature-600 border-clean-200 -mb-px'
            : 'bg-clean-50 text-clean-500 border-transparent hover:text-clean-700'
        )
      default:
        return base
    }
  }

  return (
    <div
      ref={tabsRef}
      className={cn(
        'relative flex',
        variant === 'line' && 'border-b border-clean-200',
        variant === 'pills' && 'gap-1 p-1 bg-clean-100 rounded-xl',
        variant === 'enclosed' && 'border-b border-clean-200',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === currentKey
        const isDisabled = tab.disabled ?? false

        return (
          <button
            key={tab.key}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.key, el)
            }}
            onClick={() => !isDisabled && handleTabClick(tab.key)}
            disabled={isDisabled}
            className={getTabStyles(isActive, isDisabled)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        )
      })}

      {/* 下划线指示器 (仅 line 变体) */}
      {variant === 'line' && (
        <motion.div
          className="absolute bottom-0 h-0.5 bg-nature-500 rounded-full"
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </div>
  )
}

// TabPanel 组件
interface TabPanelProps {
  children: React.ReactNode
  className?: string
}

export function TabPanel({ children, className }: TabPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('py-4', className)}
    >
      {children}
    </motion.div>
  )
}

// Switch 开关组件
interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = checked ?? internalChecked

  const handleToggle = () => {
    if (disabled) return
    const newValue = !isChecked
    if (checked === undefined) {
      setInternalChecked(newValue)
    }
    onChange?.(newValue)
  }

  const sizeStyles = {
    sm: { track: 'w-8 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-3.5' },
    md: { track: 'w-10 h-6', thumb: 'w-4.5 h-4.5', translate: 'translate-x-4' },
    lg: { track: 'w-12 h-7', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  }

  const styles = sizeStyles[size]

  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer', disabled && 'cursor-not-allowed opacity-50', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-nature-400 focus-visible:ring-offset-2',
          styles.track,
          isChecked ? 'bg-nature-500' : 'bg-clean-300'
        )}
      >
        <motion.span
          className={cn(
            'absolute left-0.5 bg-white rounded-full shadow-sm',
            styles.thumb
          )}
          animate={{ x: isChecked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {label && <span className="text-sm text-clean-700">{label}</span>}
    </label>
  )
}

// Checkbox 复选框组件
interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  indeterminate?: boolean
  label?: string
  description?: string
  className?: string
}

export function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  label,
  description,
  className,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = checked ?? internalChecked

  const handleToggle = () => {
    if (disabled) return
    const newValue = !isChecked
    if (checked === undefined) {
      setInternalChecked(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <label className={cn('inline-flex items-start gap-3 cursor-pointer', disabled && 'cursor-not-allowed opacity-50', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : isChecked}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-nature-400 focus-visible:ring-offset-2',
          isChecked || indeterminate
            ? 'bg-nature-500 border-nature-500'
            : 'bg-white border-clean-300 hover:border-clean-400'
        )}
      >
        {isChecked && !indeterminate && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
        {indeterminate && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2.5 h-0.5 bg-white rounded-full"
          />
        )}
      </button>
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-clean-700">{label}</span>}
          {description && <p className="text-xs text-clean-500 mt-0.5">{description}</p>}
        </div>
      )}
    </label>
  )
}

// Radio 单选框组件
interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onChange,
  name,
  direction = 'vertical',
  className,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue

  const handleChange = (optionValue: string) => {
    if (value === undefined) {
      setInternalValue(optionValue)
    }
    onChange?.(optionValue)
  }

  return (
    <div
      role="radiogroup"
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col gap-3' : 'flex-row gap-6',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === currentValue
        const isDisabled = option.disabled ?? false

        return (
          <label
            key={option.value}
            className={cn(
              'inline-flex items-start gap-3 cursor-pointer',
              isDisabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => !isDisabled && handleChange(option.value)}
              disabled={isDisabled}
              className={cn(
                'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-nature-400 focus-visible:ring-offset-2',
                isSelected
                  ? 'border-nature-500'
                  : 'border-clean-300 hover:border-clean-400'
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 rounded-full bg-nature-500"
                />
              )}
            </button>
            <div>
              <span className="text-sm font-medium text-clean-700">{option.label}</span>
              {option.description && (
                <p className="text-xs text-clean-500 mt-0.5">{option.description}</p>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}
