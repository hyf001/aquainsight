import { useEffect } from 'react'
import { useRoutes, useNavigate, useLocation } from 'react-router-dom'
import { routes } from '@/config/routes'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const element = useRoutes(routes)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isPublicRoute = location.pathname === '/login'

    if (!token && !isPublicRoute) {
      navigate('/login', { replace: true })
    } else if (token && location.pathname === '/login') {
      navigate('/', { replace: true })
    }
  }, [location.pathname, navigate])

  return element
}

export default App
