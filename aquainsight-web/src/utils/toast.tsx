import React from 'react'
import { createRoot } from 'react-dom/client'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from './cn'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  duration?: number
  onClose?: () => void
}

interface ToastProps {
  type: ToastType
  content: React.ReactNode
  onClose: () => void
}

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  const iconClass = 'w-5 h-5'

  switch (type) {
    case 'success':
      return <CheckCircleIcon className={cn(iconClass, 'text-green-500')} />
    case 'error':
      return <XCircleIcon className={cn(iconClass, 'text-red-500')} />
    case 'warning':
      return <ExclamationTriangleIcon className={cn(iconClass, 'text-yellow-500')} />
    case 'info':
      return <InformationCircleIcon className={cn(iconClass, 'text-blue-500')} />
  }
}

const ToastComponent: React.FC<ToastProps> = ({ type, content, onClose }) => {
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 min-w-[320px] max-w-md px-4 py-3 rounded-lg border shadow-lg animate-slide-in',
        bgColors[type]
      )}
    >
      <ToastIcon type={type} />
      <div className="flex-1 text-sm text-gray-900">{content}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

class ToastManager {
  private container: HTMLDivElement | null = null
  private toasts: Map<string, { root: ReturnType<typeof createRoot>; timer?: NodeJS.Timeout }> = new Map()

  private getContainer() {
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none'
      this.container.style.pointerEvents = 'none'
      document.body.appendChild(this.container)
    }
    return this.container
  }

  private show(type: ToastType, content: React.ReactNode, options: ToastOptions = {}) {
    const { duration = 3000, onClose } = options
    const container = this.getContainer()

    const id = `toast-${Date.now()}-${Math.random()}`
    const toastElement = document.createElement('div')
    toastElement.style.pointerEvents = 'auto'
    container.appendChild(toastElement)

    const root = createRoot(toastElement)

    const handleClose = () => {
      const toast = this.toasts.get(id)
      if (toast) {
        if (toast.timer) {
          clearTimeout(toast.timer)
        }

        // 添加退出动画
        toastElement.style.animation = 'fadeOut 0.2s ease-out'
        setTimeout(() => {
          root.unmount()
          container.removeChild(toastElement)
          this.toasts.delete(id)

          // 如果没有 toast 了，移除容器
          if (this.toasts.size === 0 && this.container) {
            document.body.removeChild(this.container)
            this.container = null
          }
        }, 200)

        onClose?.()
      }
    }

    root.render(<ToastComponent type={type} content={content} onClose={handleClose} />)

    const timer = duration > 0 ? setTimeout(handleClose, duration) : undefined

    this.toasts.set(id, { root, timer })

    return handleClose
  }

  success(content: React.ReactNode, options?: ToastOptions) {
    return this.show('success', content, options)
  }

  error(content: React.ReactNode, options?: ToastOptions) {
    return this.show('error', content, options)
  }

  warning(content: React.ReactNode, options?: ToastOptions) {
    return this.show('warning', content, options)
  }

  info(content: React.ReactNode, options?: ToastOptions) {
    return this.show('info', content, options)
  }

  // 关闭所有 toast
  destroyAll() {
    this.toasts.forEach(({ root, timer }) => {
      if (timer) {
        clearTimeout(timer)
      }
      root.unmount()
    })
    this.toasts.clear()

    if (this.container) {
      document.body.removeChild(this.container)
      this.container = null
    }
  }
}

// 导出单例
export const toast = new ToastManager()

// 兼容 antd message 的 API
export const message = {
  success: (content: string, duration?: number, onClose?: () => void) =>
    toast.success(content, { duration: duration ? duration * 1000 : 3000, onClose }),
  error: (content: string, duration?: number, onClose?: () => void) =>
    toast.error(content, { duration: duration ? duration * 1000 : 3000, onClose }),
  warning: (content: string, duration?: number, onClose?: () => void) =>
    toast.warning(content, { duration: duration ? duration * 1000 : 3000, onClose }),
  info: (content: string, duration?: number, onClose?: () => void) =>
    toast.info(content, { duration: duration ? duration * 1000 : 3000, onClose }),
}
