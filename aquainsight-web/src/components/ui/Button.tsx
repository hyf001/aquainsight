import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98]'

    const variants = {
      primary: 'bg-gradient-to-r from-nature-500 to-nature-600 text-white hover:from-nature-400 hover:to-nature-500 shadow-leaf hover:shadow-lg hover:shadow-nature-200',
      secondary: 'bg-white text-clean-800 border border-clean-200 hover:bg-clean-50 hover:border-clean-300',
      ghost: 'bg-transparent text-clean-600 hover:text-nature-600 hover:bg-nature-50',
      danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
