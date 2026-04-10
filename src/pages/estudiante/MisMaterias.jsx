import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BookOpen, ChevronDown, ChevronRight, Star } from 'lucide-react'
import { getMisMaterias } from '../../api/estudiantes'

function MateriaCard({ materia }) {
  const [expanded, setExpanded] = useState(false)
  const modulos = materia.modulos?.slice().sort((a, b) => a.orden - b.orden) ?? []

  return (
    <div className={`glass-card overflow-hidden animate-fade-in transition-all duration-200`}>
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
            </div>
          </div>
        </div>

        {/* Score and Expand Icon */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Promedio</span>
            <span className="badge bg-[#F58723] text-white px-2.5 py-1 text-sm shadow-sm">{materia.promedio !== undefined && materia.promedio !== null ? parseFloat(materia.promedio).toFixed(1) : '--'}</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 group-hover:text-[#1E69A0] transition-colors">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </div>
      </button>

      {/* Módulos expandidos */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50">
          {modulos.length === 0 ? (
            <p className="text-sm font-medium text-gray-500 py-3 text-center">Esta materia no tiene módulos registrados.</p>
          ) : (
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed bg-gray-50 p-2 rounded-md">{mod.descripcion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MisMaterias() {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMisMaterias()
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Mis Materias</h1>
        <p className="text-gray-500 text-sm mt-1">
          {materias.length} materias con {materias.reduce((s, m) => s + (m.modulos?.length ?? 0), 0)} módulos en total
        </p>
      </div>

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
              {mats.map((m) => <MateriaCard key={m.materia_id ?? m.id} materia={m} />)}
            </div>
          )
        })
      ) : (
        <div className="space-y-3">
          {materias.map((m) => <MateriaCard key={m.materia_id ?? m.id} materia={m} />)}
        </div>
      )}
    </div>
  )
}
