import React from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 标签文字 */
  label?: React.ReactNode
  /** 半选状态 */
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, checked, disabled, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 border-2 rounded transition-colors',
              'peer-focus:ring-2 peer-focus:ring-ocean-teal peer-focus:ring-offset-2',
              checked || indeterminate
                ? 'bg-ocean-teal border-ocean-teal'
                : 'bg-white border-gray-300',
              disabled && 'bg-gray-100'
            )}
          >
            {(checked || indeterminate) && (
              <CheckIcon
                className={cn(
                  'w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  indeterminate && 'w-3 h-0.5 bg-white'
                )}
              />
            )}
          </div>
        </div>
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
