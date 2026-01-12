import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  error,
  size = 'md',
  className,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const selectRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((opt) => opt.value === value)

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base',
  }

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          const option = options[highlightedIndex]
          if (!option.disabled) {
            onChange?.(option.value)
            setIsOpen(false)
            setHighlightedIndex(-1)
          }
        } else {
          setIsOpen(!isOpen)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(0)
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }, [disabled, isOpen, highlightedIndex, options, onChange])

  // 滚动到高亮项
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  return (
    <div className="w-full" ref={selectRef} {...props}>
      {label && (
        <label className="block text-sm font-medium text-clean-700 mb-2">{label}</label>
      )}
      <div className="relative">
        {/* 触发按钮 */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'w-full bg-white border rounded-xl',
            'text-left flex items-center justify-between',
            'focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100',
            'transition-all duration-200',
            sizeStyles[size],
            disabled
              ? 'bg-clean-100 text-clean-400 cursor-not-allowed border-clean-200'
              : 'cursor-pointer border-clean-300 hover:border-clean-400',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            isOpen && 'border-nature-400 ring-2 ring-nature-100',
            className
          )}
        >
          <span className={cn(
            'truncate',
            !selectedOption && 'text-clean-400'
          )}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-clean-400 transition-transform duration-300 flex-shrink-0 ml-2',
              isOpen && 'rotate-180 text-nature-500'
            )}
          />
        </button>

        {/* 下拉选项列表 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute z-50 w-full mt-2 bg-white border border-clean-200 rounded-xl shadow-soft-lg overflow-hidden"
            >
              <div ref={listRef} className="max-h-60 overflow-y-auto py-1">
                {options.length === 0 ? (
                  <div className="px-4 py-3 text-clean-400 text-center">暂无选项</div>
                ) : (
                  options.map((option, index) => {
                    const isSelected = option.value === value
                    const isHighlighted = index === highlightedIndex
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        disabled={option.disabled}
                        className={cn(
                          'w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between',
                          option.disabled && 'opacity-50 cursor-not-allowed',
                          !option.disabled && 'hover:bg-nature-50',
                          isHighlighted && !option.disabled && 'bg-nature-50',
                          isSelected && 'bg-nature-100 text-nature-700 font-medium',
                          !isSelected && !option.disabled && 'text-clean-800'
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-nature-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
