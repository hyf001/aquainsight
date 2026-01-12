import { forwardRef, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-medium rounded-xl',
      'transition-all duration-200 overflow-hidden',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'active:scale-[0.98]'
    )

    const variants = {
      primary: cn(
        'bg-gradient-to-r from-nature-500 to-nature-600 text-white',
        'hover:from-nature-400 hover:to-nature-500',
        'shadow-leaf hover:shadow-lg hover:shadow-nature-200',
        'focus-visible:ring-nature-500',
        'disabled:from-clean-300 disabled:to-clean-400 disabled:shadow-none'
      ),
      secondary: cn(
        'bg-white text-clean-800 border border-clean-200',
        'hover:bg-clean-50 hover:border-clean-300',
        'focus-visible:ring-clean-400',
        'disabled:bg-clean-100 disabled:text-clean-400 disabled:border-clean-200'
      ),
      ghost: cn(
        'bg-transparent text-clean-600',
        'hover:text-nature-600 hover:bg-nature-50',
        'focus-visible:ring-nature-400',
        'disabled:text-clean-300 disabled:bg-transparent'
      ),
      danger: cn(
        'bg-red-50 text-red-600 border border-red-200',
        'hover:bg-red-100 hover:border-red-300',
        'focus-visible:ring-red-400',
        'disabled:bg-red-50/50 disabled:text-red-300 disabled:border-red-100'
      ),
      outline: cn(
        'bg-transparent text-nature-600 border border-nature-300',
        'hover:bg-nature-50 hover:border-nature-400',
        'focus-visible:ring-nature-400',
        'disabled:text-clean-300 disabled:border-clean-200 disabled:bg-transparent'
      ),
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
      icon: 'p-2.5',
    }

    const iconSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      icon: 'w-5 h-5',
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return

      // 涟漪效果
      const button = buttonRef.current || (ref as React.RefObject<HTMLButtonElement>)?.current
      if (button) {
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()

        setRipples(prev => [...prev, { x, y, id }])
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id))
        }, 600)
      }

      onClick?.(e)
    }

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref || buttonRef}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isDisabled && 'cursor-not-allowed',
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {/* 涟漪效果 */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              marginLeft: -5,
              marginTop: -5,
              animation: 'ripple 0.6s ease-out forwards',
            }}
          />
        ))}

        {loading && (
          <Loader2 className={cn('animate-spin', iconSizes[size], children && 'mr-2')} />
        )}

        {!loading && icon && iconPosition === 'left' && (
          <span className={iconSizes[size]}>{icon}</span>
        )}

        {children}

        {!loading && icon && iconPosition === 'right' && (
          <span className={iconSizes[size]}>{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
