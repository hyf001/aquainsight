import { Construction } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DataPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-clean-900">数据面板</h1>
          <p className="text-clean-500 mt-1">站点监控数据可视化面板</p>
        </div>
      </div>

      {/* Under Development Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[500px] glass-card p-12 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-nature-100 flex items-center justify-center mb-6">
          <Construction className="w-10 h-10 text-nature-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-clean-900 mb-3">
          功能开发中
        </h2>
        <p className="text-clean-500 max-w-md">
          数据面板功能正在紧张开发中，敬请期待。此模块将提供实时监控数据的可视化展示、趋势分析和异常告警等功能。
        </p>
      </motion.div>
    </div>
  )
}
