import React, { useState, useEffect } from 'react'
import { Badge, Dropdown, Spin, Empty, Button } from '@/components/ui'
import { BellIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { getAlertRecords } from '@/services/alert'
import dayjs from 'dayjs'
import { cn } from '@/utils/cn'

interface AlertRecord {
  id: number
  ruleName: string
  targetName: string
  alertLevel: string
  alertMessage: string
  status: string
  createTime: string
}

const ALERT_LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  URGENT: { label: '紧急', color: 'text-red-600' },
  IMPORTANT: { label: '重要', color: 'text-orange-500' },
  NORMAL: { label: '一般', color: 'text-blue-500' },
  INFO: { label: '提示', color: 'text-green-500' },
}

const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<AlertRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // 加载未处理的告警通知
  const loadNotifications = async () => {
    setLoading(true)
    try {
      const pageResult = await getAlertRecords(1, 10, { status: 'PENDING' })
      setNotifications(pageResult.list || [])
      setUnreadCount(pageResult.total || 0)
    } catch (error) {
      console.error('加载通知失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    // 每分钟刷新一次
    const interval = setInterval(loadNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = () => {
    navigate('/alert-records')
  }

  const handleViewAll = () => {
    navigate('/alert-records')
  }

  const dropdownContent = (
    <div className="w-96 max-h-[32rem] flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-base font-semibold text-gray-900">告警通知</span>
        <Badge variant="secondary" size="sm">
          {unreadCount} 条未处理
        </Badge>
      </div>

      {/* 通知列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spin />
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((item) => {
              const levelConfig = ALERT_LEVEL_CONFIG[item.alertLevel] || ALERT_LEVEL_CONFIG.NORMAL
              return (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-ocean-cream cursor-pointer transition-colors"
                  onClick={handleNotificationClick}
                >
                  <div className="flex flex-col gap-1">
                    {/* 等级和规则名 */}
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-medium', levelConfig.color)}>
                        【{levelConfig.label}】
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.ruleName}</span>
                    </div>
                    {/* 目标和消息 */}
                    <div className="text-sm text-gray-600">
                      <div className="truncate">{item.targetName}</div>
                      <div className="truncate-2 mt-1">{item.alertMessage}</div>
                    </div>
                    {/* 时间 */}
                    <div className="text-xs text-gray-400 mt-1">
                      {dayjs(item.createTime).format('MM-DD HH:mm')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty description="暂无未处理告警" />
        )}
      </div>

      {/* 底部 */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 p-2">
          <Button variant="ghost" onClick={handleViewAll} className="w-full justify-center">
            查看全部告警
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <Dropdown
      trigger={
        <div className="relative p-2 hover:bg-ocean-teal hover:bg-opacity-20 rounded-lg transition-colors cursor-pointer">
          <BellIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      }
      placement="bottom-end"
      className="mt-2"
    >
      {dropdownContent}
    </Dropdown>
  )
}

export default NotificationDropdown
