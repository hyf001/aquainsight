import React, { useState, useMemo } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, theme, Avatar, Dropdown, Badge } from 'antd'
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
import './styles.less'

const { Header, Sider, Content } = AntLayout

// 顶部导航菜单配置
const topMenuItems = [
  { key: 'dashboard', label: '首页' },
  { key: 'task', label: '任务' },
  { key: 'comprehensive', label: '综合' },
]

// 左侧菜单配置 - 根据顶部菜单动态显示
const sideMenuConfig: Record<string, MenuProps['items']> = {
  dashboard: [
    { key: '/dashboard', icon: <DesktopOutlined />, label: '工作台' },
  ],
  task: [
    { key: '/task', icon: <ToolOutlined />, label: '任务计划' },
    { key: '/task-execution', icon: <DesktopOutlined />, label: '任务执行' },
    {
      key: 'task-settings',
      icon: <SettingOutlined />,
      label: '设置',
      children: [
        { key: '/job-categories', icon: <ToolOutlined />, label: '任务类别' },
        { key: '/schemes', icon: <ToolOutlined />, label: '方案管理' },
        { key: '/site-configuration', icon: <SettingOutlined />, label: '站点计划配置' },
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
  const [activeTopMenu, setActiveTopMenu] = useState('dashboard')
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

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
    }
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
    <AntLayout className="layout-container">
      {/* 顶部导航栏 */}
      <Header className="layout-header-top">
        <div className="header-logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
          <span className="logo-text">aquainsight环境运维系统</span>
        </div>
        <div className="header-menu">
          <Menu
            mode="horizontal"
            selectedKeys={[activeTopMenu]}
            items={topMenuItems}
            onClick={handleTopMenuClick}
            className="top-menu"
          />
        </div>
        <div className="header-right">
          <Badge count={0} className="header-icon">
            <MailOutlined />
          </Badge>
          <Badge count={2} className="header-icon">
            <BellOutlined />
          </Badge>
          <SettingOutlined className="header-icon" />
          <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
            <div className="user-info">
              <span className="user-company">平台演示(江苏远畅环保)</span>
              <Avatar size="small" icon={<UserOutlined />} />
            </div>
          </Dropdown>
          <LogoutOutlined className="header-icon logout-icon" onClick={handleLogout} />
        </div>
      </Header>

      <AntLayout>
        {/* 左侧菜单 */}
        <Sider width={200} className="layout-sider" style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            items={currentSideMenu}
            onClick={handleSideMenuClick}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        {/* 内容区域 */}
        <AntLayout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: '24px 0 0',
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  )
}

export default LayoutComponent
