import { useState, useEffect, useRef, useCallback } from 'react'
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
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeft,
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
  const [searchFocused, setSearchFocused] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
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

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      // Escape 关闭移动端菜单
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleMenu = useCallback((label: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }, [])

  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <LayoutDashboard className="w-5 h-5" />,
    monitor: <Activity className="w-5 h-5" />,
    alert: <Bell className="w-5 h-5" />,
    chart: <BarChart3 className="w-5 h-5" />,
    device: <Cpu className="w-5 h-5" />,
    settings: <Settings className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
  }

  // 子菜单动画配置
  const submenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.2, ease: 'easeInOut' }
    }
  }

  return (
    <div className="min-h-screen bg-clean-50">
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-clean-900/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full bg-white border-r border-clean-200 flex flex-col shadow-soft">
          {/* Logo */}
          <div className="p-6 border-b border-clean-100">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-nature-400 to-nature-600 flex items-center justify-center shadow-leaf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <h1 className="font-display font-bold text-lg text-clean-900">AquaInsight</h1>
                    <p className="text-clean-500 text-xs">智慧环境监测平台</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* 移动端关闭按钮 */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden ml-auto p-2 rounded-lg text-clean-400 hover:text-clean-600 hover:bg-clean-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
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
                        'nav-item w-full group',
                        hasActiveChild && 'text-nature-600 bg-nature-50'
                      )}
                    >
                      <span className={cn(
                        'transition-colors',
                        hasActiveChild ? 'text-nature-600' : 'text-clean-500 group-hover:text-nature-500'
                      )}>
                        {iconMap[item.icon]}
                      </span>
                      <AnimatePresence mode="wait">
                        {sidebarOpen && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex items-center justify-between"
                          >
                            <span className="text-left truncate">{item.label}</span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* 子菜单 */}
                    <AnimatePresence>
                      {sidebarOpen && isExpanded && (
                        <motion.div
                          variants={submenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="ml-9 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.children.map((child: any, index: number) => (
                            <motion.div
                              key={child.path}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <NavLink
                                to={child.path}
                                className={({ isActive }) =>
                                  cn(
                                    'block px-3 py-2 rounded-lg text-sm transition-all duration-200',
                                    'hover:text-nature-600 hover:bg-nature-50 hover:translate-x-1',
                                    isActive
                                      ? 'text-nature-600 bg-nature-50 font-medium'
                                      : 'text-clean-600'
                                  )
                                }
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.label}
                              </NavLink>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      'nav-item group',
                      isActive && 'active',
                      !sidebarOpen && 'justify-center px-2'
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={cn(
                    'transition-colors',
                    'text-clean-500 group-hover:text-nature-500'
                  )}>
                    {iconMap[item.icon]}
                  </span>
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              )
            })}
          </nav>

          {/* Sidebar toggle */}
          <div className="p-4 border-t border-clean-100">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 rounded-xl',
                'bg-clean-50 text-clean-500 hover:text-nature-600 hover:bg-nature-50',
                'transition-all duration-200',
                !sidebarOpen && 'justify-center'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {sidebarOpen ? (
                <>
                  <PanelLeftClose className="w-5 h-5" />
                  <span className="text-sm">收起侧栏</span>
                </>
              ) : (
                <PanelLeft className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-clean-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-clean-500 hover:text-nature-600 hover:bg-nature-50 transition-all"
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>

              {/* Search */}
              <div className={cn(
                'hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200',
                searchFocused
                  ? 'bg-white border-nature-300 ring-2 ring-nature-100 shadow-sm'
                  : 'bg-clean-50 border-clean-200 hover:border-clean-300'
              )}>
                <Search className={cn(
                  'w-4 h-4 transition-colors',
                  searchFocused ? 'text-nature-500' : 'text-clean-400'
                )} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="搜索监测点、设备、告警..."
                  className="bg-transparent border-none outline-none text-sm text-clean-700 placeholder-clean-400 w-64"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <kbd className={cn(
                  'px-2 py-0.5 text-xs rounded border transition-colors',
                  searchFocused
                    ? 'text-nature-600 bg-nature-50 border-nature-200'
                    : 'text-clean-400 bg-white border-clean-200'
                )}>
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <motion.button
                className="relative p-2.5 rounded-xl text-clean-500 hover:text-nature-600 hover:bg-nature-50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <motion.span
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl border transition-all',
                    userMenuOpen
                      ? 'bg-nature-50 border-nature-200'
                      : 'bg-clean-50 border-clean-200 hover:border-clean-300'
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nature-400 to-nature-600 flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-clean-700">{userInfo.name}</p>
                    <p className="text-xs text-clean-500">{userInfo.role === 'admin' ? '管理员' : '用户'}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-clean-400 hidden sm:block" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-soft-lg border border-clean-200 overflow-hidden"
                    >
                      <motion.button
                        onClick={() => {
                          navigate('/settings')
                          setUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-clean-600 hover:text-clean-900 hover:bg-clean-50 transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">设置</span>
                      </motion.button>
                      <hr className="my-2 border-clean-100" />
                      <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-500 hover:bg-red-50 transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">退出登录</span>
                      </motion.button>
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
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
