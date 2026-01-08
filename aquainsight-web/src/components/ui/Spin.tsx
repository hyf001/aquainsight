import React from 'react'
import { cn } from '@/utils/cn'

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  tip?: string
  spinning?: boolean
}

const Spin = React.forwardRef<HTMLDivElement, SpinProps>(
  ({ className, size = 'md', tip, spinning = true, children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-3',
      lg: 'h-12 w-12 border-4',
    }

    if (!spinning && !children) {
      return null
    }

    const spinner = (
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className={cn(
            'animate-spin rounded-full border-ocean-teal border-t-transparent',
            sizeStyles[size]
          )}
        />
        {tip && <div className="text-sm text-gray-500">{tip}</div>}
      </div>
    )

    if (!children) {
      return (
        <div ref={ref} className={cn('flex items-center justify-center', className)} {...props}>
          {spinner}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {spinning && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
            {spinner}
          </div>
        )}
        {children}
      </div>
    )
  }
)

Spin.displayName = 'Spin'

export default Spin
