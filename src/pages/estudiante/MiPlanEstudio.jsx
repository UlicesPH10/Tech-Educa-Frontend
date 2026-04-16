import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Brain,
  Sparkles,
  Target,
  RefreshCw,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Headphones,
  GraduationCap,
  Calendar,
  Clock,
  Loader2,
} from 'lucide-react'
import { getMiPlan, generarPlan, completarItem } from '../../api/planes'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIAS_ORDER = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

const TIPO_ICON = {
  video: Video,
  artículo: FileText,
  ejercicio: GraduationCap,
  libro: BookOpen,
  podcast: Headphones,
}

const DIA_COLOR = {
  Lunes: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', dot: 'bg-violet-500' },
  Martes: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-500' },
  Miércoles: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-500' },
  Jueves: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  Viernes: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' },
}

function agruparPorDia(items) {
  const grupos = {}
  DIAS_ORDER.forEach(dia => { grupos[dia] = [] })
  items.forEach(item => {
    const dia = item.dia_semana
    if (!grupos[dia]) grupos[dia] = []
    grupos[dia].push(item)
  })
  return grupos
}

function getTipoIcon(tipo) {
  const Icon = TIPO_ICON[tipo?.toLowerCase()] ?? BookOpen
  return Icon
}

function getProgresoSemana(items) {
  if (!items?.length) return 0
  const completados = items.filter(i => i.completado).length
  return Math.round((completados / items.length) * 100)
}

// ─── Componente de ítem individual ───────────────────────────────────────────

function ItemCard({ item, onToggle, toggling }) {
  const TipoIcon = getTipoIcon(item.recurso_tipo)
  const colores = DIA_COLOR[item.dia_semana] ?? DIA_COLOR.Lunes

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all duration-200 group ${
        item.completado
          ? 'bg-white/5 border-white/10 opacity-70'
          : `${colores.bg} ${colores.border}`
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle completado */}
        <button
          onClick={() => onToggle(item.id)}
          disabled={toggling === item.id}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
          title={item.completado ? 'Marcar como pendiente' : 'Marcar como completado'}
        >
          {toggling === item.id ? (
            <Loader2 size={20} className="animate-spin text-gray-400" />
          ) : item.completado ? (
            <CheckCircle2 size={20} className="text-emerald-400" />
          ) : (
            <Circle size={20} className="text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Materia + duración */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colores.bg} ${colores.text} border ${colores.border}`}>
              {item.materia}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-500">
              <Clock size={10} /> {item.duracion_min} min
            </span>
          </div>

          {/* Tema */}
          <p className={`text-sm font-semibold mb-1 ${item.completado ? 'line-through text-gray-500' : 'text-white'}`}>
            {item.tema}
          </p>

          {/* Actividad */}
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            {item.actividad}
          </p>

          {/* Recurso */}
          {item.recurso_titulo && (
            <div className="flex items-center gap-1.5 mt-1">
              <TipoIcon size={12} className="text-gray-500 flex-shrink-0" />
              {item.recurso_url ? (
                <a
                  href={item.recurso_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1E69A0] hover:text-blue-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
                >
                  {item.recurso_titulo}
                  <ExternalLink size={10} />
                </a>
              ) : (
                <span className="text-xs text-gray-500">{item.recurso_titulo}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Componente columna de día ────────────────────────────────────────────────

function DiaColumn({ dia, items, onToggle, toggling }) {
  const colores = DIA_COLOR[dia] ?? DIA_COLOR.Lunes
  if (!items?.length) return null

  const completados = items.filter(i => i.completado).length

  return (
    <div className="flex flex-col gap-2 min-w-[220px]">
      {/* Header del día */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${colores.bg} ${colores.border}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colores.dot}`} />
          <span className={`text-sm font-bold ${colores.text}`}>{dia}</span>
        </div>
        <span className="text-xs text-gray-500">
          {completados}/{items.length}
        </span>
      </div>
      {/* Ítems del día */}
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onToggle={onToggle}
            toggling={toggling}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function MiPlanEstudio() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(false)
  const [toggling, setToggling] = useState(null)

  const cargarPlan = async () => {
    setLoading(true)
    try {
      const data = await getMiPlan()
      setPlan(data)
    } catch {
      toast.error('Error cargando tu plan de estudio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPlan()
  }, [])

  const handleGenerar = async () => {
    setGenerando(true)
    const toastId = toast.loading('🧠 Agente Mentor generando tu plan con IA...')
    try {
      const nuevoPlan = await generarPlan()
      setPlan(nuevoPlan)
      toast.success('¡Plan de estudio generado con éxito!', { id: toastId })
    } catch (err) {
      const msg = err?.response?.data?.detail ?? 'Error al generar el plan'
      toast.error(msg, { id: toastId })
    } finally {
      setGenerando(false)
    }
  }

  const handleToggle = async (itemId) => {
    setToggling(itemId)
    try {
      const itemActualizado = await completarItem(itemId)
      setPlan(prev => ({
        ...prev,
        items: prev.items.map(it => it.id === itemId ? itemActualizado : it),
      }))
    } catch {
      toast.error('Error al actualizar el ítem')
    } finally {
      setToggling(null)
    }
  }

  const progreso = plan ? getProgresoSemana(plan.items) : 0
  const grupos = plan ? agruparPorDia(plan.items) : {}
  const diasConItems = DIAS_ORDER.filter(d => grupos[d]?.length > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1E69A0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Brain size={24} className="text-violet-400" />
            Mi Plan de Estudio
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Plan semanal personalizado generado por el Agente Mentor con IA
          </p>
        </div>
        <button
          id="btn-generar-plan"
          onClick={handleGenerar}
          disabled={generando}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
        >
          {generando ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {generando ? 'Generando con IA...' : plan ? 'Regenerar Plan' : 'Generar mi Plan'}
        </button>
      </div>

      {/* ── Sin plan ────────────────────────────────────────────────────────── */}
      {!plan && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Brain size={32} className="text-violet-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">No tienes un plan esta semana</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            El Agente Mentor analizará tus materias en riesgo académico y creará un plan de
            estudio personalizado con recursos gratuitos en español.
          </p>
          <button
            onClick={handleGenerar}
            disabled={generando}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all disabled:opacity-60 shadow-lg shadow-violet-500/20"
          >
            {generando ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generando ? 'Generando...' : 'Generar mi Plan con IA'}
          </button>
        </div>
      )}

      {/* ── Plan activo ────────────────────────────────────────────────────── */}
      {plan && (
        <>
          {/* Mensaje motivacional + objetivo */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-violet-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mensaje de tu Mentor</span>
                </div>
                <p className="text-white font-medium leading-relaxed text-sm italic">
                  "{plan.mensaje_motivacional}"
                </p>
              </div>
              <div className="flex-1 border-l border-white/10 pl-6">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Objetivo de la Semana</span>
                </div>
                <p className="text-white font-medium leading-relaxed text-sm">
                  {plan.objetivo_semana}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-300">
                  Semana {plan.semana} · {plan.anio}
                </span>
              </div>
              <span className="text-sm font-bold text-white">
                {plan.items.filter(i => i.completado).length}/{plan.items.length} completadas
                <span className="ml-2 text-emerald-400">{progreso}%</span>
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

          {/* Grid de días */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {diasConItems.map(dia => (
                <DiaColumn
                  key={dia}
                  dia={dia}
                  items={grupos[dia]}
                  onToggle={handleToggle}
                  toggling={toggling}
                />
              ))}
            </div>
          </div>

          {/* Metadata */}
          <p className="text-xs text-gray-600 text-right">
            Generado por Agente Mentor · {new Date(plan.generado_en).toLocaleString('es-MX', {
              dateStyle: 'medium', timeStyle: 'short'
            })}
          </p>
        </>
      )}
    </div>
  )
}
