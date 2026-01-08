import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface TagProps {
  /** 标签内容 */
  children?: React.ReactNode
  /** 颜色类型 */
  color?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'blue'
    | 'green'
    | 'red'
    | 'orange'
    | 'purple'
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: (e: React.MouseEvent) => void
  /** 自定义类名 */
  className?: string
}

const Tag: React.FC<TagProps> = ({
  children,
  color = 'default',
  closable = false,
  onClose,
  className,
}) => {
  const colorClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-ocean-navy/10 text-ocean-navy border-ocean-navy/20',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.(e)
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border',
        'transition-colors',
        colorClasses[color],
        className
      )}
    >
      <span>{children}</span>
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          className="hover:opacity-70 transition-opacity"
        >
          <XMarkIcon className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

Tag.displayName = 'Tag'

export default Tag
