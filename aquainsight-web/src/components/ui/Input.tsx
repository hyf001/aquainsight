import { forwardRef, useState, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { X, Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
  clearable?: boolean
  showCount?: boolean
  showPasswordToggle?: boolean
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    icon,
    suffix,
    clearable = false,
    showCount = false,
    showPasswordToggle = false,
    onClear,
    type = 'text',
    maxLength,
    value,
    onChange,
    onFocus,
    onBlur,
    disabled,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [internalValue, setInternalValue] = useState('')

    const currentValue = value !== undefined ? String(value) : internalValue
    const currentLength = currentValue.length

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }, [onFocus])

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }, [onBlur])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }, [value, onChange])

    const handleClear = useCallback(() => {
      if (value === undefined) {
        setInternalValue('')
      }
      onClear?.()
      // 触发一个合成的 change 事件
      const input = document.createElement('input')
      input.value = ''
      const event = new Event('input', { bubbles: true })
      Object.defineProperty(event, 'target', { value: { value: '' } })
    }, [value, onClear])

    const inputType = showPasswordToggle && type === 'password'
      ? (showPassword ? 'text' : 'password')
      : type

    const showClearButton = clearable && currentValue && !disabled
    const showSuffix = suffix || showClearButton || (showPasswordToggle && type === 'password')

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            'block text-sm font-medium mb-2 transition-colors duration-200',
            isFocused ? 'text-nature-600' : 'text-clean-700',
            error && 'text-red-500'
          )}>
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
              isFocused ? 'text-nature-500' : 'text-clean-400',
              error && 'text-red-400'
            )}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 bg-white border rounded-xl',
              'text-clean-800 placeholder-clean-400',
              'transition-all duration-200',
              'focus:outline-none',
              // 正常状态
              !error && !isFocused && 'border-clean-300 hover:border-clean-400',
              // 聚焦状态
              !error && isFocused && 'border-nature-400 ring-2 ring-nature-100 shadow-sm',
              // 错误状态
              error && 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100',
              // 禁用状态
              disabled && 'bg-clean-100 text-clean-400 cursor-not-allowed border-clean-200',
              // 图标padding
              icon && 'pl-10',
              // 后缀padding
              showSuffix && 'pr-10',
              className
            )}
            {...props}
          />
          {showSuffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {showClearButton && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    'p-1 rounded-full text-clean-400 hover:text-clean-600 hover:bg-clean-100',
                    'transition-all duration-150 focus:outline-none'
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'p-1 rounded-full text-clean-400 hover:text-clean-600 hover:bg-clean-100',
                    'transition-all duration-150 focus:outline-none'
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
              {suffix}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {showCount && maxLength && (
            <p className={cn(
              'text-xs ml-auto',
              currentLength > maxLength * 0.9 ? 'text-amber-500' : 'text-clean-400',
              currentLength >= maxLength && 'text-red-500'
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = 'Input'
