import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Save,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const settingsSections = [
  { id: 'profile', label: '个人资料', icon: User },
  { id: 'notifications', label: '通知设置', icon: Bell },
  { id: 'security', label: '安全设置', icon: Shield },
  { id: 'appearance', label: '外观设置', icon: Palette },
  { id: 'language', label: '语言设置', icon: Globe },
  { id: 'data', label: '数据管理', icon: Database },
  { id: 'api', label: 'API密钥', icon: Key },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    alerts: true,
  })

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">个人资料</h3>
              <p className="text-deep-400 text-sm">管理您的账户信息</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-aqua to-ocean-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <button className="btn-secondary text-sm py-2">更换头像</button>
                <p className="text-xs text-deep-400 mt-2">支持 JPG、PNG 格式，最大 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-deep-300 mb-2">用户名</label>
                <input type="text" className="input-field" defaultValue="admin" />
              </div>
              <div>
                <label className="block text-sm text-deep-300 mb-2">显示名称</label>
                <input type="text" className="input-field" defaultValue="系统管理员" />
              </div>
              <div>
                <label className="block text-sm text-deep-300 mb-2">邮箱</label>
                <input type="email" className="input-field" defaultValue="admin@aquainsight.com" />
              </div>
              <div>
                <label className="block text-sm text-deep-300 mb-2">手机号</label>
                <input type="tel" className="input-field" defaultValue="138****8888" />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                保存更改
              </button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">通知设置</h3>
              <p className="text-deep-400 text-sm">管理消息通知的方式和类型</p>
            </div>
            <div className="space-y-4">
              {[
                { key: 'email', label: '邮件通知', desc: '通过邮件接收重要通知' },
                { key: 'sms', label: '短信通知', desc: '通过短信接收紧急告警' },
                { key: 'push', label: '推送通知', desc: '通过浏览器推送接收消息' },
                { key: 'alerts', label: '告警通知', desc: '接收设备告警和环境异常通知' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-deep-800/50 border border-deep-700/50"
                >
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-deep-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof notifications],
                      }))
                    }
                    className={cn(
                      'w-12 h-6 rounded-full transition-all relative',
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-aqua'
                        : 'bg-deep-600'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                        notifications[item.key as keyof typeof notifications]
                          ? 'left-7'
                          : 'left-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">外观设置</h3>
              <p className="text-deep-400 text-sm">自定义界面外观和主题</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setDarkMode(true)}
                className={cn(
                  'p-6 rounded-xl border-2 cursor-pointer transition-all',
                  darkMode
                    ? 'border-aqua bg-deep-800/50'
                    : 'border-deep-700/50 hover:border-deep-600'
                )}
              >
                <div className="w-full h-24 rounded-lg bg-deep-950 mb-3 flex items-center justify-center">
                  <span className="text-deep-400 text-sm">深色主题</span>
                </div>
                <p className="font-medium text-white">深色主题</p>
                <p className="text-sm text-deep-400">适合低光环境使用</p>
              </div>
              <div
                onClick={() => setDarkMode(false)}
                className={cn(
                  'p-6 rounded-xl border-2 cursor-pointer transition-all',
                  !darkMode
                    ? 'border-aqua bg-deep-800/50'
                    : 'border-deep-700/50 hover:border-deep-600'
                )}
              >
                <div className="w-full h-24 rounded-lg bg-gray-100 mb-3 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">浅色主题</span>
                </div>
                <p className="font-medium text-white">浅色主题</p>
                <p className="text-sm text-deep-400">适合光线充足环境</p>
              </div>
            </div>
            <div>
              <label className="block text-sm text-deep-300 mb-2">accent颜色</label>
              <div className="flex items-center gap-3">
                {['#06b6d4', '#0ea5e9', '#22d3ee', '#14b8a6'].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-xl transition-all hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {settingsSections.find((s) => s.id === activeSection)?.label}
              </h3>
              <p className="text-deep-400 text-sm">此功能正在开发中...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">系统设置</h1>
        <p className="text-deep-400 mt-1">管理您的账户和系统配置</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 shrink-0"
        >
          <div className="glass-card p-2 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all',
                  activeSection === section.id
                    ? 'bg-aqua/10 text-aqua'
                    : 'text-deep-300 hover:bg-deep-800/50 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{section.label}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 glass-card p-6"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  )
}
