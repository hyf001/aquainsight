import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  Bell,
  Filter,
  Search,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Mock data
const alerts = [
  {
    id: 1,
    type: 'error',
    title: '溶解氧含量过低',
    message: '当前溶解氧含量为 3.2 mg/L，低于安全阈值 5.0 mg/L，请及时处理。',
    location: '虾塘A区-01号池',
    device: 'DO传感器-001',
    time: '2024-01-15 14:30',
    level: '严重',
    status: 'unread',
  },
  {
    id: 2,
    type: 'warning',
    title: '水温持续偏高',
    message: '水温已达到 29.5°C，连续2小时超过最佳温度范围。',
    location: '虾塘C区-02号池',
    device: '温度传感器-005',
    time: '2024-01-15 13:45',
    level: '中等',
    status: 'read',
  },
  {
    id: 3,
    type: 'info',
    title: '设备上线通知',
    message: '传感器DO-003已恢复正常连接，数据采集继续进行中。',
    location: '鱼塘B区-03号池',
    device: 'DO传感器-003',
    time: '2024-01-15 12:20',
    level: '低',
    status: 'read',
  },
  {
    id: 4,
    type: 'success',
    title: '水质恢复正常',
    message: '氨氮含量已回落至正常范围，各项指标稳定。',
    location: '虾塘A区-03号池',
    device: '氨氮传感器-002',
    time: '2024-01-15 11:30',
    level: '低',
    status: 'read',
  },
  {
    id: 5,
    type: 'warning',
    title: 'pH值波动异常',
    message: 'pH值在1小时内从7.2波动至8.5，需要关注。',
    location: '育苗区-01号池',
    device: 'pH传感器-007',
    time: '2024-01-15 10:15',
    level: '中等',
    status: 'unread',
  },
]

export default function Alerts() {
  const [filter, setFilter] = useState('all')
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null)

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      default:
        return <Info className="w-5 h-5 text-aqua" />
    }
  }

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/20'
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20'
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20'
      default:
        return 'bg-aqua/10 border-aqua/20'
    }
  }

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter((alert) => alert.status === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">告警中心</h1>
          <p className="text-deep-400 mt-1">管理和处理所有告警信息</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Bell className="w-4 h-4" />
          消息订阅
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '未读告警', value: '3', color: 'text-red-400' },
          { label: '严重告警', value: '1', color: 'text-red-400' },
          { label: '中等告警', value: '2', color: 'text-amber-400' },
          { label: '今日已处理', value: '8', color: 'text-emerald-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 text-center"
          >
            <p className={cn('text-3xl font-display font-bold', stat.color)}>{stat.value}</p>
            <p className="text-deep-400 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 p-1 bg-deep-800/50 rounded-xl">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === f
                  ? 'bg-aqua text-white'
                  : 'text-deep-400 hover:text-deep-200'
              )}
            >
              {f === 'all' ? '全部' : f === 'unread' ? '未读' : '已读'}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-400" />
            <input
              type="text"
              placeholder="搜索告警..."
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* Alert list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card divide-y divide-deep-700/50"
      >
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'p-5 transition-all duration-200 cursor-pointer hover:bg-deep-800/30',
              selectedAlert === alert.id && 'bg-deep-800/30',
              alert.status === 'unread' && 'relative'
            )}
            onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
          >
            {alert.status === 'unread' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-red-400 rounded-r-full" />
            )}
            <div className="flex items-start gap-4">
              <div className={cn('p-3 rounded-xl', getAlertBg(alert.type))}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium text-white truncate">{alert.title}</h3>
                  <span className={cn(
                    'px-2 py-0.5 text-xs rounded-full border shrink-0',
                    alert.level === '严重' ? 'badge-error' :
                    alert.level === '中等' ? 'badge-warning' : 'badge-success'
                  )}>
                    {alert.level}
                  </span>
                </div>
                <p className="text-deep-400 text-sm line-clamp-2">{alert.message}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-deep-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {alert.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {alert.time}
                  </span>
                </div>
              </div>
              <ChevronRight className={cn(
                'w-5 h-5 text-deep-400 transition-transform',
                selectedAlert === alert.id && 'rotate-90'
              )} />
            </div>

            {/* Expanded details */}
            {selectedAlert === alert.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-deep-700/50"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-deep-400 text-xs">告警设备</p>
                    <p className="text-deep-200 text-sm mt-1">{alert.device}</p>
                  </div>
                  <div>
                    <p className="text-deep-400 text-xs">告警时间</p>
                    <p className="text-deep-200 text-sm mt-1">{alert.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn-primary text-sm py-2">处理告警</button>
                  <button className="btn-secondary text-sm py-2">忽略</button>
                  <button className="text-sm text-deep-400 hover:text-aqua transition-colors">
                    查看详情
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
