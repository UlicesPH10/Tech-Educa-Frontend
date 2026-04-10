import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Layers, Bell, BookOpen,
  AlertTriangle, ArrowRight, TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatCard from '../../components/ui/StatCard'
import RiskBadge from '../../components/ui/RiskBadge'
import { getEstudiantes } from '../../api/estudiantes'
import { getGrupos } from '../../api/grupos'
import { getMaterias } from '../../api/materias'
import { getAlertas } from '../../api/alertas'
import { formatDateTime, truncate } from '../../utils/formatters'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    estudiantes: 0,
    grupos: 0,
    alertas: 0,
    materias: 0,
  })
  const [alertasCriticas, setAlertasCriticas] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [estudiantes, grupos, materias, alertas] = await Promise.allSettled([
          getEstudiantes({ limit: 100 }),
          getGrupos(),
          getMaterias(),
          getAlertas({ atendida: false, limit: 5, nivel_riesgo: 'critico' }),
        ])

        setStats({
          estudiantes: estudiantes.status === 'fulfilled' ? (estudiantes.value?.length ?? 0) : 0,
          grupos: grupos.status === 'fulfilled' ? (grupos.value?.length ?? 0) : 0,
          materias: materias.status === 'fulfilled' ? (materias.value?.length ?? 0) : 0,
          alertas: alertas.status === 'fulfilled' ? (alertas.value?.length ?? 0) : 0,
        })

        if (alertas.status === 'fulfilled') {
          setAlertasCriticas(alertas.value?.slice(0, 5) ?? [])
        }
      } catch (err) {
        toast.error('Error cargando datos del dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Vista general del sistema EduGuard</p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Estudiantes"
          value={stats.estudiantes}
          icon={<Users size={20} className="text-violet-400" />}
          color="violet"
          onClick={() => navigate('/estudiantes')}
          trend="Todos los grupos"
        />
        <StatCard
          title="Grupos Activos"
          value={stats.grupos}
          icon={<Layers size={20} className="text-indigo-400" />}
          color="indigo"
          onClick={() => navigate('/grupos')}
          trend="Ciclo escolar actual"
        />
        <StatCard
          title="Alertas Pendientes"
          value={stats.alertas}
          icon={<Bell size={20} className="text-red-400" />}
          color="red"
          onClick={() => navigate('/alertas')}
          trend="Sin atender"
        />
        <StatCard
          title="Materias Registradas"
          value={stats.materias}
          icon={<BookOpen size={20} className="text-blue-400" />}
          color="blue"
          onClick={() => navigate('/materias')}
          trend="Con módulos activos"
        />
      </div>

      {/* Accesos directos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/materias')}
          className="glass-card-hover p-5 flex items-center gap-4 text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen size={20} className="text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Gestionar Materias</p>
            <p className="text-xs text-gray-500 mt-0.5">Crear materias y agregar módulos</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-gray-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => navigate('/grupos')}
          className="glass-card-hover p-5 flex items-center gap-4 text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers size={20} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Crear Grupo</p>
            <p className="text-xs text-gray-500 mt-0.5">Registrar nuevo grupo escolar</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Alertas críticas recientes */}
      <div className="glass-card">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="section-title">Alertas Críticas sin Atender</h2>
          </div>
          <button
            onClick={() => navigate('/alertas')}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            Ver todas <ArrowRight size={12} />
          </button>
        </div>

        {alertasCriticas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <TrendingUp size={28} className="text-green-400" />
            <p className="text-sm text-gray-500">No hay alertas críticas pendientes</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {alertasCriticas.map((alerta) => (
              <div
                key={alerta.id}
                className="flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => navigate('/alertas')}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <RiskBadge nivel={alerta.nivel_riesgo} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-300 leading-snug">
                    {truncate(alerta.mensaje_ia, 120)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Score disparador: <span className="text-gray-400">{alerta.score_disparador}</span>
                    {' · '}
                    {formatDateTime(alerta.creado_en)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
