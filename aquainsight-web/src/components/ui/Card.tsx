import React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  bordered?: boolean
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, bordered = true, shadow = 'md', children, ...props }, ref) => {
    const shadowStyles = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-lg',
          bordered && 'border border-gray-200',
          shadowStyles[shadow],
          hoverable && 'hover:shadow-lg transition-shadow duration-200 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean
  /** 额外内容 */
  extra?: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, bordered = true, extra, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4 flex items-center justify-between',
          bordered && 'border-b border-gray-200',
          className
        )}
        {...props}
      >
        <div>{children}</div>
        {extra && <div>{extra}</div>}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4',
          bordered && 'border-t border-gray-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export default Card
