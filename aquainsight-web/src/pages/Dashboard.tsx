import { motion } from 'framer-motion'
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Fish,
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Mock data for demonstration
const stats = [
  {
    label: '在线设备',
    value: '128',
    change: '+12%',
    trend: 'up',
    icon: Activity,
    color: 'text-aqua',
    bgColor: 'bg-aqua/10',
  },
  {
    label: '监控点位',
    value: '256',
    change: '+8%',
    trend: 'up',
    icon: Fish,
    color: 'text-ocean-400',
    bgColor: 'bg-ocean-500/10',
  },
  {
    label: '今日告警',
    value: '3',
    change: '-50%',
    trend: 'down',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    label: '正常率',
    value: '98.5%',
    change: '+2.3%',
    trend: 'up',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
]

const waterQualityData = [
  { name: '溶解氧', value: 7.8, unit: 'mg/L', status: 'normal', min: 5, max: 10 },
  { name: 'pH值', value: 7.2, unit: '', status: 'normal', min: 6.5, max: 8.5 },
  { name: '氨氮', value: 0.12, unit: 'mg/L', status: 'normal', min: 0, max: 0.5 },
  { name: '亚硝酸盐', value: 0.05, unit: 'mg/L', status: 'normal', min: 0, max: 0.1 },
  { name: '水温', value: 24.5, unit: '°C', status: 'warning', min: 18, max: 30 },
  { name: '浊度', value: 15, unit: 'NTU', status: 'normal', min: 0, max: 50 },
]

const recentAlerts = [
  {
    id: 1,
    type: 'warning',
    title: '水温偏高预警',
    location: '虾塘A区-01号池',
    time: '10分钟前',
    level: '中',
  },
  {
    id: 2,
    type: 'info',
    title: '设备上线通知',
    location: '鱼塘B区-03号传感器',
    time: '30分钟前',
    level: '低',
  },
  {
    id: 3,
    type: 'success',
    title: '水质恢复正常',
    location: '虾塘C区-02号池',
    time: '1小时前',
    level: '低',
  },
  {
    id: 4,
    type: 'error',
    title: '溶氧量异常下降',
    location: '鱼塘A区-05号池',
    time: '2小时前',
    level: '高',
  },
]

const containerPonds = [
  { id: 1, name: '虾塘A区', type: '对虾养殖', devices: 12, status: 'healthy' },
  { id: 2, name: '鱼塘B区', type: '淡水鱼类', devices: 8, status: 'healthy' },
  { id: 3, name: '虾塘C区', type: '对虾养殖', devices: 10, status: 'warning' },
  { id: 4, name: '鱼塘D区', type: '淡水鱼类', devices: 6, status: 'healthy' },
  { id: 5, name: '育苗区', type: '苗种培育', devices: 15, status: 'healthy' },
]

export default function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'healthy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-deep-600/50 text-deep-400 border-deep-500/30'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      default:
        return 'text-aqua bg-aqua/10 border-aqua/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">数据总览</h1>
          <p className="text-deep-400 mt-1">实时监控水产养殖环境数据</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-field w-40">
            <option>今天</option>
            <option>本周</option>
            <option>本月</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-stat group"
          >
            <div className="flex items-start justify-between">
              <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              )}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
              <p className="text-deep-400 text-sm mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water quality panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-aqua" />
              水质指标
            </h2>
            <button className="text-sm text-deep-400 hover:text-aqua transition-colors">
              查看详情 →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {waterQualityData.map((item, index) => (
              <div
                key={item.name}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-300',
                  item.status === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-deep-800/50 border-deep-700/50 hover:border-deep-600'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-deep-400 text-sm">{item.name}</span>
                  <span className={cn(
                    'px-2 py-0.5 text-xs rounded-full border',
                    item.status === 'normal'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  )}>
                    {item.status === 'normal' ? '正常' : '注意'}
                  </span>
                </div>
                <p className="text-2xl font-display font-bold text-white">
                  {item.value}
                  <span className="text-sm font-normal text-deep-400 ml-1">{item.unit}</span>
                </p>
                <div className="mt-3 h-1.5 bg-deep-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      item.status === 'warning' ? 'bg-amber-500' : 'bg-aqua'
                    )}
                    style={{
                      width: `${((item.value - item.min) / (item.max - item.min)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              最近告警
            </h2>
            <span className="badge-info">全部已读</span>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02]',
                  getAlertColor(alert.type)
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-deep-100">{alert.title}</p>
                    <p className="text-sm text-deep-400 mt-1">{alert.location}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 text-xs rounded-full border shrink-0',
                    alert.level === '高' ? 'badge-error' :
                    alert.level === '中' ? 'badge-warning' : 'badge-success'
                  )}>
                    {alert.level}
                  </span>
                </div>
                <p className="text-xs text-deep-400 mt-2">{alert.time}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 rounded-xl bg-deep-800/50 text-deep-400 text-sm hover:text-aqua hover:bg-deep-800 transition-all">
            查看全部告警
          </button>
        </motion.div>
      </div>

      {/* Container ponds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Fish className="w-5 h-5 text-ocean-400" />
            养殖塘口
          </h2>
          <button className="btn-secondary text-sm py-2">管理塘口</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {containerPonds.map((pond) => (
            <div
              key={pond.id}
              className="p-4 rounded-xl bg-deep-800/50 border border-deep-700/50 hover:border-ocean-500/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ocean-500/20 to-aqua/20 flex items-center justify-center">
                  <Fish className="w-5 h-5 text-ocean-400" />
                </div>
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  pond.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'
                )} />
              </div>
              <h3 className="font-medium text-white group-hover:text-aqua transition-colors">
                {pond.name}
              </h3>
              <p className="text-sm text-deep-400 mt-1">{pond.type}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-deep-400">
                <Activity className="w-3.5 h-3.5" />
                <span>{pond.devices} 台设备</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
