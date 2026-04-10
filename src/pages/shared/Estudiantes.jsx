import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search, ChevronRight, Users } from 'lucide-react'
import RiskBadge from '../../components/ui/RiskBadge'
import { getEstudiantes } from '../../api/estudiantes'
import { getGrupos } from '../../api/grupos'
import { formatScore, getInitials } from '../../utils/formatters'
import { getRiskConfig } from '../../utils/riskColors'

function Avatar({ nombre, apellido, nivel }) {
  const config = getRiskConfig(nivel)
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${config.bg} ${config.text}`}
    >
      {getInitials(nombre, apellido)}
    </div>
  )
}

export default function Estudiantes() {
  const navigate = useNavigate()
  const [estudiantes, setEstudiantes] = useState([])
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [grupoId, setGrupoId] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [est, grps] = await Promise.all([
        getEstudiantes({ grupo_id: grupoId || undefined, limit: 100 }),
        getGrupos(),
      ])
      setEstudiantes(est ?? [])
      setGrupos(grps ?? [])
    } catch { toast.error('Error cargando estudiantes') }
    finally { setLoading(false) }
  }, [grupoId])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = estudiantes.filter((e) => {
    const q = search.toLowerCase()
    return (
      !q ||
      e.nombre?.toLowerCase().includes(q) ||
      e.apellido?.toLowerCase().includes(q) ||
      e.matricula?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Estudiantes</h1>
        <p className="text-gray-500 text-sm mt-1">{filtered.length} estudiantes encontrados</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            id="search-estudiantes"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o matrícula..."
            className="input-field pl-9"
          />
        </div>
        <select
          id="filter-grupo"
          value={grupoId}
          onChange={(e) => setGrupoId(e.target.value)}
          className="input-field sm:w-52"
        >
          <option value="">Todos los grupos</option>
          {grupos.map((g) => (
            <option key={g.id} value={g.id}>{g.nombre}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-500 text-sm">
          <Users size={28} className="mx-auto mb-2 text-gray-700" />
          No se encontraron estudiantes.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="table-th">Estudiante</th>
                  <th className="table-th">Matrícula</th>
                  <th className="table-th">Grupo</th>
                  <th className="table-th">Último Score</th>
                  <th className="table-th">Nivel de Riesgo</th>
                  <th className="table-th w-12" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((est) => {
                  const nivel = est.ultimo_score?.nivel_riesgo ?? 'bajo'
                  const score = est.ultimo_score?.score_total
                  return (
                    <tr
                      key={est.id}
                      className="table-row cursor-pointer"
                      onClick={() => navigate(`/estudiantes/${est.id}`)}
                      id={`row-estudiante-${est.id}`}
                    >
                      <td className="table-td">
                        <div className="flex items-center gap-2.5">
                          <Avatar nombre={est.nombre} apellido={est.apellido} nivel={nivel} />
                          <span className="font-medium text-gray-200">
                            {est.nombre} {est.apellido}
                          </span>
                        </div>
                      </td>
                      <td className="table-td font-mono text-xs text-gray-500">{est.matricula}</td>
                      <td className="table-td">{est.grupo_nombre ?? '—'}</td>
                      <td className="table-td">
                        <span className="font-mono font-semibold text-gray-200">
                          {score !== undefined && score !== null ? formatScore(score) : '—'}
                        </span>
                      </td>
                      <td className="table-td">
                        <RiskBadge nivel={nivel} />
                      </td>
                      <td className="table-td">
                        <ChevronRight size={14} className="text-gray-600" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
