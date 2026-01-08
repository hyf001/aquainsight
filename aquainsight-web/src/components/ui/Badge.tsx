import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', dot, children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-ocean-navy text-ocean-cream',
      secondary: 'bg-ocean-teal text-white',
      accent: 'bg-ocean-seafoam text-ocean-navy',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
      danger: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }

    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            'inline-flex items-center gap-1.5',
            className
          )}
          {...props}
        >
          <span className={cn(
            'w-2 h-2 rounded-full',
            variantStyles[variant]
          )} />
          {children}
        </span>
      )
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
