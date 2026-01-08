import React, { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  width?: number | string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  footer?: React.ReactNode
  closable?: boolean
  maskClosable?: boolean
  className?: string
  bodyClassName?: string
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 520,
  placement = 'right',
  footer,
  closable = true,
  maskClosable = true,
  className,
  bodyClassName,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  const isHorizontal = placement === 'left' || placement === 'right'
  const widthValue = typeof width === 'number' ? `${width}px` : width

  const getDrawerPosition = () => {
    switch (placement) {
      case 'left':
        return 'left-0 top-0 bottom-0'
      case 'right':
        return 'right-0 top-0 bottom-0'
      case 'top':
        return 'top-0 left-0 right-0'
      case 'bottom':
        return 'bottom-0 left-0 right-0'
    }
  }

  const getDrawerTransform = () => {
    switch (placement) {
      case 'left':
        return open ? 'translate-x-0' : '-translate-x-full'
      case 'right':
        return open ? 'translate-x-0' : 'translate-x-full'
      case 'top':
        return open ? 'translate-y-0' : '-translate-y-full'
      case 'bottom':
        return open ? 'translate-y-0' : 'translate-y-full'
    }
  }

  const getDrawerSize = () => {
    if (isHorizontal) {
      return { width: widthValue }
    }
    return { height: widthValue }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={maskClosable ? onClose : undefined}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col',
          getDrawerPosition(),
          getDrawerTransform(),
          className
        )}
        style={getDrawerSize()}
      >
        {/* Header */}
        {(title || closable) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {closable && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={cn(
            'flex-1 overflow-y-auto px-6 py-4',
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}

Drawer.displayName = 'Drawer'

export default Drawer
