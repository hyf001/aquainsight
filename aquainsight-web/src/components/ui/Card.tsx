import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  animate?: boolean
  onClick?: () => void
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const variantStyles = {
  default: 'bg-white border border-clean-200 shadow-soft',
  elevated: 'bg-white border border-clean-100 shadow-soft-lg',
  outlined: 'bg-white border-2 border-clean-200',
  glass: 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-soft',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = false, variant = 'default', padding = 'none', animate = false, onClick }, ref) => {
    const Component = animate ? motion.div : 'div'
    const animateProps = animate ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    } : {}

    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-2xl',
          variantStyles[variant],
          paddingStyles[padding],
          hover && 'hover:shadow-soft-lg hover:border-clean-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        {...animateProps}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn(
      'px-6 py-4 border-b border-clean-100 flex items-center justify-between',
      className
    )}>
      <div className="flex-1">{children}</div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

const alignStyles = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
}

export function CardFooter({ children, className, align = 'right' }: CardFooterProps) {
  return (
    <div className={cn(
      'px-6 py-4 border-t border-clean-100 flex items-center gap-3',
      alignStyles[align],
      className
    )}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
  subtitle?: string
}

export function CardTitle({ children, className, subtitle }: CardTitleProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-clean-900">{children}</h3>
      {subtitle && <p className="text-sm text-clean-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}
