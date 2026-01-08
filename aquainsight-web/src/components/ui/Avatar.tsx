import React from 'react'
import { cn } from '@/utils/cn'
import { UserIcon } from '@heroicons/react/24/outline'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ReactNode
  shape?: 'circle' | 'square'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', icon, shape = 'circle', children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    }

    const shapeStyles = {
      circle: 'rounded-full',
      square: 'rounded-lg',
    }

    const content = src ? (
      <img src={src} alt={alt || 'Avatar'} className="h-full w-full object-cover" />
    ) : children ? (
      <div className="flex h-full w-full items-center justify-center bg-ocean-teal text-white font-medium uppercase">
        {children}
      </div>
    ) : icon ? (
      <div className="flex h-full w-full items-center justify-center bg-ocean-seafoam text-ocean-navy">
        {icon}
      </div>
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-ocean-seafoam text-ocean-navy">
        <UserIcon className="h-3/5 w-3/5" />
      </div>
    )

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center overflow-hidden flex-shrink-0',
          sizeStyles[size],
          shapeStyles[shape],
          className
        )}
        {...props}
      >
        {content}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
