import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Star,
  ClipboardList,
  UserCheck,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { getMiResumenAcademico } from '../../api/estudiantes'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TIPO_LABEL = {
  parcial: 'Parcial',
  examen: 'Examen',
  tarea: 'Tarea',
  proyecto: 'Proyecto',
}

function scoreColor(val) {
  if (val === null || val === undefined) return 'bg-gray-100 text-gray-500'
  if (val >= 9) return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  if (val >= 7) return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (val >= 6) return 'bg-amber-100 text-amber-700 border border-amber-200'
  return 'bg-red-100 text-red-700 border border-red-200'
}

function promedioColor(val) {
  if (val === null || val === undefined) return 'bg-gray-200 text-gray-500'
  if (val >= 9) return 'bg-emerald-500 text-white'
  if (val >= 7) return 'bg-[#1E69A0] text-white'
  if (val >= 6) return 'bg-amber-500 text-white'
  return 'bg-red-500 text-white'
}

function asisBarColor(pct) {
  if (pct >= 90) return 'bg-emerald-500'
  if (pct >= 75) return 'bg-amber-500'
  return 'bg-red-500'
}

// ─── Sección: Calificaciones ──────────────────────────────────────────────────

function CalificacionesSection({ calificaciones }) {
  if (!calificaciones || calificaciones.length === 0) {
    return (
      <div className="flex items-center gap-2 py-2 text-xs text-gray-400 italic">
        <ClipboardList size={13} />
        Sin calificaciones registradas aún.
      </div>
    )
  }

  // Agrupar por periodo
  const grupos = {}
  calificaciones.forEach((c) => {
    if (!grupos[c.periodo]) grupos[c.periodo] = []
    grupos[c.periodo].push(c)
  })

  return (
    <div className="space-y-3">
      {Object.entries(grupos)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([periodo, cals]) => {
          const promPeriodo =
            cals.reduce((s, c) => s + c.calificacion, 0) / cals.length
          return (
            <div key={periodo}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Parcial {periodo}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${scoreColor(promPeriodo)}`}>
                  Prom. {promPeriodo.toFixed(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cals.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-gray-600 truncate">
                        {TIPO_LABEL[c.tipo] ?? c.tipo}
                      </p>
                      <p className="text-[10px] text-gray-400">{c.fecha}</p>
                    </div>
                    <span
                      className={`text-sm font-extrabold px-2 py-0.5 rounded-lg flex-shrink-0 ${scoreColor(c.calificacion)}`}
                    >
                      {c.calificacion.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
    </div>
  )
}

// ─── Sección: Asistencia ──────────────────────────────────────────────────────

function AsistenciaSection({ asistencia }) {
  if (!asistencia) {
    return (
      <div className="flex items-center gap-2 py-2 text-xs text-gray-400 italic">
        <UserCheck size={13} />
        Sin registros de asistencia.
      </div>
    )
  }

  const { total_clases, presentes, ausentes, justificadas, porcentaje_asistencia } = asistencia
  const pct = porcentaje_asistencia

  return (
    <div className="space-y-2">
      {/* Barra de progreso */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-0.5">
        <span>Asistencia</span>
        <span className={pct >= 90 ? 'text-emerald-600' : pct >= 75 ? 'text-amber-600' : 'text-red-600'}>
          {pct}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${asisBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Stats chips */}
      <div className="flex gap-2 pt-1 flex-wrap">
        <span className="flex items-center gap-1 text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          Total: {total_clases}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
          ✓ {presentes} presentes
        </span>
        {ausentes > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            ✗ {ausentes} ausentes
          </span>
        )}
        {justificadas > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            ~ {justificadas} justificadas
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Tarjeta de Materia ───────────────────────────────────────────────────────

function MateriaCard({ materia }) {
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState('calificaciones') // 'calificaciones' | 'asistencia' | 'modulos'
  const modulos = materia.modulos?.slice().sort((a, b) => a.orden - b.orden) ?? []

  return (
    <div className="glass-card overflow-hidden animate-fade-in transition-all duration-200">
      {/* Header clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 p-5 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#1E69A0]/10 border border-[#1E69A0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <BookOpen size={18} className="text-[#1E69A0]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#0F3C73]">{materia.nombre}</h3>
              <span className="badge bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-mono px-2">
                {materia.clave}
              </span>
            </div>
            {materia.descripcion && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{materia.descripcion}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-500">
              <span className="bg-gray-100 px-2 py-0.5 rounded-md">{modulos.length} módulos</span>
              {materia.semestre && <span>Semestre {materia.semestre}</span>}
              {materia.calificaciones?.length > 0 && (
                <span className="flex items-center gap-1">
                  <ClipboardList size={11} />
                  {materia.calificaciones.length} eval.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Promedio + asistencia + expand */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Promedio global */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1">
              <TrendingUp size={10} /> Promedio
            </span>
            <span
              className={`badge px-2.5 py-1 text-sm shadow-sm ${promedioColor(materia.promedio)}`}
            >
              {materia.promedio !== null && materia.promedio !== undefined
                ? materia.promedio.toFixed(1)
                : '--'}
            </span>
          </div>
          {/* % Asistencia */}
          {materia.asistencia && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1">
                <UserCheck size={10} /> Asistencia
              </span>
              <span
                className={`badge px-2.5 py-1 text-sm shadow-sm ${asisBarColor(materia.asistencia.porcentaje_asistencia) === 'bg-emerald-500' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : materia.asistencia.porcentaje_asistencia >= 75 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
              >
                {materia.asistencia.porcentaje_asistencia}%
              </span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 transition-colors">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </div>
      </button>

      {/* Detalle expandido */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/40">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-5 pt-3 gap-1">
            {[
              { id: 'calificaciones', label: 'Calificaciones', icon: ClipboardList },
              { id: 'asistencia', label: 'Asistencia', icon: UserCheck },
              { id: 'modulos', label: 'Módulos', icon: BookOpen },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-colors ${
                  tab === id
                    ? 'bg-white border border-gray-200 border-b-white text-[#0F3C73] -mb-px'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div className="px-5 py-4">
            {tab === 'calificaciones' && (
              <CalificacionesSection calificaciones={materia.calificaciones} />
            )}
            {tab === 'asistencia' && (
              <AsistenciaSection asistencia={materia.asistencia} />
            )}
            {tab === 'modulos' && (
              <div>
                {modulos.length === 0 ? (
                  <p className="text-sm font-medium text-gray-500 py-3 text-center">
                    Esta materia no tiene módulos registrados.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {modulos.map((mod) => (
                      <div
                        key={mod.id}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1E875F]/10 flex items-center justify-center text-xs font-extrabold text-[#1E875F] mt-0.5">
                          {mod.orden}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#0F3C73] leading-tight">{mod.nombre}</p>
                          {mod.descripcion && (
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed bg-gray-50 p-2 rounded-md">
                              {mod.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function MisMaterias() {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMiResumenAcademico()
      .then(setMaterias)
      .catch(() => toast.error('Error cargando tus materias'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1E69A0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const semestres = [...new Set(materias.map((m) => m.semestre).filter(Boolean))].sort()

  // Stats globales
  const totalCals = materias.reduce((s, m) => s + (m.calificaciones?.length ?? 0), 0)
  const promedioGlobal =
    materias.filter((m) => m.promedio !== null).length > 0
      ? (
          materias.filter((m) => m.promedio !== null).reduce((s, m) => s + m.promedio, 0) /
          materias.filter((m) => m.promedio !== null).length
        ).toFixed(1)
      : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Mis Materias</h1>
          <p className="text-gray-500 text-sm mt-1">
            {materias.length} materias · {materias.reduce((s, m) => s + (m.modulos?.length ?? 0), 0)} módulos ·{' '}
            {totalCals} evaluaciones registradas
          </p>
        </div>
        {promedioGlobal && (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <TrendingUp size={16} className="text-[#1E69A0]" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                Promedio General
              </p>
              <p className={`text-xl font-extrabold leading-tight ${Number(promedioGlobal) >= 7 ? 'text-[#0F3C73]' : 'text-red-600'}`}>
                {promedioGlobal}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Alerta si hay materias reprobadas */}
      {materias.some((m) => m.promedio !== null && m.promedio < 6) && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
          <span>
            Tienes{' '}
            <strong>{materias.filter((m) => m.promedio !== null && m.promedio < 6).length}</strong>{' '}
            materia(s) con promedio reprobatorio. Consulta tu plan de estudio personalizado.
          </span>
        </div>
      )}

      {/* Lista de materias */}
      {materias.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <BookOpen size={28} className="mx-auto mb-2 text-gray-700" />
          <p className="text-gray-500 text-sm">No tienes materias asignadas.</p>
        </div>
      ) : semestres.length > 0 ? (
        semestres.map((sem) => {
          const mats = materias.filter((m) => m.semestre === sem)
          return (
            <div key={sem} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-[#F58723]" />
                  <h2 className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Semestre {sem}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              {mats.map((m) => (
                <MateriaCard key={m.materia_id ?? m.id} materia={m} />
              ))}
            </div>
          )
        })
      ) : (
        <div className="space-y-3">
          {materias.map((m) => (
            <MateriaCard key={m.materia_id ?? m.id} materia={m} />
          ))}
        </div>
      )}
    </div>
  )
}
