import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Bell, CheckCircle, AlertTriangle, Filter } from 'lucide-react'
import RiskBadge from '../../components/ui/RiskBadge'
import Modal from '../../components/ui/Modal'
import { getAlertas, atenderAlerta } from '../../api/alertas'
import { formatDateTime, truncate } from '../../utils/formatters'
import { getRiskConfig } from '../../utils/riskColors'

const NIVELES = ['', 'critico', 'alto', 'medio', 'bajo']

function AlertaCard({ alerta, onAtender }) {
  const [expanded, setExpanded] = useState(false)
  const config = getRiskConfig(alerta.nivel_riesgo)

  return (
    <div
      className={`glass-card p-4 space-y-2 animate-fade-in border-l-2`}
      style={{ borderLeftColor: config.color }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <RiskBadge nivel={alerta.nivel_riesgo} />
          {alerta.atendida && (
            <span className="badge bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
              <CheckCircle size={10} /> Atendida
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 flex-shrink-0">{formatDateTime(alerta.creado_en)}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-0.5">Estudiante ID: <span className="text-gray-400">{alerta.estudiante_id}</span> · Score: <span className={`font-semibold ${config.text}`}>{alerta.score_disparador}</span></p>
        <p className="text-sm text-gray-300">
          {expanded ? alerta.mensaje_ia : truncate(alerta.mensaje_ia, 150)}
          {alerta.mensaje_ia?.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-violet-400 hover:text-violet-300 text-xs"
            >
              {expanded ? 'Menos' : 'Más'}
            </button>
          )}
        </p>
      </div>

      {alerta.canal_envio && (
        <p className="text-xs text-gray-600">Canal: <span className="capitalize text-gray-500">{alerta.canal_envio}</span></p>
      )}

      {alerta.notas_atencion && (
        <div className="text-xs bg-green-500/5 border border-green-500/15 rounded-lg p-2 text-gray-400">
          <p className="text-green-400 font-medium mb-0.5">Notas de atención:</p>
          {alerta.notas_atencion}
        </div>
      )}

      {!alerta.atendida && (
        <button
          onClick={() => onAtender(alerta)}
          className="btn-primary text-xs py-1.5"
        >
          <CheckCircle size={13} /> Atender
        </button>
      )}
    </div>
  )
}

export default function Alertas() {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroAtendida, setFiltroAtendida] = useState('')
  const [filtroNivel, setFiltroNivel] = useState('')
  const [atendiendo, setAtendiendo] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchAlertas = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filtroAtendida !== '') params.atendida = filtroAtendida === 'true'
      if (filtroNivel) params.nivel_riesgo = filtroNivel
      params.limit = 100
      const data = await getAlertas(params)
      setAlertas(data ?? [])
    } catch { toast.error('Error cargando alertas') }
    finally { setLoading(false) }
  }, [filtroAtendida, filtroNivel])

  useEffect(() => { fetchAlertas() }, [fetchAlertas])

  const handleAtender = async (data) => {
    setSaving(true)
    try {
      await atenderAlerta(atendiendo.id, { notas_atencion: data.notas })
      toast.success('Alerta atendida')
      setAtendiendo(null)
      reset()
      fetchAlertas()
    } catch { toast.error('Error al atender alerta') }
    finally { setSaving(false) }
  }

  const pendientes = alertas.filter((a) => !a.atendida).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Alertas</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pendientes > 0 ? (
            <span className="text-red-400 font-medium">{pendientes} pendientes sin atender</span>
          ) : (
            'Sin alertas pendientes'
          )}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 text-gray-500">
          <Filter size={14} />
          <span className="text-xs font-medium uppercase tracking-wider">Filtros:</span>
        </div>
        <select
          value={filtroAtendida}
          onChange={(e) => setFiltroAtendida(e.target.value)}
          className="input-field sm:w-44"
          id="filter-atendida"
        >
          <option value="">Todas las alertas</option>
          <option value="false">Pendientes</option>
          <option value="true">Atendidas</option>
        </select>
        <select
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value)}
          className="input-field sm:w-44"
          id="filter-nivel"
        >
          <option value="">Todos los niveles</option>
          {NIVELES.filter(Boolean).map((n) => (
            <option key={n} value={n} className="capitalize">{n.charAt(0).toUpperCase() + n.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : alertas.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bell size={28} className="mx-auto mb-2 text-gray-700" />
          <p className="text-gray-500 text-sm">No hay alertas con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((alerta) => (
            <AlertaCard key={alerta.id} alerta={alerta} onAtender={setAtendiendo} />
          ))}
        </div>
      )}

      {/* Modal atender */}
      <Modal
        isOpen={!!atendiendo}
        onClose={() => { setAtendiendo(null); reset() }}
        title="Atender Alerta"
        size="md"
      >
        {atendiendo && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
              <RiskBadge nivel={atendiendo.nivel_riesgo} />
              <p className="text-sm text-gray-400 mt-2">{atendiendo.mensaje_ia}</p>
            </div>
            <form onSubmit={handleSubmit(handleAtender)} className="space-y-4">
              <div>
                <label className="label-text">Notas de atención</label>
                <textarea
                  className={`input-field resize-none h-28 ${errors.notas ? 'border-red-500/60' : ''}`}
                  placeholder="Describe las acciones tomadas..."
                  {...register('notas', { required: 'Las notas son requeridas' })}
                />
                {errors.notas && <p className="text-xs text-red-400 mt-1">{errors.notas.message}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setAtendiendo(null); reset() }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  <CheckCircle size={14} />
                  {saving ? 'Guardando...' : 'Marcar como atendida'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
