import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { dashboardApi } from '@/services/api/dashboard'
import type { DashboardData } from '@/services/api/dashboard'
import './styles.less'

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await dashboardApi.getStats()
      setData(response.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <h2>工作台</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="任务总数"
              value={data?.taskStat.total || 0}
              prefix={<ArrowUpOutlined />}
              suffix={`今日 ${data?.taskStat.today || 0}`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="物料总数"
              value={data?.materialStat.total || 0}
              prefix={<ArrowUpOutlined />}
              suffix={`今日 ${data?.materialStat.today || 0}`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="告警总数"
              value={data?.alarmStat.total || 0}
              prefix={<ArrowDownOutlined style={{ color: '#cf1322' }} />}
              suffix={`今日 ${data?.alarmStat.today || 0}`}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
