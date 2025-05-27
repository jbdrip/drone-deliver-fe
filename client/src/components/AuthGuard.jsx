import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

const AuthGuard = ({ children }) => {
  const token = Cookies.get('access_token')

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AuthGuard