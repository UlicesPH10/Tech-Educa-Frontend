import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, Phone, Calendar, Star } from 'lucide-react'
import RiskBadge from '../../components/ui/RiskBadge'
import RiskGauge from '../../components/ui/RiskGauge'
import ScoreLineChart from '../../components/charts/ScoreLineChart'
import { getEstudiante } from '../../api/estudiantes'
import { formatDate, formatScore, getInitials } from '../../utils/formatters'
import { getRiskConfig } from '../../utils/riskColors'

export default function EstudianteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [estudiante, setEstudiante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('scores')

  useEffect(() => {
    getEstudiante(id)
      .then(setEstudiante)
      .catch(() => toast.error('Error cargando estudiante'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!estudiante) {
    return (
      <div className="glass-card p-10 text-center text-gray-500">
        Estudiante no encontrado.
      </div>
    )
  }

  const ultimoScore = estudiante.scores_recientes?.[0]
  const nivel = ultimoScore?.nivel_riesgo ?? 'bajo'
  const scoreTotal = ultimoScore?.score_total ?? 0
  const config = getRiskConfig(nivel)
  const initials = getInitials(estudiante.nombre, estudiante.apellido)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={15} /> Regresar
      </button>

      {/* Header del estudiante */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${config.bg} ${config.text} border-2 ${config.border}`}
          >
            {initials}
          </div>

          {/* Info básica */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-white">
                {estudiante.nombre} {estudiante.apellido}
              </h1>
              <RiskBadge nivel={nivel} />
            </div>
            <p className="text-sm text-gray-500 mt-1 font-mono">{estudiante.matricula}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
              {estudiante.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={12} /> {estudiante.email}
                </span>
              )}
              {estudiante.telefono && (
                <span className="flex items-center gap-1.5">
                  <Phone size={12} /> {estudiante.telefono}
                </span>
              )}
              {estudiante.fecha_nacimiento && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> {formatDate(estudiante.fecha_nacimiento)}
                </span>
              )}
            </div>
          </div>

          {/* Gauge */}
          <div className="flex-shrink-0">
            <RiskGauge score={scoreTotal} nivel={nivel} size={120} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score de conducta */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-yellow-400" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Score Conducta</p>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {formatScore(estudiante.conducta_score)}
            <span className="text-sm text-gray-500 font-normal ml-1">/ 100</span>
          </p>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
              style={{ width: `${Math.min(100, estudiante.conducta_score ?? 0)}%` }}
            />
          </div>
        </div>

        {/* Información del grupo */}
        <div className="glass-card p-5 md:col-span-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Información</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Grupo ID</p>
              <p className="text-gray-200 font-medium">{estudiante.grupo_id ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Tutor ID</p>
              <p className="text-gray-200 font-medium">{estudiante.tutor_id ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Registrado</p>
              <p className="text-gray-200 font-medium">{formatDate(estudiante.creado_en)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Último score calculado</p>
              <p className="text-gray-200 font-medium">{formatDate(ultimoScore?.calculado_en)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card">
        <div className="flex border-b border-white/5">
          {[
            { id: 'scores', label: 'Historial de Scores' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-violet-300 border-b-2 border-violet-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'scores' && (
            <div className="space-y-4">
              <ScoreLineChart data={estudiante.scores_recientes ?? []} />
              {/* Tabla de scores */}
              {(estudiante.scores_recientes?.length ?? 0) > 0 ? (
                <table className="w-full text-sm mt-4">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="table-th">Fecha</th>
                      <th className="table-th">Score Total</th>
                      <th className="table-th">Nivel de Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiante.scores_recientes.map((s, i) => (
                      <tr key={i} className="table-row">
                        <td className="table-td">{formatDate(s.calculado_en)}</td>
                        <td className="table-td font-mono font-semibold">
                          {formatScore(s.score_total)}
                        </td>
                        <td className="table-td">
                          <RiskBadge nivel={s.nivel_riesgo} showEmoji={false} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-600 text-sm py-4">Sin scores registrados.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
