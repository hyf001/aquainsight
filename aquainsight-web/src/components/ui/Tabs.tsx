import React from 'react'
import { cn } from '@/utils/cn'

export interface TabItem {
  key: string
  label: React.ReactNode
  children?: React.ReactNode
  closable?: boolean
}

export interface TabsProps {
  activeKey?: string
  defaultActiveKey?: string
  items?: TabItem[]
  onChange?: (key: string) => void
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void
  type?: 'line' | 'card'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  tabBarExtraContent?: React.ReactNode
  /** 子元素模式（使用 TabItem 作为子组件） */
  children?: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({
  activeKey: controlledActiveKey,
  defaultActiveKey,
  items = [],
  onChange,
  onEdit,
  type = 'line',
  size = 'md',
  className,
  tabBarExtraContent,
}) => {
  const [activeKey, setActiveKey] = React.useState(controlledActiveKey || defaultActiveKey || items[0]?.key)

  React.useEffect(() => {
    if (controlledActiveKey !== undefined) {
      setActiveKey(controlledActiveKey)
    }
  }, [controlledActiveKey])

  const handleTabClick = (key: string) => {
    if (controlledActiveKey === undefined) {
      setActiveKey(key)
    }
    onChange?.(key)
  }

  const handleRemove = (e: React.MouseEvent, key: string) => {
    e.stopPropagation()
    onEdit?.(key, 'remove')
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  }

  const activeItem = items.find((item) => item.key === activeKey)

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Bar */}
      <div className={cn('flex items-center', type === 'line' && 'border-b border-gray-200')}>
        <div className="flex items-center flex-1 overflow-x-auto scrollbar-thin">
          {items.map((item) => {
            const isActive = item.key === activeKey
            return (
              <div
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                className={cn(
                  'relative flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap',
                  sizeStyles[size],
                  type === 'line' && [
                    'border-b-2',
                    isActive
                      ? 'border-ocean-teal text-ocean-teal font-medium'
                      : 'border-transparent text-gray-600 hover:text-ocean-navy',
                  ],
                  type === 'card' && [
                    'border border-b-0 rounded-t-lg mr-1',
                    isActive
                      ? 'bg-white border-gray-200 text-ocean-navy font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100',
                  ]
                )}
              >
                {item.label}
                {item.closable && (
                  <button
                    onClick={(e) => handleRemove(e, item.key)}
                    className="ml-1 hover:bg-gray-200 rounded p-0.5 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {tabBarExtraContent && <div className="flex-shrink-0 ml-4">{tabBarExtraContent}</div>}
      </div>

      {/* Tab Content */}
      {activeItem?.children && (
        <div className="py-4">{activeItem.children}</div>
      )}
    </div>
  )
}

export default Tabs
