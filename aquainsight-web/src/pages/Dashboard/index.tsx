import React, { useEffect, useState } from 'react'
import {
  MapPinIcon,
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  BellAlertIcon,
  FireIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon,
  BuildingOffice2Icon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { dashboardApi } from '@/services/api/dashboard'
import type { DashboardOverview } from '@/services/api/dashboard'
import { Card, CardBody, Statistic, Divider } from '@/components/ui'

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
      setData(response)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-6 bg-background">
      <h2 className="mb-6 text-2xl md:text-2xl font-semibold text-gray-800">工作台概览</h2>

      {/* 站点与设备统计 */}
      <div className="mb-6 p-5 md:p-5 bg-white rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg md:text-lg font-medium text-gray-700">站点与设备</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="站点总数"
                value={data?.siteStatistics.totalCount || 0}
                prefix={<MapPinIcon className="w-6 h-6 text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
                loading={loading}
              />
              <div className="mt-2 text-xs text-gray-500">
                污水: {data?.siteStatistics.wastewaterCount || 0} | 雨水: {data?.siteStatistics.rainwaterCount || 0}
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="设备总数"
                value={data?.deviceStatistics.totalCount || 0}
                prefix={<ServerIcon className="w-6 h-6 text-green-500" />}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
              />
              <div className="mt-2 text-xs text-gray-500">
                在线: {data?.deviceStatistics.onlineCount || 0}
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="离线设备"
                value={data?.deviceStatistics.offlineCount || 0}
                prefix={<ClockIcon className="w-6 h-6 text-yellow-500" />}
                valueStyle={{ color: '#faad14' }}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="故障设备"
                value={data?.deviceStatistics.faultCount || 0}
                prefix={<ExclamationTriangleIcon className="w-6 h-6 text-red-500" />}
                valueStyle={{ color: '#ff4d4f' }}
                loading={loading}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <Divider className="my-8" />

      {/* 任务统计 */}
      <div className="mb-6 p-5 bg-white rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-700">任务</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="任务总数"
                value={data?.taskStatistics.totalCount || 0}
                prefix={<CheckCircleIcon className="w-6 h-6 text-gray-500" />}
                loading={loading}
              />
              <div className="mt-2 text-xs text-gray-500">
                今日新增: {data?.taskStatistics.todayNewCount || 0}
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="待处理"
                value={data?.taskStatistics.pendingCount || 0}
                prefix={<ClockIcon className="w-6 h-6 text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="进行中"
                value={data?.taskStatistics.inProgressCount || 0}
                prefix={<CheckCircleIcon className="w-6 h-6 text-green-500" />}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="已超期"
                value={data?.taskStatistics.overdueCount || 0}
                prefix={<ExclamationCircleIcon className="w-6 h-6 text-red-500" />}
                valueStyle={{ color: '#ff4d4f' }}
                loading={loading}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <Divider className="my-8" />

      {/* 告警统计 */}
      <div className="mb-6 p-5 bg-white rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-700">告警监控</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="告警总数"
                value={data?.alertStatistics.totalCount || 0}
                prefix={<BellAlertIcon className="w-6 h-6 text-red-500" />}
                valueStyle={{ color: '#ff4d4f' }}
                loading={loading}
              />
              <div className="mt-2 text-xs text-gray-500">
                今日新增: {data?.alertStatistics.todayNewCount || 0}
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="待处理"
                value={data?.alertStatistics.pendingCount || 0}
                prefix={<ClockIcon className="w-6 h-6 text-yellow-500" />}
                valueStyle={{ color: '#faad14' }}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="紧急告警"
                value={data?.alertStatistics.urgentCount || 0}
                prefix={<FireIcon className="w-6 h-6 text-red-500" />}
                valueStyle={{ color: '#ff4d4f' }}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="重要告警"
                value={data?.alertStatistics.importantCount || 0}
                prefix={<ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />}
                valueStyle={{ color: '#fa8c16' }}
                loading={loading}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <Divider className="my-8" />

      {/* 组织统计 */}
      <div className="mb-6 p-5 bg-white rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-700">组织架构</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="企业数量"
                value={data?.organizationStatistics.enterpriseCount || 0}
                prefix={<BuildingStorefrontIcon className="w-6 h-6 text-blue-500" />}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="部门数量"
                value={data?.organizationStatistics.departmentCount || 0}
                prefix={<BuildingOffice2Icon className="w-6 h-6 text-green-500" />}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="用户总数"
                value={data?.organizationStatistics.userCount || 0}
                prefix={<UserIcon className="w-6 h-6 text-purple-600" />}
                loading={loading}
              />
            </CardBody>
          </Card>

          <Card className="rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardBody>
              <Statistic
                title="启用用户"
                value={data?.organizationStatistics.activeUserCount || 0}
                prefix={<UserGroupIcon className="w-6 h-6 text-cyan-500" />}
                valueStyle={{ color: '#13c2c2' }}
                loading={loading}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
