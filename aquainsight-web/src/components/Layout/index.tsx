import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, theme } from 'antd'
import {
  DashboardOutlined,
  CheckSquareOutlined,
  InboxOutlined,
  BarChartOutlined,
  BookOutlined,
  MonitorOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useAppStore } from '@/stores/useAppStore'
import { useUserStore } from '@/stores/useUserStore'
import './styles.less'

const { Header, Sider, Content } = AntLayout

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
  { key: '/task', icon: <CheckSquareOutlined />, label: '任务管理' },
  { key: '/material', icon: <InboxOutlined />, label: '物料管理' },
  { key: '/analysis', icon: <BarChartOutlined />, label: '数据分析' },
  { key: '/knowledge', icon: <BookOutlined />, label: '知识库' },
  { key: '/monitor', icon: <MonitorOutlined />, label: '监控告警' },
  { key: '/organization', icon: <TeamOutlined />, label: '组织管理' },
  { key: '/system', icon: <SettingOutlined />, label: '系统管理' },
]

const LayoutComponent: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { collapsed, toggleCollapsed } = useAppStore()
  const { user } = useUserStore()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <AntLayout className="layout-container">
      <Sider trigger={null} collapsible collapsed={collapsed} className="layout-sider">
        <div className="logo">
          <h1>{collapsed ? 'AI' : 'AquaInsight'}</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="layout-header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggleCollapsed,
            })}
          </div>
          <div className="header-right">
            <span className="user-name">{user?.name || '用户'}</span>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default LayoutComponent
