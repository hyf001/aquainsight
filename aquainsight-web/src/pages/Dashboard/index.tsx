import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Divider } from 'antd'
import {
  EnvironmentOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  FireOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  ApartmentOutlined,
  UserOutlined
} from '@ant-design/icons'
import { dashboardApi } from '@/services/api/dashboard'
import type { DashboardOverview } from '@/services/api/dashboard'
import './styles.less'

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await dashboardApi.getOverview()
      setData(response.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <h2>工作台概览</h2>

      {/* 站点与设备统计 */}
      <div className="dashboard-section">
        <h3>站点与设备</h3>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="站点总数"
                value={data?.siteStatistics.totalCount || 0}
                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="statistic-extra">
                污水: {data?.siteStatistics.wastewaterCount || 0} | 雨水: {data?.siteStatistics.rainwaterCount || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="设备总数"
                value={data?.deviceStatistics.totalCount || 0}
                prefix={<DatabaseOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div className="statistic-extra">
                在线: {data?.deviceStatistics.onlineCount || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="离线设备"
                value={data?.deviceStatistics.offlineCount || 0}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="故障设备"
                value={data?.deviceStatistics.faultCount || 0}
                prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 任务统计 */}
      <div className="dashboard-section">
        <h3>任务执行</h3>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="任务总数"
                value={data?.taskStatistics.totalCount || 0}
                prefix={<CheckCircleOutlined />}
              />
              <div className="statistic-extra">
                今日新增: {data?.taskStatistics.todayNewCount || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="待处理"
                value={data?.taskStatistics.pendingCount || 0}
                prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="进行中"
                value={data?.taskStatistics.inProgressCount || 0}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="已超期"
                value={data?.taskStatistics.overdueCount || 0}
                prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 告警统计 */}
      <div className="dashboard-section">
        <h3>告警监控</h3>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="告警总数"
                value={data?.alertStatistics.totalCount || 0}
                prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
              <div className="statistic-extra">
                今日新增: {data?.alertStatistics.todayNewCount || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="待处理"
                value={data?.alertStatistics.pendingCount || 0}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="紧急告警"
                value={data?.alertStatistics.urgentCount || 0}
                prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="重要告警"
                value={data?.alertStatistics.importantCount || 0}
                prefix={<WarningOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 组织统计 */}
      <div className="dashboard-section">
        <h3>组织架构</h3>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="企业数量"
                value={data?.organizationStatistics.enterpriseCount || 0}
                prefix={<ShopOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="部门数量"
                value={data?.organizationStatistics.departmentCount || 0}
                prefix={<ApartmentOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="用户总数"
                value={data?.organizationStatistics.userCount || 0}
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="启用用户"
                value={data?.organizationStatistics.activeUserCount || 0}
                prefix={<TeamOutlined style={{ color: '#13c2c2' }} />}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Dashboard
