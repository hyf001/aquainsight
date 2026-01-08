import React from 'react'
import { Switch as HeadlessSwitch } from '@headlessui/react'
import { cn } from '@/utils/cn'

export interface SwitchProps {
  /** 是否选中 */
  checked?: boolean
  /** 变化回调 */
  onChange?: (checked: boolean) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onChange, disabled = false, className }, ref) => {
    return (
      <HeadlessSwitch
        ref={ref}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:ring-offset-2',
          checked ? 'bg-ocean-teal' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer',
          className
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </HeadlessSwitch>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
