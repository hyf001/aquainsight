import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, icon, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      primary: 'bg-ocean-navy text-ocean-cream hover:bg-opacity-90 focus:ring-ocean-navy',
      secondary: 'bg-ocean-teal text-white hover:bg-opacity-90 focus:ring-ocean-teal',
      accent: 'bg-ocean-seafoam text-ocean-navy hover:bg-opacity-90 focus:ring-ocean-seafoam',
      outline: 'border-2 border-ocean-navy text-ocean-navy hover:bg-ocean-navy hover:text-ocean-cream focus:ring-ocean-navy',
      ghost: 'text-ocean-navy hover:bg-ocean-cream focus:ring-ocean-navy',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && !loading && icon}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
