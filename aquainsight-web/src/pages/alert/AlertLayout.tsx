import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Bell, Settings, FileText } from 'lucide-react'

const navItems = [
  { path: '/alerts', label: '告警记录', icon: Bell, end: true },
  { path: '/alerts/rules', label: '告警规则', icon: Settings },
  { path: '/alerts/notify-logs', label: '通知日志', icon: FileText },
]

export default function AlertLayout() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-clean-900">告警中心</h1>
        <p className="text-clean-500 mt-1">管理告警记录、规则配置和通知日志</p>
      </div>

      {/* 二级导航 */}
      <div className="border-b border-clean-200">
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-nature-500 text-nature-600'
                    : 'border-transparent text-clean-500 hover:text-clean-700 hover:border-clean-300'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 子页面内容 */}
      <Outlet />
    </div>
  )
}
