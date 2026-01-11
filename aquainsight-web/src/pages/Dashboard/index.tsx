/**
 * AquaInsight Dashboard - Industrial Edition
 *
 * 工业风格仪表盘页面
 */

import React, { useState } from 'react'
import {
  Layout,
  Sidebar,
  Header,
  StatCard,
  StatusBadge,
  ProgressBar,
  SiteList,
  DataTable,
  Button,
  Empty,
  type Site,
} from '@/components/ui-new'

// Mock data for demonstration
const mockSites: Site[] = [
  { id: 1, name: '东区污水处理厂', status: 'success', waterQuality: 92, lastUpdate: '2分钟前' },
  { id: 2, name: '南区监测站点', status: 'warning', waterQuality: 68, lastUpdate: '5分钟前' },
  { id: 3, name: '西区泵站', status: 'success', waterQuality: 88, lastUpdate: '1分钟前' },
  { id: 4, name: '北区处理站', status: 'error', waterQuality: 45, lastUpdate: '12分钟前' },
]

const mockTableData = [
  { id: 1, site: '东区污水处理厂', parameter: 'COD', value: 45.2, unit: 'mg/L', status: 'normal' },
  { id: 2, site: '东区污水处理厂', parameter: '氨氮', value: 3.2, unit: 'mg/L', status: 'normal' },
  { id: 3, site: '南区监测站点', parameter: '总磷', value: 0.85, unit: 'mg/L', status: 'warning' },
  { id: 4, site: '南区监测站点', parameter: '溶解氧', value: 6.8, unit: 'mg/L', status: 'normal' },
  { id: 5, site: '西区泵站', parameter: 'PH', value: 7.2, unit: '', status: 'normal' },
  { id: 6, site: '北区处理站', parameter: 'COD', value: 125.6, unit: 'mg/L', status: 'error' },
]

const waterQualityData = [
  { label: 'COD', value: 75, max: 100 },
  { label: '氨氮', value: 45, max: 100 },
  { label: '总磷', value: 62, max: 100 },
  { label: '溶解氧', value: 88, max: 100 },
  { label: 'PH值', value: 70, max: 100 },
]

const Dashboard: React.FC = () => {
  const tableColumns = [
    { key: 'site', title: '站点', width: 180 },
    { key: 'parameter', title: '参数', width: 120 },
    {
      key: 'value',
      title: '数值',
      width: 120,
      render: (val: unknown, row: typeof mockTableData[0]) => (
        <span className="font-mono">{val} {row.unit}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      render: (val: unknown) => {
        const status = val as string
        return (
          <StatusBadge status={status as 'success' | 'warning' | 'error' | 'info' | 'normal'}>
            {status === 'normal' ? 'OK' : status === 'warning' ? 'ATTN' : 'ALERT'}
          </StatusBadge>
        )
      },
    },
  ]

  return (
    <Layout>
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <div className="flex-1 overflow-auto p-6 industrial-pattern">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="在线站点"
                value="128"
                change={{ value: 12, positive: true }}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              />
              <StatCard
                title="今日任务"
                value="256"
                change={{ value: 8, positive: true }}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                }
              />
              <StatCard
                title="告警数量"
                value="12"
                change={{ value: 3, positive: false }}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                }
              />
              <StatCard
                title="达标率"
                value="94.2%"
                change={{ value: 2.1, positive: true }}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                }
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Water Quality Panel */}
              <div className="bg-white border-2 border-concrete-300 p-5">
                <h3 className="font-display font-bold text-concrete-900 uppercase tracking-wide mb-4">
                  水质指标
                </h3>
                <div className="space-y-4">
                  {waterQualityData.map((item) => (
                    <ProgressBar
                      key={item.label}
                      value={item.value}
                      max={item.max}
                      label={item.label}
                      color={item.value > 80 ? 'success' : item.value > 60 ? 'warning' : 'error'}
                    />
                  ))}
                </div>
              </div>

              {/* Site List */}
              <div className="lg:col-span-2">
                <SiteList
                  sites={mockSites}
                  onSelect={(site) => console.log('Site selected:', site)}
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-concrete-900 uppercase tracking-wide">
                  实时监测数据
                </h3>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm">
                    导出报表
                  </Button>
                  <Button size="sm">
                    添加监测点
                  </Button>
                </div>
              </div>
              <DataTable
                columns={tableColumns}
                dataSource={mockTableData}
                onRowClick={(row) => console.log('Row clicked:', row)}
              />
            </div>

            {/* Empty State */}
            <Empty
              title="暂无数据"
              description="选择筛选条件后将会显示相关数据"
              action={
                <Button variant="secondary" size="sm" onClick={() => {}}>
                  清除筛选
                </Button>
              }
            />
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Dashboard
