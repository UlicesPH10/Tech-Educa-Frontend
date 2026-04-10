import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ClipboardList, Send, CheckCircle, XCircle, Users } from 'lucide-react'
import { getGrupos } from '../../api/grupos'
import { getEstudiantes } from '../../api/estudiantes'
import { getMaterias } from '../../api/materias'
import { registrarAsistencia } from '../../api/registros'

export default function Asistencia() {
  const [grupos, setGrupos] = useState([])
  const [materias, setMaterias] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [asistencias, setAsistencias] = useState({}) // { [estudianteId]: boolean }
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const { register, watch, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      grupo_id: '',
      materia_id: '',
      fecha: new Date().toISOString().split('T')[0],
    }
  })

  const grupoId = watch('grupo_id')

  useEffect(() => {
    Promise.all([getGrupos(), getMaterias()])
      .then(([g, m]) => { setGrupos(g ?? []); setMaterias(m ?? []) })
      .catch(() => toast.error('Error cargando datos'))
  }, [])

  useEffect(() => {
    if (!grupoId) { setEstudiantes([]); setAsistencias({}); return }
    setLoading(true)
    getEstudiantes({ grupo_id: grupoId, limit: 100 })
      .then((data) => {
        const est = data ?? []
        setEstudiantes(est)
        const init = {}
        est.forEach((e) => { init[e.id] = true })
        setAsistencias(init)
      })
      .catch(() => toast.error('Error cargando estudiantes'))
      .finally(() => setLoading(false))
  }, [grupoId])

  const toggleAsistencia = (id) =>
    setAsistencias((prev) => ({ ...prev, [id]: !prev[id] }))

  const onSubmit = async (formData) => {
    if (estudiantes.length === 0) return toast.error('No hay estudiantes en este grupo')
    setSubmitting(true)
    setProgress({ done: 0, total: estudiantes.length })
    let errores = 0
    for (let i = 0; i < estudiantes.length; i++) {
      const est = estudiantes[i]
      try {
        await registrarAsistencia({
          estudiante_id: est.id,
          materia_id: Number(formData.materia_id),
          fecha: formData.fecha,
          presente: asistencias[est.id] ?? true,
          justificada: false,
          observaciones: null,
        })
      } catch { errores++ }
      setProgress({ done: i + 1, total: estudiantes.length })
    }
    setSubmitting(false)
    if (errores === 0) {
      toast.success(`Pase de lista enviado (${estudiantes.length} registros)`)
    } else {
      toast.error(`${errores} errores al registrar asistencias`)
    }
  }

  const presentes = Object.values(asistencias).filter(Boolean).length
  const ausentes = estudiantes.length - presentes

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title">Pase de Lista</h1>
        <p className="text-gray-500 text-sm mt-1">Registra la asistencia por grupo y materia</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Configuración */}
        <div className="glass-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label-text">Grupo</label>
            <select
              className={`input-field ${errors.grupo_id ? 'border-red-500/60' : ''}`}
              id="select-grupo"
              {...register('grupo_id', { required: 'Requerido' })}
            >
              <option value="">Selecciona grupo</option>
              {grupos.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
            </select>
            {errors.grupo_id && <p className="text-xs text-red-400 mt-1">{errors.grupo_id.message}</p>}
          </div>
          <div>
            <label className="label-text">Materia</label>
            <select
              className={`input-field ${errors.materia_id ? 'border-red-500/60' : ''}`}
              id="select-materia"
              {...register('materia_id', { required: 'Requerido' })}
            >
              <option value="">Selecciona materia</option>
              {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
            {errors.materia_id && <p className="text-xs text-red-400 mt-1">{errors.materia_id.message}</p>}
          </div>
          <div>
            <label className="label-text">Fecha</label>
            <input
              type="date"
              className="input-field"
              id="input-fecha"
              {...register('fecha', { required: 'Requerido' })}
            />
          </div>
        </div>

        {/* Lista de estudiantes */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : estudiantes.length > 0 ? (
          <div className="glass-card overflow-hidden">
            {/* Summary bar */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle size={13} /> {presentes} presentes
              </div>
              <div className="flex items-center gap-1.5 text-xs text-red-400">
                <XCircle size={13} /> {ausentes} ausentes
              </div>
            </div>
            <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
              {estudiantes.map((est) => {
                const presente = asistencias[est.id] ?? true
                return (
                  <div
                    key={est.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${presente ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                        {est.nombre?.[0]}{est.apellido?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{est.nombre} {est.apellido}</p>
                        <p className="text-xs text-gray-600 font-mono">{est.matricula}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium ${presente ? 'text-green-400' : 'text-red-400'}`}>
                        {presente ? 'Presente' : 'Ausente'}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAsistencia(est.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${presente ? 'bg-green-500' : 'bg-gray-700'}`}
                        id={`toggle-est-${est.id}`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${presente ? 'translate-x-4' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : grupoId ? (
          <div className="glass-card p-8 text-center text-gray-500 text-sm">
            <Users size={24} className="mx-auto mb-2 text-gray-700" />
            No hay estudiantes en este grupo.
          </div>
        ) : null}

        {/* Progreso */}
        {submitting && (
          <div className="glass-card p-4">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>Enviando registros...</span>
              <span>{progress.done} / {progress.total}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        {estudiantes.length > 0 && (
          <button
            id="btn-enviar-asistencia"
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center py-3"
          >
            <Send size={15} />
            {submitting ? 'Enviando...' : `Enviar pase de lista (${estudiantes.length} estudiantes)`}
          </button>
        )}
      </form>
    </div>
  )
}
