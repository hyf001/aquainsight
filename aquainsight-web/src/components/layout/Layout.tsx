import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Activity,
  Bell,
  BarChart3,
  Cpu,
  Settings,
  Menu,
  Leaf,
  Search,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { navItems } from '@/config/routes'

interface LayoutProps {
  children: React.ReactNode
}

interface UserInfo {
  name: string
  email: string
  role: string
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', role: '' })
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUserInfo({
          name: user.name || '用户',
          email: user.email || '',
          role: user.role || '',
        })
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // 初始化时展开包含当前路径的菜单
  useEffect(() => {
    navItems.forEach((item: any) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child: any) =>
          location.pathname.startsWith(child.path)
        )
        if (hasActiveChild) {
          setExpandedMenus(prev => new Set(prev).add(item.label))
        }
      }
    })
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }

  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <LayoutDashboard className="w-5 h-5" />,
    monitor: <Activity className="w-5 h-5" />,
    alert: <Bell className="w-5 h-5" />,
    chart: <BarChart3 className="w-5 h-5" />,
    device: <Cpu className="w-5 h-5" />,
    settings: <Settings className="w-5 h-5" />,
  }

  return (
    <div className="min-h-screen bg-clean-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-clean-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full bg-white border-r border-clean-200 flex flex-col shadow-soft">
          {/* Logo */}
          <div className="p-6 border-b border-clean-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nature-500 flex items-center justify-center shadow-leaf">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden"
                >
                  <h1 className="font-display font-bold text-lg text-clean-900">AquaInsight</h1>
                  <p className="text-clean-500 text-xs">智慧环境监测平台</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item: any) => {
              // 有子菜单的项
              if (item.children) {
                const isExpanded = expandedMenus.has(item.label)
                const hasActiveChild = item.children.some((child: any) =>
                  location.pathname.startsWith(child.path)
                )

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={cn(
                        'nav-item w-full',
                        hasActiveChild && 'text-nature-600 bg-nature-50'
                      )}
                    >
                      {iconMap[item.icon]}
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          <ChevronRight
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isExpanded && 'rotate-90'
                            )}
                          />
                        </>
                      )}
                    </button>

                    {/* 子菜单 */}
                    {sidebarOpen && isExpanded && (
                      <div className="ml-9 mt-1 space-y-1">
                        {item.children.map((child: any) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              cn(
                                'block px-3 py-2 rounded-lg text-sm text-clean-600 hover:text-nature-600 hover:bg-nature-50 transition-all duration-200',
                                isActive && 'text-nature-600 bg-nature-50 font-medium'
                              )
                            }
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              // 普通菜单项
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'nav-item',
                      isActive && 'active',
                      !sidebarOpen && 'justify-center px-2'
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {iconMap[item.icon]}
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </NavLink>
              )
            })}
          </nav>

          {/* Sidebar toggle */}
          <div className="p-4 border-t border-clean-100">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-clean-50 text-clean-500 hover:text-nature-600 hover:bg-nature-50 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">收起</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-clean-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-clean-500 hover:text-nature-600 hover:bg-nature-50 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-clean-100 border border-clean-200 focus-within:border-nature-300 transition-all">
                <Search className="w-4 h-4 text-clean-400" />
                <input
                  type="text"
                  placeholder="搜索监测点、设备、告警..."
                  className="bg-transparent border-none outline-none text-sm text-clean-700 placeholder-clean-400 w-64"
                />
                <kbd className="px-2 py-0.5 text-xs text-clean-400 bg-white rounded border border-clean-200">⌘K</kbd>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-clean-500 hover:text-nature-600 hover:bg-nature-50 transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-nature-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-clean-50 border border-clean-200 hover:border-clean-300 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-nature-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-clean-700">{userInfo.name}</p>
                    <p className="text-xs text-clean-500">{userInfo.role === 'admin' ? '管理员' : '用户'}</p>
                  </div>
                  <ChevronDown className={cn(
                    'w-4 h-4 text-clean-400 transition-transform hidden sm:block',
                    userMenuOpen && 'rotate-180'
                  )} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-soft-lg border border-clean-200"
                    >
                      <button
                        onClick={() => {
                          navigate('/settings')
                          setUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-clean-600 hover:text-clean-900 hover:bg-clean-50 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">设置</span>
                      </button>
                      <hr className="my-2 border-clean-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-500 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">退出登录</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
