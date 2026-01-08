import React from 'react'
import { cn } from '@/utils/cn'

export interface DividerProps {
  /** 分割线类型：水平或垂直 */
  type?: 'horizontal' | 'vertical'
  /** 文字方向 */
  orientation?: 'left' | 'center' | 'right'
  /** 分割线文字 */
  children?: React.ReactNode
  /** 是否使用虚线 */
  dashed?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

const Divider: React.FC<DividerProps> = ({
  type = 'horizontal',
  orientation = 'center',
  children,
  dashed = false,
  className,
  style,
}) => {
  if (type === 'vertical') {
    return (
      <div
        className={cn(
          'inline-block w-px h-4 mx-2 align-middle',
          dashed ? 'border-l border-dashed border-gray-300' : 'bg-gray-300',
          className
        )}
        style={style}
      />
    )
  }

  // 水平分割线
  const lineClass = cn(
    'flex-1 h-px',
    dashed ? 'border-t border-dashed border-gray-300' : 'bg-gray-300'
  )

  if (!children) {
    return (
      <div
        className={cn('my-4', className)}
        style={style}
      >
        <div className={lineClass} />
      </div>
    )
  }

  // 带文字的分割线
  return (
    <div
      className={cn('flex items-center my-4', className)}
      style={style}
    >
      {orientation !== 'left' && <div className={lineClass} />}
      <span
        className={cn(
          'px-4 text-sm text-gray-500 whitespace-nowrap',
          orientation === 'left' && 'pl-0',
          orientation === 'right' && 'pr-0'
        )}
      >
        {children}
      </span>
      {orientation !== 'right' && <div className={lineClass} />}
    </div>
  )
}

Divider.displayName = 'Divider'

export default Divider
