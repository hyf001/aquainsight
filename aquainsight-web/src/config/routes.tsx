import { lazy, LazyExoticComponent } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-clean-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-nature-200 border-t-nature-500 rounded-full animate-spin" />
      <p className="text-clean-400 text-sm">加载中...</p>
    </div>
  </div>
)

const Login: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/Login'))
const Dashboard: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/Dashboard'))
const Alerts: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/Alerts'))
const Analysis: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/Analysis'))
const Settings: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/Settings'))
const StepTemplates: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/StepTemplates'))
const TaskTemplates: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/TaskTemplates'))
const TaskSchedulers: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/TaskSchedulers'))
const Tasks: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/Tasks'))
const TaskDetail: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/TaskDetail'))
const TestPage: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/TestPage'))

// 站点监控模块
const DataPanel: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/monitoring/DataPanel'))
const FactorManagement: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/monitoring/FactorManagement'))
const DeviceModelManagement: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/monitoring/DeviceModelManagement'))
const DeviceManagement: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/monitoring/DeviceManagement'))
const SiteManagement: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/monitoring/SiteManagement'))
const EnterpriseManagement: LazyExoticComponent<() => JSX.Element> = lazy(() => import('@/pages/monitoring/EnterpriseManagement'))

const publicRoutes = ['/login']

const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Dashboard />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/alerts',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Alerts />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/analysis',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Analysis />
        </Suspense>
      </Layout>
    ),
  },
  // 站点监控模块
  {
    path: '/monitoring/data-panel',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <DataPanel />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/monitoring/factors',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <FactorManagement />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/monitoring/device-models',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <DeviceModelManagement />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/monitoring/devices',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <DeviceManagement />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/monitoring/sites',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <SiteManagement />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/monitoring/enterprises',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <EnterpriseManagement />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Settings />
        </Suspense>
      </Layout>
    ),
  },
  // 运维管理模块
  {
    path: '/maintenance/step-templates',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <StepTemplates />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/maintenance/task-templates',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <TaskTemplates />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/maintenance/task-schedulers',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <TaskSchedulers />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/tasks',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Tasks />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/tasks/:id',
    element: (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <TaskDetail />
        </Suspense>
      </Layout>
    ),
  },
  // Test page
  {
    path: '/test',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <TestPage />
      </Suspense>
    ),
  },
]

export const navItems = [
  { path: '/', label: '数据总览', icon: 'dashboard' },
  {
    label: '站点监控',
    icon: 'monitor',
    children: [
      { path: '/monitoring/data-panel', label: '数据面板' },
      { path: '/monitoring/factors', label: '因子管理' },
      { path: '/monitoring/device-models', label: '设备型号管理' },
      { path: '/monitoring/devices', label: '设备管理' },
      { path: '/monitoring/sites', label: '站点管理' },
      { path: '/monitoring/enterprises', label: '企业管理' },
    ],
  },
  { path: '/alerts', label: '告警中心', icon: 'alert' },
  { path: '/analysis', label: '数据分析', icon: 'chart' },
  {
    label: '运维管理',
    icon: 'settings',
    children: [
      { path: '/maintenance/step-templates', label: '步骤模版' },
      { path: '/maintenance/task-templates', label: '任务模版' },
      { path: '/maintenance/task-schedulers', label: '调度任务管理' },
      { path: '/tasks', label: '运维任务' },
    ],
  },
  { path: '/settings', label: '系统设置', icon: 'settings' },
]

export { routes, publicRoutes }
