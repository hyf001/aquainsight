import React, { useState, useMemo, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, ConfigProvider, Avatar, Dropdown, Badge } from 'antd'
import type { MenuProps } from 'antd'
import {
  BankOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  ExperimentOutlined,
  DesktopOutlined,
  BellOutlined,
  MailOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useUserStore } from '@/stores/useUserStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useTabsStore } from '@/stores/useTabsStore'
import NotificationDropdown from '@/components/NotificationDropdown'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import TabsBar from '@/components/TabsBar'
import { routeConfig } from '@/config/routes'
import logoImg from '@/assets/logo.svg'
import './styles.less'

const { Header, Sider, Content } = AntLayout

// 顶部导航菜单配置
const topMenuItems = [
  { key: 'dashboard', label: '首页' },
  { key: 'task', label: '任务' },
  { key: 'site', label: '站点' },
  { key: 'comprehensive', label: '综合' },
]

// 左侧菜单配置 - 根据顶部菜单动态显示
const sideMenuConfig: Record<string, MenuProps['items']> = {
  dashboard: [
    { key: '/dashboard', icon: <DesktopOutlined />, label: '工作台' },
  ],
  task: [
    { key: '/task', icon: <ToolOutlined />, label: '任务调度' },
    { key: '/task-execution', icon: <DesktopOutlined />, label: '任务' },
    {
      key: 'task-settings',
      icon: <SettingOutlined />,
      label: '设置',
      children: [
        { key: '/step-templates', icon: <ToolOutlined />, label: '步骤模版' },
        { key: '/taskTemplates', icon: <ToolOutlined />, label: '任务模版' },
        { key: '/site-configuration', icon: <SettingOutlined />, label: '任务调度' },
      ],
    },
  ],
  site: [
    { key: '/enterprise', icon: <BankOutlined />, label: '运维企业' },
    { key: '/sites', icon: <EnvironmentOutlined />, label: '运维站点' },
    { key: '/device-models', icon: <ToolOutlined />, label: '设备管理' },
    {
      key: 'site-equipment',
      icon: <DesktopOutlined />,
      label: '站点设备',
      children: [
        { key: '/site-devices', icon: <DesktopOutlined />, label: '设备信息' },
        { key: '/detection-factors', icon: <ExperimentOutlined />, label: '检测因子' },
      ],
    },
  ],
  comprehensive: [
    {
      key: 'organization-management',
      icon: <BankOutlined />,
      label: '机构管理',
      children: [
        { key: '/organization', icon: <BankOutlined />, label: '部门管理' },
        { key: '/personnel', icon: <TeamOutlined />, label: '人员管理' },
      ],
    },
    {
      key: 'alert-management',
      icon: <BellOutlined />,
      label: '告警',
      children: [
        { key: '/alert-rules', icon: <SettingOutlined />, label: '告警规则' },
        { key: '/alert-records', icon: <BellOutlined />, label: '告警实例' },
        { key: '/alert-notifications', icon: <MailOutlined />, label: '消息通知' },
      ],
    },
  ],
}

const LayoutComponent: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useUserStore()
  const { currentTheme } = useThemeStore()
  const { addTab } = useTabsStore()
  const [activeTopMenu, setActiveTopMenu] = useState('dashboard')

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

  const handleTopMenuClick = ({ key }: { key: string }) => {
    setActiveTopMenu(key)
  }

  const handleSideMenuClick = ({ key }: { key: string }) => {
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

  const userDropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: currentTheme.primaryColor,
        },
      }}
    >
      <AntLayout className="layout-container" style={{ '--header-bg': currentTheme.headerBg } as React.CSSProperties}>
        {/* 顶部导航栏 */}
        <Header className="layout-header-top" style={{ background: currentTheme.headerBg }}>
          <div className="header-logo" onClick={handleLogoClick}>
            <img src={logoImg} alt="aquainsight 环境运维系统" className="logo-img" />
          </div>
          <div className="header-menu">
            <Menu
              mode="horizontal"
              selectedKeys={[activeTopMenu]}
              items={topMenuItems}
              onClick={handleTopMenuClick}
              className="top-menu"
              style={{ background: currentTheme.headerBg }}
            />
          </div>
          <div className="header-right">
            <Badge count={0} className="header-icon">
              <MailOutlined />
            </Badge>
            <NotificationDropdown />
            <ThemeSwitcher />
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
              <div className="user-info">
                <span className="user-company">演示环境</span>
                <Avatar size="small" icon={<UserOutlined />} />
              </div>
            </Dropdown>
            <LogoutOutlined className="header-icon logout-icon" onClick={handleLogout} />
          </div>
        </Header>

        <AntLayout>
          {/* 左侧菜单 */}
          <Sider width={160} className="layout-sider" style={{ background: currentTheme.siderBg }}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              items={currentSideMenu}
              onClick={handleSideMenuClick}
              style={{
                height: '100%',
                borderRight: 0,
                background: currentTheme.menuBg,
                color: currentTheme.menuTextColor
              }}
              theme="dark"
            />
          </Sider>

          {/* 内容区域 */}
          <AntLayout style={{ padding: 0 }}>
            {/* 标签页 */}
            <TabsBar />

            {/* 主内容 */}
            <Content
              style={{
                padding: 12,
                margin: 0,
                minHeight: 'calc(100vh - 48px - 40px)',
                background: currentTheme.contentBg,
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  padding: 16,
                  background: '#fff',
                  borderRadius: 2,
                  minHeight: '100%',
                }}
              >
                <Outlet />
              </div>
            </Content>
          </AntLayout>
        </AntLayout>
      </AntLayout>
    </ConfigProvider>
  )
}

export default LayoutComponent
