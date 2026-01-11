import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { routes } from '@/config/routes'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isPublicRoute = location.pathname === '/login'

    if (!token && !isPublicRoute) {
      navigate('/login', { replace: true })
    } else if (token && location.pathname === '/login') {
      navigate('/', { replace: true })
    }
  }, [location.pathname, navigate])

  return <Routes>{routes.map((route) => (
    <Route key={route.path} {...route} />
  ))}</Routes>
}

export default App
