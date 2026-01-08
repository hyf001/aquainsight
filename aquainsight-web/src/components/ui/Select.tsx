import React from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
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
      className,
    },
    ref
  ) => {
    const selectedOption = options.find((opt) => opt.value === value)

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
            >
              <span className={cn('block truncate', !selectedOption && 'text-gray-400')}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 w-full mt-1 overflow-auto bg-white rounded-lg shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option) => (
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
            </Transition>
          </div>
        )}
      </Listbox>
    )
  }
)

Select.displayName = 'Select'

export default Select
