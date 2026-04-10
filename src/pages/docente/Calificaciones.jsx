import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PenLine, CheckCircle } from 'lucide-react'
import { getEstudiantes } from '../../api/estudiantes'
import { getMaterias } from '../../api/materias'
import { registrarCalificacion } from '../../api/registros'
import { formatTipoCalificacion } from '../../utils/formatters'

const TIPOS = ['parcial', 'examen', 'tarea', 'proyecto']

export default function Calificaciones() {
  const [estudiantes, setEstudiantes] = useState([])
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      estudiante_id: '',
      materia_id: '',
      periodo: 1,
      calificacion: '',
      tipo: 'parcial',
      fecha: new Date().toISOString().split('T')[0],
      observaciones: '',
    },
  })

  useEffect(() => {
    Promise.all([getEstudiantes({ limit: 100 }), getMaterias()])
      .then(([e, m]) => { setEstudiantes(e ?? []); setMaterias(m ?? []) })
      .catch(() => toast.error('Error cargando datos'))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setSuccess(false)
    try {
      await registrarCalificacion({
        estudiante_id: Number(data.estudiante_id),
        materia_id: Number(data.materia_id),
        periodo: Number(data.periodo),
        calificacion: Number(data.calificacion),
        tipo: data.tipo,
        fecha: data.fecha,
        observaciones: data.observaciones || null,
      })
      toast.success('Calificación registrada')
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      toast.error(err.response?.data?.detail ?? 'Error al registrar calificación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="page-title">Captura de Calificaciones</h1>
        <p className="text-gray-500 text-sm mt-1">Registra calificaciones por estudiante y materia</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} id="form-calificacion" className="space-y-4">
          {/* Estudiante */}
          <div>
            <label className="label-text">Estudiante</label>
            <select
              className={`input-field ${errors.estudiante_id ? 'border-red-500/60' : ''}`}
              id="select-estudiante"
              {...register('estudiante_id', { required: 'Requerido' })}
            >
              <option value="">Selecciona estudiante</option>
              {estudiantes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} {e.apellido} — {e.matricula}
                </option>
              ))}
            </select>
            {errors.estudiante_id && <p className="text-xs text-red-400 mt-1">{errors.estudiante_id.message}</p>}
          </div>

          {/* Materia */}
          <div>
            <label className="label-text">Materia</label>
            <select
              className={`input-field ${errors.materia_id ? 'border-red-500/60' : ''}`}
              id="select-materia-cal"
              {...register('materia_id', { required: 'Requerido' })}
            >
              <option value="">Selecciona materia</option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre} ({m.clave})</option>
              ))}
            </select>
            {errors.materia_id && <p className="text-xs text-red-400 mt-1">{errors.materia_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div>
              <label className="label-text">Tipo</label>
              <select className="input-field" id="select-tipo" {...register('tipo')}>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>{formatTipoCalificacion(t)}</option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div>
              <label className="label-text">Período</label>
              <input
                type="number"
                min={1}
                max={6}
                className="input-field"
                id="input-periodo"
                {...register('periodo', { valueAsNumber: true, min: 1 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Calificación */}
            <div>
              <label className="label-text">Calificación (0–10)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                className={`input-field ${errors.calificacion ? 'border-red-500/60' : ''}`}
                id="input-calificacion"
                placeholder="8.5"
                {...register('calificacion', {
                  required: 'Requerido',
                  min: { value: 0, message: 'Mínimo 0' },
                  max: { value: 10, message: 'Máximo 10' },
                  valueAsNumber: true,
                })}
              />
              {errors.calificacion && <p className="text-xs text-red-400 mt-1">{errors.calificacion.message}</p>}
            </div>

            {/* Fecha */}
            <div>
              <label className="label-text">Fecha</label>
              <input
                type="date"
                className="input-field"
                id="input-fecha-cal"
                {...register('fecha')}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="label-text">Observaciones (opcional)</label>
            <input
              className="input-field"
              placeholder="Nota adicional..."
              id="input-observaciones"
              {...register('observaciones')}
            />
          </div>

          <button
            type="submit"
            id="btn-registrar-calificacion"
            disabled={loading}
            className={`btn-primary w-full justify-center py-2.5 mt-2 ${success ? 'from-green-600 to-green-500' : ''}`}
          >
            {success ? (
              <><CheckCircle size={15} /> Calificación registrada</>
            ) : loading ? (
              'Guardando...'
            ) : (
              <><PenLine size={15} /> Registrar calificación</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
