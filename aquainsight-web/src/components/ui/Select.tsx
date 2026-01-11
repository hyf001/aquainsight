import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-clean-600 mb-2">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-white border border-clean-300 rounded-xl appearance-none',
              'text-clean-800 placeholder-clean-400',
              'focus:outline-none focus:border-nature-400 focus:ring-2 focus:ring-nature-100',
              'transition-all duration-200 cursor-pointer',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-clean-400 pointer-events-none" />
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'
