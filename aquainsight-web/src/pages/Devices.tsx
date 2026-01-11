import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Cpu,
  Wifi,
  WifiOff,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  ChevronRight,
  Battery,
  Signal,
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Mock data
const devices = [
  {
    id: 1,
    name: 'DO传感器-001',
    type: '溶解氧传感器',
    location: '虾塘A区-01号池',
    status: 'online',
    signal: 85,
    battery: 78,
    lastActive: '刚刚',
  },
  {
    id: 2,
    name: '温度传感器-003',
    type: '水温传感器',
    location: '虾塘A区-01号池',
    status: 'online',
    signal: 92,
    battery: 45,
    lastActive: '1分钟前',
  },
  {
    id: 3,
    name: 'pH传感器-007',
    type: 'pH传感器',
    location: '虾塘C区-02号池',
    status: 'warning',
    signal: 65,
    battery: 12,
    lastActive: '5分钟前',
  },
  {
    id: 4,
    name: '氨氮传感器-002',
    type: '氨氮传感器',
    location: '虾塘A区-02号池',
    status: 'offline',
    signal: 0,
    battery: 5,
    lastActive: '2小时前',
  },
  {
    id: 5,
    name: '浊度传感器-004',
    type: '浊度传感器',
    location: '鱼塘B区-03号池',
    status: 'online',
    signal: 88,
    battery: 92,
    lastActive: '刚刚',
  },
  {
    id: 6,
    name: 'ORP传感器-001',
    type: 'ORP传感器',
    location: '育苗区-01号池',
    status: 'online',
    signal: 75,
    battery: 67,
    lastActive: '2分钟前',
  },
]

const deviceTypes = [
  { type: '溶解氧传感器', count: 12, icon: 'Droplets' },
  { type: '水温传感器', count: 15, icon: 'Thermometer' },
  { type: 'pH传感器', count: 8, icon: 'Activity' },
  { type: '氨氮传感器', count: 6, icon: 'AlertTriangle' },
  { type: '浊度传感器', count: 5, icon: 'Eye' },
  { type: 'ORP传感器', count: 4, icon: 'Zap' },
]

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-emerald-400" />
      case 'warning':
        return <Wifi className="w-4 h-4 text-amber-400" />
      default:
        return <WifiOff className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }

  const filteredDevices = devices.filter((device) => {
    if (filter !== 'all' && device.status !== filter) return false
    if (searchTerm && !device.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">设备管理</h1>
          <p className="text-deep-400 mt-1">管理所有监控设备</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          添加设备
        </button>
      </div>

      {/* Device type overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {deviceTypes.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 text-center cursor-pointer hover:border-aqua/30 transition-all"
          >
            <p className="text-2xl font-display font-bold text-white">{item.count}</p>
            <p className="text-deep-400 text-sm mt-1">{item.type}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 p-1 bg-deep-800/50 rounded-xl">
          {['all', 'online', 'warning', 'offline'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                filter === f
                  ? 'bg-aqua text-white'
                  : 'text-deep-400 hover:text-deep-200'
              )}
            >
              {f === 'all' ? '全部' : f === 'online' ? '在线' : f === 'warning' ? '告警' : '离线'}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-400" />
            <input
              type="text"
              placeholder="搜索设备..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      {/* Device list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card divide-y divide-deep-700/50"
      >
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 flex items-center gap-4 hover:bg-deep-800/30 transition-all cursor-pointer"
          >
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              device.status === 'online' ? 'bg-emerald-500/10' :
              device.status === 'warning' ? 'bg-amber-500/10' : 'bg-red-500/10'
            )}>
              <Cpu className={cn(
                'w-6 h-6',
                device.status === 'online' ? 'text-emerald-400' :
                device.status === 'warning' ? 'text-amber-400' : 'text-red-400'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">{device.name}</h3>
                {getStatusIcon(device.status)}
              </div>
              <p className="text-sm text-deep-400 mt-0.5">{device.type} · {device.location}</p>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-deep-400" />
                <span className="text-sm text-deep-300">{device.signal}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-deep-400" />
                <span className={cn(
                  'text-sm',
                  device.battery < 20 ? 'text-red-400' : 'text-deep-300'
                )}>{device.battery}%</span>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-deep-400">活跃</p>
              <p className="text-sm text-deep-300">{device.lastActive}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-deep-400 hover:text-aqua hover:bg-deep-700/50 transition-all">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-deep-400 hover:text-aqua hover:bg-deep-700/50 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
              <ChevronRight className="w-5 h-5 text-deep-400" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-deep-400">
          显示 1-{filteredDevices.length} 条，共 {devices.length} 条
        </p>
        <div className="flex items-center gap-2">
          <button className="btn-secondary py-2 px-4">上一页</button>
          <button className="btn-primary py-2 px-4">下一页</button>
        </div>
      </div>
    </div>
  )
}
