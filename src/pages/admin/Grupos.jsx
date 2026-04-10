import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Users, Layers } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { getGrupos, createGrupo } from '../../api/grupos'

function GrupoCard({ grupo }) {
  return (
    <div className="glass-card-hover p-5 space-y-3 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
          <Layers size={18} className="text-indigo-400" />
        </div>
        <span className="badge bg-white/5 border border-white/10 text-gray-400 text-[10px]">
          {grupo.ciclo_escolar}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{grupo.nombre}</h3>
        <p className="text-xs text-gray-500 mt-0.5">Grado: {grupo.grado}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Users size={12} className="text-gray-600" />
        <span>{grupo.total_estudiantes ?? 0} estudiantes</span>
      </div>
    </div>
  )
}

function GrupoForm({ onSubmit, loading, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label-text">Nombre del grupo</label>
        <input
          className={`input-field ${errors.nombre ? 'border-red-500/60' : ''}`}
          placeholder="3°A Matutino"
          {...register('nombre', { required: 'Requerido' })}
        />
        {errors.nombre && <p className="text-xs text-red-400 mt-1">{errors.nombre.message}</p>}
      </div>
      <div>
        <label className="label-text">Grado</label>
        <input
          className={`input-field ${errors.grado ? 'border-red-500/60' : ''}`}
          placeholder="3°A"
          {...register('grado', { required: 'Requerido' })}
        />
        {errors.grado && <p className="text-xs text-red-400 mt-1">{errors.grado.message}</p>}
      </div>
      <div>
        <label className="label-text">Ciclo escolar</label>
        <input
          className={`input-field ${errors.ciclo_escolar ? 'border-red-500/60' : ''}`}
          placeholder="2025-2026"
          {...register('ciclo_escolar', { required: 'Requerido' })}
        />
        {errors.ciclo_escolar && <p className="text-xs text-red-400 mt-1">{errors.ciclo_escolar.message}</p>}
      </div>
      <div>
        <label className="label-text">ID del Docente (opcional)</label>
        <input
          type="number"
          className="input-field"
          placeholder="2"
          {...register('docente_id', { valueAsNumber: true })}
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Crear grupo'}
        </button>
      </div>
    </form>
  )
}

export default function Grupos() {
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchGrupos = useCallback(async () => {
    try {
      const data = await getGrupos()
      setGrupos(data ?? [])
    } catch { toast.error('Error cargando grupos') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchGrupos() }, [fetchGrupos])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await createGrupo({ ...data, docente_id: data.docente_id || null })
      toast.success('Grupo creado')
      setModalOpen(false)
      fetchGrupos()
    } catch { toast.error('Error al crear grupo') }
    finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Grupos</h1>
          <p className="text-gray-500 text-sm mt-1">{grupos.length} grupos registrados</p>
        </div>
        <button id="btn-nuevo-grupo" onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} /> Nuevo grupo
        </button>
      </div>

      {grupos.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-500 text-sm">
          <Layers size={28} className="mx-auto mb-2 text-gray-700" />
          No hay grupos registrados. Crea el primero.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {grupos.map((g) => <GrupoCard key={g.id} grupo={g} />)}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Grupo">
        <GrupoForm onSubmit={handleCreate} loading={saving} onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
