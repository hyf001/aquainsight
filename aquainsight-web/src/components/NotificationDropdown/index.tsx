import React, { useState, useEffect } from 'react'
import { Badge, Dropdown, Button, Empty, Spin } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getAlertRecords } from '@/services/alert'
import dayjs from 'dayjs'
import './styles.less'

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
  URGENT: { label: '紧急', color: '#ff4d4f' },
  IMPORTANT: { label: '重要', color: '#ff7a45' },
  NORMAL: { label: '一般', color: '#1890ff' },
  INFO: { label: '提示', color: '#52c41a' },
}

const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<AlertRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

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
    // 跳转到告警详情页
    navigate('/alert-records')
    setOpen(false)
  }

  const handleViewAll = () => {
    navigate('/alert-records')
    setOpen(false)
  }

  const dropdownContent = (
    <div className="notification-dropdown">
      <div className="notification-header">
        <span className="notification-title">告警通知</span>
        <span className="notification-count">{unreadCount} 条未处理</span>
      </div>
      <div className="notification-list">
        {loading ? (
          <div className="notification-loading">
            <Spin />
          </div>
        ) : notifications.length > 0 ? (
          <div className="notification-items">
            {notifications.map((item) => {
              const levelConfig = ALERT_LEVEL_CONFIG[item.alertLevel] || ALERT_LEVEL_CONFIG.NORMAL
              return (
                <div
                  key={item.id}
                  className="notification-item"
                  onClick={() => handleNotificationClick()}
                >
                  <div className="notification-item-content">
                    <div className="notification-item-header">
                      <span
                        className="notification-level"
                        style={{ color: levelConfig.color }}
                      >
                        【{levelConfig.label}】
                      </span>
                      <span className="notification-rule">{item.ruleName}</span>
                    </div>
                    <div className="notification-item-body">
                      <div className="notification-target">{item.targetName}</div>
                      <div className="notification-message">{item.alertMessage}</div>
                    </div>
                    <div className="notification-item-footer">
                      {dayjs(item.createTime).format('MM-DD HH:mm')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty description="暂无未处理告警" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      {notifications.length > 0 && (
        <div className="notification-footer">
          <Button type="link" onClick={handleViewAll} block>
            查看全部告警
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <Badge count={unreadCount} overflowCount={99} className="header-icon">
        <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  )
}

export default NotificationDropdown
