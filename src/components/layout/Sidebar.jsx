import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  Bell,
  ClipboardList,
  PenLine,
  GraduationCap,
  Star,
  LogOut,
  Shield,
  Brain,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'
import { useEffect, useState } from 'react'
import { getAlertas } from '../../api/alertas'

const roleConfig = {
  admin: {
    label: 'Administrador',
    color: 'text-violet-400',
    bg: 'bg-violet-500/20',
    nav: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/materias', icon: BookOpen, label: 'Materias' },
      { to: '/grupos', icon: Layers, label: 'Grupos' },
      { to: '/estudiantes', icon: Users, label: 'Estudiantes' },
      { to: '/alertas', icon: Bell, label: 'Alertas' },
    ],
  },
  docente: {
    label: 'Docente',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20',
    nav: [
      { to: '/estudiantes', icon: Users, label: 'Mis Estudiantes' },
      { to: '/asistencia', icon: ClipboardList, label: 'Pase de Lista' },
      { to: '/calificaciones', icon: PenLine, label: 'Calificaciones' },
      { to: '/docente-materias', icon: BookOpen, label: 'Tira de Materias' },
    ],
  },
  estudiante: {
    label: 'Estudiante',
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    nav: [
      { to: '/mi-perfil', icon: GraduationCap, label: 'Mi Perfil' },
      { to: '/mis-materias', icon: Star, label: 'Mis Materias' },
      { to: '/mi-plan-estudio', icon: Brain, label: 'Plan de Estudio' },
    ],
  },
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const rol = user?.rol ?? 'estudiante'
  const config = roleConfig[rol] ?? roleConfig.estudiante
  const [alertaCount, setAlertaCount] = useState(0)

  // Polling de alertas no atendidas para admin
  useEffect(() => {
    if (rol !== 'admin') return
    const fetchAlertas = async () => {
      try {
        const data = await getAlertas({ atendida: false, limit: 100 })
        setAlertaCount(Array.isArray(data) ? data.length : 0)
      } catch {
        /* ignorar errores de polling */
      }
    }
    fetchAlertas()
    const interval = setInterval(fetchAlertas, 60000)
    return () => clearInterval(interval)
  }, [rol])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = getInitials(user?.nombre ?? 'U', '')

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col bg-corp-navy border-r border-[#0B2C54] z-30 shadow-xl shadow-corp-navy/10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/20">
          <Shield size={20} className="text-corp-navy" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-wide">EduGuard</span>
          <p className="text-[11px] text-corp-bluegrey font-medium leading-none mt-0.5">Monitoreo Estudiantil</p>
        </div>
      </div>

      {/* Avatar + usuario */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div
          className={`w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-inner`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user?.nombre}</p>
          <p className={`text-xs font-medium text-corp-lime`}>{config.label}</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {config.nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-link-active flex items-center gap-3' : 'nav-link'
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {label === 'Alertas' && alertaCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {alertaCount > 99 ? '99+' : alertaCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="px-3 py-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          id="btn-logout"
          className="nav-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
