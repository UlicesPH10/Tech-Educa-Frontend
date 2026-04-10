import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GraduationCap, Mail, Phone, Calendar, Star, BookOpen, AlertOctagon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import RiskBadge from '../../components/ui/RiskBadge'
import RiskGauge from '../../components/ui/RiskGauge'
import ScoreLineChart from '../../components/charts/ScoreLineChart'
import { getEstudiante } from '../../api/estudiantes'
import { formatDate, formatScore, getInitials } from '../../utils/formatters'
import { getRiskConfig } from '../../utils/riskColors'

export default function MiPerfil() {
  const { user } = useAuth()
  const [estudiante, setEstudiante] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Para rol estudiante, la API espera el id del propio estudiante
    // Usamos user.id que corresponde al usuario_id
    getEstudiante('me/perfil')
      .then(setEstudiante)
      .catch(() => toast.error('Error cargando tu perfil'))
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1E69A0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!estudiante) {
    return (
      <div className="glass-card p-10 text-center text-gray-500 max-w-lg mx-auto mt-10">
        <GraduationCap size={32} className="mx-auto mb-3 text-gray-400" />
        <p className="font-medium">No se pudo cargar tu perfil.</p>
      </div>
    )
  }

  const ultimoScore = estudiante.scores_recientes?.[0]
  const nivel = ultimoScore?.nivel_riesgo ?? 'bajo'
  const scoreTotal = ultimoScore?.score_total ?? 0
  const config = getRiskConfig(nivel)

  const getConductRisk = (score) => {
    if (score == null) return 'bajo'
    if (score >= 85) return 'bajo'
    if (score >= 70) return 'medio'
    if (score >= 50) return 'alto'
    return 'critico'
  }
  const nivelConducta = getConductRisk(estudiante.conducta_score)

  return (
    <div className="space-y-6 max-w-2xl px-2">
      <div>
        <h1 className="page-title">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">Tu información académica y estado de riesgo</p>
      </div>

      {/* Header card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold ${config.bg} ${config.text} border-2 ${config.border} flex-shrink-0 shadow-sm`}
          >
            {getInitials(estudiante.nombre, estudiante.apellido)}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-[#0F3C73]">
              {estudiante.nombre} {estudiante.apellido}
            </h2>
            <p className="text-sm font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">{estudiante.matricula}</p>
            <div className="flex flex-wrap gap-4 mt-3 justify-center sm:justify-start text-xs font-medium text-gray-500">
              {estudiante.email && (
                <span className="flex items-center gap-1.5 hover:text-[#1E69A0] transition-colors cursor-pointer">
                  <Mail size={13} className="text-gray-400" /> {estudiante.email}
                </span>
              )}
              {estudiante.fecha_nacimiento && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" /> {formatDate(estudiante.fecha_nacimiento)}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <RiskGauge score={scoreTotal} nivel={nivel} size={110} />
          </div>
        </div>
      </div>

      {/* Score conducta */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} className="text-[#F58723]" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Score de Conducta</p>
        </div>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-4xl font-extrabold text-[#F58723] drop-shadow-sm leading-none">{formatScore(estudiante.conducta_score)}</span>
          <span className="text-sm font-semibold text-gray-400 mb-1">/ 100</span>
          <div className="mb-1"><RiskBadge nivel={nivelConducta} size="sm" /></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-[#1E875F] transition-all"
            style={{ width: `${Math.min(100, estudiante.conducta_score ?? 0)}%` }}
          />
        </div>
      </div>

      {/* Bitácora de Conducta (Timeline) */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertOctagon size={18} className="text-[#0F3C73]" />
          <h2 className="text-lg font-bold text-[#0F3C73]">Bitácora de Conducta</h2>
        </div>
        
        <div className="space-y-0 relative">
          {(estudiante.incidencias && estudiante.incidencias.length > 0) ? (
             estudiante.incidencias.map((incidente) => (
                <div key={incidente.id} className="relative pl-6 border-l-2 border-gray-200 pb-5 last:pb-0 last:border-transparent">
                  <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm ${incidente.gravedad > 30 ? 'bg-red-500' : 'bg-[#F58723]'}`}></div>
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400">{formatDate(incidente.fecha)}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${incidente.gravedad > 30 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                          Mala Conducta (-{incidente.gravedad} pts)
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 leading-relaxed">{incidente.descripcion}</p>
                  </div>
                </div>
             ))
          ) : (
            <p className="text-sm text-gray-400 font-medium py-3">No hay reportes de conducta graves recientes.</p>
          )}
        </div>
      </div>

      {/* Historial de scores */}
      {(estudiante.scores_recientes?.length ?? 0) > 0 && (
        <div className="glass-card p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Historial de Score de Riesgo</p>
          <ScoreLineChart data={estudiante.scores_recientes} />
        </div>
      )}
    </div>
  )
}
