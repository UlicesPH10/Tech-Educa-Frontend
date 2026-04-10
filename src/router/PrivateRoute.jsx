import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Ruta protegida por autenticación y rol
 * @param {string[]} roles - roles permitidos (vacío = solo require auth)
 */
export function PrivateRoute({ roles = [] }) {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (roles.length > 0 && !roles.includes(user.rol)) {
    // Redirigir al home según rol
    const homeMap = {
      admin: '/dashboard',
      docente: '/estudiantes',
      tutor: '/estudiantes',
      estudiante: '/mi-perfil',
    }
    return <Navigate to={homeMap[user.rol] ?? '/login'} replace />
  }

  return <Outlet />
}

/**
 * Redirige a /login si ya está autenticado
 */
export function PublicRoute() {
  const { token, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (token && user) {
    const homeMap = {
      admin: '/dashboard',
      docente: '/estudiantes',
      tutor: '/estudiantes',
      estudiante: '/mi-perfil',
    }
    return <Navigate to={homeMap[user.rol] ?? '/dashboard'} replace />
  }

  return <Outlet />
}
