import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import Button from './Button'

export interface ModalProps {
  /** 是否显示 */
  open: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 标题 */
  title?: React.ReactNode
  /** 内容 */
  children?: React.ReactNode
  /** 底部内容 */
  footer?: React.ReactNode
  /** 宽度 */
  width?: string | number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 自定义类名 */
  className?: string
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认回调 */
  onOk?: () => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void
  /** 确认按钮加载状态 */
  confirmLoading?: boolean
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  width = 520,
  closable = true,
  maskClosable = true,
  className,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  confirmLoading = false,
}) => {
  const handleClose = () => {
    if (maskClosable && onClose) {
      onClose()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else if (onClose) {
      onClose()
    }
  }

  const handleOk = async () => {
    if (onOk) {
      await onOk()
    } else if (onClose) {
      onClose()
    }
  }

  const defaultFooter = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={handleCancel}>
        {cancelText}
      </Button>
      <Button onClick={handleOk} loading={confirmLoading}>
        {okText}
      </Button>
    </div>
  )

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* 背景遮罩 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* 模态框容器 */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full bg-white rounded-lg shadow-xl overflow-hidden',
                  className
                )}
                style={{ maxWidth: typeof width === 'number' ? `${width}px` : width }}
              >
                {/* 标题栏 */}
                {(title || closable) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    {title && (
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        {title}
                      </Dialog.Title>
                    )}
                    {closable && (
                      <button
                        onClick={onClose}
                        disabled={!onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* 内容区 */}
                <div className="px-6 py-4">{children}</div>

                {/* 底部 */}
                {(footer !== null || onOk || onCancel) && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    {footer !== undefined ? footer : defaultFooter}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

Modal.displayName = 'Modal'

export default Modal
