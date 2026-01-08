import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

export interface TooltipProps {
  /** 提示内容 */
  title?: React.ReactNode
  /** 触发元素 */
  children: React.ReactElement
  /** 位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 自定义类名 */
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'top',
  className,
}) => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.right + 8
          break
      }

      setPosition({ top, left })
    }
  }, [visible, placement])

  if (!title) {
    return children
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-block"
      >
        {children}
      </div>

      {visible && (
        <div
          ref={tooltipRef}
          className={cn(
            'fixed z-[9999] px-3 py-1.5 text-xs text-white bg-gray-900 rounded shadow-lg',
            'animate-fade-in pointer-events-none',
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {title}
        </div>
      )}
    </>
  )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
