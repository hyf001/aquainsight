import React, { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import Button from './Button'

export interface PopconfirmProps {
  /** 确认框标题 */
  title?: React.ReactNode
  /** 确认框描述 */
  description?: React.ReactNode
  /** 触发元素 */
  children: React.ReactElement
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认回调 */
  onConfirm?: () => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void
  /** 确认按钮类型 */
  okType?: 'primary' | 'danger'
  /** 图标 */
  icon?: React.ReactNode
  /** 位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const Popconfirm: React.FC<PopconfirmProps> = ({
  title = '确定要执行此操作吗？',
  description,
  children,
  okText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  okType = 'primary',
  icon,
  placement = 'top',
}) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async (close: () => void) => {
    if (onConfirm) {
      setLoading(true)
      try {
        await onConfirm()
        close()
      } catch (error) {
        console.error('Confirm error:', error)
      } finally {
        setLoading(false)
      }
    } else {
      close()
    }
  }

  const handleCancel = (close: () => void) => {
    if (onCancel) {
      onCancel()
    }
    close()
  }

  const defaultIcon = icon !== undefined ? icon : <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />

  return (
    <Popover className="relative inline-block">
      {({ open, close }) => (
        <>
          <Popover.Button as={Fragment}>{children}</Popover.Button>

          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className={cn(
                'absolute z-50 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5',
                placement === 'top' && 'bottom-full mb-2 left-0',
                placement === 'bottom' && 'top-full mt-2 left-0',
                placement === 'left' && 'right-full mr-2 top-0',
                placement === 'right' && 'left-full ml-2 top-0'
              )}
            >
              <div className="p-4">
                <div className="flex gap-3">
                  {defaultIcon && <div className="flex-shrink-0">{defaultIcon}</div>}
                  <div className="flex-1">
                    {title && (
                      <div className="text-sm font-medium text-gray-900 mb-1">{title}</div>
                    )}
                    {description && (
                      <div className="text-xs text-gray-500 mb-3">{description}</div>
                    )}
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(close)}
                        disabled={loading}
                      >
                        {cancelText}
                      </Button>
                      <Button
                        size="sm"
                        variant={okType === 'danger' ? 'danger' : 'primary'}
                        onClick={() => handleConfirm(close)}
                        loading={loading}
                      >
                        {okText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

Popconfirm.displayName = 'Popconfirm'

export default Popconfirm
