import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'

const Layout = lazy(() => import('@/components/Layout'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Task = lazy(() => import('@/pages/Task'))
const Material = lazy(() => import('@/pages/Material'))
const Analysis = lazy(() => import('@/pages/Analysis'))
const Knowledge = lazy(() => import('@/pages/Knowledge'))
const Monitor = lazy(() => import('@/pages/Monitor'))
const System = lazy(() => import('@/pages/System'))
const Organization = lazy(() => import('@/pages/Organization'))
const Login = lazy(() => import('@/pages/Login'))

const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoading />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Spin />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'task',
        element: (
          <Suspense fallback={<Spin />}>
            <Task />
          </Suspense>
        ),
      },
      {
        path: 'material',
        element: (
          <Suspense fallback={<Spin />}>
            <Material />
          </Suspense>
        ),
      },
      {
        path: 'analysis',
        element: (
          <Suspense fallback={<Spin />}>
            <Analysis />
          </Suspense>
        ),
      },
      {
        path: 'knowledge',
        element: (
          <Suspense fallback={<Spin />}>
            <Knowledge />
          </Suspense>
        ),
      },
      {
        path: 'monitor',
        element: (
          <Suspense fallback={<Spin />}>
            <Monitor />
          </Suspense>
        ),
      },
      {
        path: 'system',
        element: (
          <Suspense fallback={<Spin />}>
            <System />
          </Suspense>
        ),
      },
      {
        path: 'organization',
        element: (
          <Suspense fallback={<Spin />}>
            <Organization />
          </Suspense>
        ),
      },
    ],
  },
])
