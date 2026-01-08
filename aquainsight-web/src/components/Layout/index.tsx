import React, { useState, useMemo, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  BellIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import { useUserStore } from '@/stores/useUserStore'
import { useTabsStore } from '@/stores/useTabsStore'
import NotificationDropdown from '@/components/NotificationDropdown'
import TabsBar from '@/components/TabsBar'
import { routeConfig } from '@/config/routes'
import { Menu, Avatar, Dropdown, DropdownItem, DropdownDivider } from '@/components/ui'
import logoImg from '@/assets/logo.svg'

// 顶部导航菜单配置
const topMenuItems = [
  { key: 'dashboard', label: '首页' },
  { key: 'task', label: '任务' },
  { key: 'site', label: '站点' },
  { key: 'comprehensive', label: '综合' },
]

// 左侧菜单配置 - 根据顶部菜单动态显示
const sideMenuConfig: Record<string, any[]> = {
  dashboard: [
    { key: '/dashboard', icon: <ComputerDesktopIcon className="w-5 h-5" />, label: '工作台' },
  ],
  task: [
    { key: '/task', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, label: '任务调度' },
    { key: '/task-execution', icon: <ComputerDesktopIcon className="w-5 h-5" />, label: '任务' },
    {
      key: 'task-settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      title: '设置',
      children: [
        { key: '/step-templates', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, label: '步骤模版' },
        { key: '/taskTemplates', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, label: '任务模版' },
        { key: '/site-configuration', icon: <Cog6ToothIcon className="w-5 h-5" />, label: '任务调度' },
      ],
    },
  ],
  site: [
    { key: '/enterprise', icon: <BuildingOfficeIcon className="w-5 h-5" />, label: '运维企业' },
    { key: '/sites', icon: <MapPinIcon className="w-5 h-5" />, label: '运维站点' },
    { key: '/device-models', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, label: '设备管理' },
    {
      key: 'site-equipment',
      icon: <ComputerDesktopIcon className="w-5 h-5" />,
      title: '站点设备',
      children: [
        { key: '/site-devices', icon: <ComputerDesktopIcon className="w-5 h-5" />, label: '设备信息' },
        { key: '/detection-factors', icon: <BeakerIcon className="w-5 h-5" />, label: '检测因子' },
      ],
    },
  ],
  comprehensive: [
    {
      key: 'organization-management',
      icon: <BuildingOfficeIcon className="w-5 h-5" />,
      title: '机构管理',
      children: [
        { key: '/organization', icon: <BuildingOfficeIcon className="w-5 h-5" />, label: '部门管理' },
        { key: '/personnel', icon: <UserGroupIcon className="w-5 h-5" />, label: '人员管理' },
      ],
    },
    {
      key: 'alert-management',
      icon: <BellIcon className="w-5 h-5" />,
      title: '告警',
      children: [
        { key: '/alert-rules', icon: <Cog6ToothIcon className="w-5 h-5" />, label: '告警规则' },
        { key: '/alert-records', icon: <BellIcon className="w-5 h-5" />, label: '告警实例' },
        { key: '/alert-notifications', icon: <EnvelopeIcon className="w-5 h-5" />, label: '消息通知' },
      ],
    },
  ],
}

const LayoutComponent: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useUserStore()
  const { addTab } = useTabsStore()
  const [activeTopMenu, setActiveTopMenu] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 当前左侧菜单项
  const currentSideMenu = useMemo(() => {
    return sideMenuConfig[activeTopMenu] || []
  }, [activeTopMenu])

  // 获取当前选中的菜单key
  const selectedKeys = useMemo(() => {
    return [location.pathname]
  }, [location.pathname])

  // 获取展开的菜单key
  const defaultOpenKeys = useMemo(() => {
    const openKeys: string[] = []
    currentSideMenu?.forEach((item: any) => {
      if (item?.children) {
        const hasSelected = item.children.some((child: any) => child.key === location.pathname)
        if (hasSelected) {
          openKeys.push(item.key)
        }
      }
    })
    return openKeys
  }, [currentSideMenu, location.pathname])

  const handleTopMenuClick = (key: string) => {
    setActiveTopMenu(key)
  }

  const handleSideMenuClick = (key: string) => {
    if (key.startsWith('/')) {
      navigate(key)
      // 添加标签页
      const route = routeConfig[key]
      if (route) {
        addTab({
          key: route.path,
          label: route.label,
          path: route.path,
          closable: route.closable,
        })
      }
    }
  }

  // 监听路由变化，自动添加标签页
  useEffect(() => {
    const route = routeConfig[location.pathname]
    if (route) {
      addTab({
        key: route.path,
        label: route.label,
        path: route.path,
        closable: route.closable,
      })
    }
  }, [location.pathname, addTab])

  const handleLogoClick = () => {
    navigate('/organization')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // 渲染菜单项
  const renderMenuItems = (items: any[]) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      )
    })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="flex items-center h-12 px-4 bg-ocean-navy text-ocean-cream shadow-lg flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
          <img src={logoImg} alt="aquainsight" className="h-8 w-8" />
          <span className="text-lg font-semibold hidden md:inline">AquaInsight</span>
        </div>

        {/* 顶部菜单 */}
        <nav className="flex items-center gap-1 ml-8">
          {topMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTopMenuClick(item.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTopMenu === item.key
                  ? 'bg-ocean-teal text-white'
                  : 'text-ocean-cream hover:bg-ocean-teal hover:bg-opacity-20'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-4 ml-auto">
          {/* 邮件图标 */}
          <button className="relative p-2 hover:bg-ocean-teal hover:bg-opacity-20 rounded-lg transition-colors">
            <EnvelopeIcon className="w-5 h-5" />
          </button>

          {/* 通知下拉 */}
          <NotificationDropdown />

          {/* 用户下拉菜单 */}
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 cursor-pointer hover:bg-ocean-teal hover:bg-opacity-20 px-3 py-1.5 rounded-lg transition-colors">
                <span className="text-sm hidden md:inline">演示环境</span>
                <Avatar size="sm">
                  <UserIcon className="w-4 h-4" />
                </Avatar>
              </div>
            }
          >
            <DropdownItem icon={<UserIcon className="w-4 h-4" />}>个人中心</DropdownItem>
            <DropdownItem icon={<Cog6ToothIcon className="w-4 h-4" />}>设置</DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />} onClick={handleLogout} danger>
              退出登录
            </DropdownItem>
          </Dropdown>

          {/* 退出按钮 */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
            title="退出登录"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
        <aside
          className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 overflow-y-auto scrollbar-thin ${
            sidebarCollapsed ? 'w-0' : 'w-40'
          }`}
        >
          {!sidebarCollapsed && (
            <Menu
              selectedKeys={selectedKeys}
              openKeys={defaultOpenKeys}
              onSelect={handleSideMenuClick}
              className="py-2"
            >
              {renderMenuItems(currentSideMenu)}
            </Menu>
          )}
        </aside>

        {/* 右侧内容区 */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* 标签栏 */}
          <TabsBar />

          {/* 页面内容 */}
          <div className="flex-1 p-3 overflow-auto bg-background">
            <div className="bg-white rounded-lg p-4 min-h-full shadow-sm">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LayoutComponent
