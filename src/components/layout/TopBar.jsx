import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ChevronRight } from 'lucide-react'

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/materias': 'Materias',
  '/grupos': 'Grupos',
  '/estudiantes': 'Estudiantes',
  '/alertas': 'Alertas',
  '/asistencia': 'Pase de Lista',
  '/calificaciones': 'Calificaciones',
  '/mi-perfil': 'Mi Perfil',
  '/mis-materias': 'Mis Materias',
}

export default function TopBar() {
  const { user } = useAuth()
  const location = useLocation()
  const pathname = location.pathname

  // Genera breadcrumbs a partir de la ruta
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/')
    return routeLabels[path] ?? (seg.length === 36 ? 'Detalle' : seg)
  })

  const now = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-medium">
        <span className="text-corp-navy font-bold">EduGuard</span>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-gray-400" />
            <span className={i === crumbs.length - 1 ? 'text-corp-teal font-semibold' : 'text-gray-500'}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Info derecha */}
      <div className="flex items-center gap-5">
        <span className="text-xs text-gray-500 hidden md:block capitalize font-medium">{now}</span>
        <div className="h-4 w-px bg-gray-300" />
        <span className="text-sm text-corp-navy font-semibold">{user?.nombre}</span>
      </div>
    </header>
  )
}
