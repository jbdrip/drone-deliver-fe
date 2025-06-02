import { Navigate, useLocation } from 'react-router-dom'
import { useUserData } from '../../hooks/useAuth'
import routes from './routes'

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading, error, userRole } = useUserData()
  const location = useLocation()

  // Mostrar loading mientras se verifican los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Si hay error, mostrar mensaje o redirigir
  if (error) {
    console.error('Error en AuthGuard:', error)
    return <Navigate to="/" replace />
  }

  // Verificar autenticación (tanto userData como accessToken)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Verificar si el rol del usuario permite el acceso
  if (routes.length > 0 && userRole) {
    const currentRoute = routes.find(route => route.path === location.pathname)
    if(currentRoute && currentRoute.role !== userRole) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default AuthGuard