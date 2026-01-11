import { motion } from 'framer-motion'
import {
  Activity,
  Thermometer,
  Droplets,
  Cpu,
  Play,
  Pause,
  Maximize2,
  Settings,
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Mock data
const monitors = [
  {
    id: 1,
    name: '虾塘A区-01号池',
    type: '对虾养殖',
    status: 'online',
    temp: 26.5,
    do: 7.8,
    ph: 7.2,
    lastUpdate: '刚刚',
  },
  {
    id: 2,
    name: '鱼塘B区-03号池',
    type: '淡水鱼类',
    status: 'online',
    temp: 24.2,
    do: 6.5,
    ph: 7.4,
    lastUpdate: '1分钟前',
  },
  {
    id: 3,
    name: '虾塘C区-02号池',
    type: '对虾养殖',
    status: 'warning',
    temp: 29.1,
    do: 4.2,
    ph: 8.1,
    lastUpdate: '2分钟前',
  },
  {
    id: 4,
    name: '育苗区-01号池',
    type: '苗种培育',
    status: 'online',
    temp: 28.0,
    do: 8.2,
    ph: 7.0,
    lastUpdate: '刚刚',
  },
]

const liveCharts = [
  { label: '溶解氧', unit: 'mg/L', values: [7.2, 7.4, 7.3, 7.5, 7.8, 7.6, 7.8, 7.7, 7.9, 8.0] },
  { label: '水温', unit: '°C', values: [25.1, 25.2, 25.3, 25.2, 25.4, 25.5, 25.4, 25.6, 25.5, 25.6] },
  { label: 'pH值', unit: '', values: [7.1, 7.2, 7.1, 7.3, 7.2, 7.2, 7.3, 7.2, 7.3, 7.2] },
]

export default function Monitor() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">实时监控</h1>
          <p className="text-deep-400 mt-1">24小时不间断监控养殖环境数据</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Play className="w-4 h-4" />
            全部开始
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Pause className="w-4 h-4" />
            全部暂停
          </button>
        </div>
      </div>

      {/* Live charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {liveCharts.map((chart, index) => (
          <motion.div
            key={chart.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-deep-400 text-sm">实时数据</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-white">
                  {chart.values[chart.values.length - 1]}
                </p>
                <p className="text-deep-400 text-xs">{chart.unit}</p>
              </div>
            </div>
            <div className="h-24 flex items-end gap-1">
              {chart.values.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-aqua/30 to-aqua rounded-t"
                  style={{ height: `${(value / (index === 2 ? 14 : 12)) * 100}%` }}
                />
              ))}
            </div>
            <p className="text-center text-deep-400 text-sm mt-3">{chart.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Monitor list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">监控点位</h2>
          <div className="flex items-center gap-2">
            <select className="input-field w-32 py-2">
              <option>全部</option>
              <option>在线</option>
              <option>离线</option>
              <option>告警</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monitors.map((monitor) => (
            <div
              key={monitor.id}
              className={cn(
                'p-5 rounded-xl border transition-all duration-300',
                monitor.status === 'online'
                  ? 'bg-deep-800/50 border-deep-700/50 hover:border-aqua/30'
                  : monitor.status === 'warning'
                  ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    monitor.status === 'online'
                      ? 'bg-emerald-500/10'
                      : monitor.status === 'warning'
                      ? 'bg-amber-500/10'
                      : 'bg-red-500/10'
                  )}>
                    <Activity className={cn(
                      'w-5 h-5',
                      monitor.status === 'online'
                        ? 'text-emerald-400'
                        : monitor.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    )} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{monitor.name}</h3>
                    <p className="text-sm text-deep-400">{monitor.type}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg text-deep-400 hover:text-aqua hover:bg-deep-700/50 transition-all">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-deep-900/50">
                  <Thermometer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-lg font-display font-bold text-white">{monitor.temp}°C</p>
                  <p className="text-xs text-deep-400">水温</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-deep-900/50">
                  <Droplets className="w-4 h-4 text-aqua mx-auto mb-1" />
                  <p className="text-lg font-display font-bold text-white">{monitor.do}</p>
                  <p className="text-xs text-deep-400">溶氧</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-deep-900/50">
                  <Cpu className="w-4 h-4 text-ocean-400 mx-auto mb-1" />
                  <p className="text-lg font-display font-bold text-white">{monitor.ph}</p>
                  <p className="text-xs text-deep-400">pH</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-deep-700/50">
                <span className="text-xs text-deep-400">
                  更新: {monitor.lastUpdate}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-deep-400 hover:text-aqua hover:bg-deep-700/50 transition-all">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    monitor.status === 'online'
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : monitor.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  )}>
                    {monitor.status === 'online' ? '在线' : monitor.status === 'warning' ? '告警' : '离线'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
