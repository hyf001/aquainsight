import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  LineChart,
  PieChart,
  Activity,
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Mock data
const analyticsCards = [
  {
    title: '产量预测',
    value: '12,500 kg',
    change: '+8.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-emerald-400',
  },
  {
    title: '存活率',
    value: '96.8%',
    change: '+2.3%',
    trend: 'up',
    icon: Activity,
    color: 'text-aqua',
  },
  {
    title: '饲料转化率',
    value: '1.25',
    change: '-0.15',
    trend: 'down',
    icon: BarChart3,
    color: 'text-ocean-400',
  },
  {
    title: '平均水温',
    value: '26.2°C',
    change: '+1.2°C',
    trend: 'up',
    icon: LineChart,
    color: 'text-amber-400',
  },
]

const chartData = {
  week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  temperature: [25.1, 25.3, 25.5, 25.8, 26.0, 26.2, 26.1],
  dissolvedOxygen: [7.2, 7.1, 7.3, 7.5, 7.4, 7.6, 7.8],
  ph: [7.2, 7.1, 7.3, 7.2, 7.4, 7.3, 7.2],
}

export default function Analysis() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">数据分析</h1>
          <p className="text-deep-400 mt-1">养殖数据深度分析与趋势预测</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-field w-32">
            <option>本周</option>
            <option>本月</option>
            <option>本季度</option>
            <option>本年</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            自定义
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-3 rounded-xl bg-deep-800/50')}>
                <card.icon className={cn('w-5 h-5', card.color)} />
              </div>
              <span className={cn(
                'text-sm font-medium',
                card.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              )}>
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-white">{card.value}</p>
            <p className="text-deep-400 text-sm mt-1">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">水温趋势</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-aqua/20 text-aqua">
                <LineChart className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-deep-400 hover:text-aqua">
                <PieChart className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {chartData.temperature.map((temp, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-amber-500/50 to-amber-400 rounded-t transition-all duration-300 hover:from-amber-500 hover:to-amber-300"
                  style={{ height: `${((temp - 20) / 10) * 100}%` }}
                />
                <span className="text-xs text-deep-400">{chartData.week[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-sm text-deep-400">水温 (°C)</span>
            </div>
          </div>
        </motion.div>

        {/* Water quality comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">水质指标对比</h2>
            <button className="text-sm text-deep-400 hover:text-aqua transition-colors flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              筛选
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: '溶解氧', value: 7.5, max: 10, color: 'bg-aqua' },
              { label: 'pH值', value: 7.2, max: 14, color: 'bg-ocean-400' },
              { label: '氨氮', value: 0.15, max: 0.5, color: 'bg-emerald-400' },
              { label: '亚硝酸盐', value: 0.03, max: 0.1, color: 'bg-purple-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-deep-300">{item.label}</span>
                  <span className="text-sm font-medium text-white">{item.value}</span>
                </div>
                <div className="h-2 bg-deep-700 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', item.color)}
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Production data table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">塘口产量统计</h2>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm py-2">月度</button>
            <button className="btn-primary text-sm py-2">年度</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-deep-400 border-b border-deep-700/50">
                <th className="pb-3 font-medium">塘口名称</th>
                <th className="pb-3 font-medium">养殖品种</th>
                <th className="pb-3 font-medium">投放量</th>
                <th className="pb-3 font-medium">当前重量</th>
                <th className="pb-3 font-medium">存活率</th>
                <th className="pb-3 font-medium">预计产量</th>
                <th className="pb-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-deep-700/30">
              {[
                { name: '虾塘A区', type: '南美白对虾', stock: '50万尾', weight: '3,200kg', survival: '96.5%', output: '8,500kg' },
                { name: '虾塘B区', type: '斑节对虾', stock: '30万尾', weight: '2,100kg', survival: '94.2%', output: '5,200kg' },
                { name: '鱼塘A区', type: '草鱼', stock: '8,000尾', weight: '4,500kg', survival: '98.1%', output: '12,000kg' },
                { name: '鱼塘B区', type: '鲈鱼', stock: '5,000尾', weight: '2,800kg', survival: '97.5%', output: '6,500kg' },
              ].map((row) => (
                <tr key={row.name} className="text-sm">
                  <td className="py-4 text-white font-medium">{row.name}</td>
                  <td className="py-4 text-deep-300">{row.type}</td>
                  <td className="py-4 text-deep-300">{row.stock}</td>
                  <td className="py-4 text-deep-300">{row.weight}</td>
                  <td className="py-4">
                    <span className="badge-success">{row.survival}</span>
                  </td>
                  <td className="py-4 text-white font-medium">{row.output}</td>
                  <td className="py-4">
                    <button className="text-aqua hover:text-aqua-light text-sm transition-colors">
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
