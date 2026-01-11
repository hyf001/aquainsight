import React, { useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  /** 选项列表 */
  options: SelectOption[]
  /** 当前值 */
  value?: string | number
  /** 变化回调 */
  onChange?: (value: string | number) => void
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否有错误 */
  error?: boolean
  /** 是否允许清空 */
  allowClear?: boolean
  /** 是否显示搜索 */
  showSearch?: boolean
  /** 前缀图标 */
  prefix?: React.ReactNode
  /** 选择模式: 'single' | 'multiple' */
  mode?: 'single' | 'multiple'
  /** 自定义类名 */
  className?: string
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = '请选择',
      disabled = false,
      error = false,
      allowClear = false,
      showSearch = false,
      prefix,
      className,
    },
    ref
  ) => {
    const [searchText, setSearchText] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const selectedOption = options.find((opt) => opt.value === value)

    const filteredOptions = showSearch
      ? options.filter(opt =>
          opt.label.toLowerCase().includes(searchText.toLowerCase())
        )
      : options

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.(undefined as any)
      setSearchText('')
    }

    return (
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className={cn('relative', className)}>
            <Listbox.Button
              ref={ref}
              className={cn(
                'relative w-full px-4 py-2 text-left bg-white border rounded-lg cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent',
                'transition-colors',
                error ? 'border-red-500' : 'border-gray-300',
                disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
                !disabled && 'hover:border-ocean-teal'
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex items-center gap-2">
                {prefix && <span className="text-gray-400">{prefix}</span>}
                <span className={cn('flex-1 truncate', !selectedOption && 'text-gray-400')}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </div>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
              </span>
              {allowClear && selectedOption && !disabled && (
                <span
                  className="absolute inset-y-0 right-6 flex items-center"
                  onClick={handleClear}
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </span>
              )}
            </Listbox.Button>

            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {showSearch && (
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-ocean-teal"
                        placeholder="搜索..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
                <div className="max-h-60 overflow-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      没有找到匹配项
                    </div>
                  ) : (
                    <Listbox.Options className="py-1">
                      {filteredOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          className={({ active, disabled }) =>
                            cn(
                              'relative cursor-pointer select-none py-2 pl-10 pr-4',
                              active && !disabled && 'bg-ocean-teal/10 text-ocean-teal',
                              disabled && 'text-gray-400 cursor-not-allowed',
                              !active && !disabled && 'text-gray-900'
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={cn(
                                  'block truncate',
                                  selected ? 'font-medium' : 'font-normal'
                                )}
                              >
                                {option.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ocean-teal">
                                  <CheckIcon className="w-5 h-5" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  )}
                </div>
              </div>
            </Transition>
          </div>
        )}
      </Listbox>
    )
  }
)

Select.displayName = 'Select'

export default Select
