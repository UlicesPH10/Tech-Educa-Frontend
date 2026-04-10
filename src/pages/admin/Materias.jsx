import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, ChevronRight, ChevronDown,
  BookOpen, GripVertical, X, Check
} from 'lucide-react'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  getMaterias, getMateria, createMateria, updateMateria, deleteMateria,
  createModulo, updateModulo, deleteModulo
} from '../../api/materias'

function MateriaForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label-text">Nombre de la materia</label>
        <input
          className={`input-field ${errors.nombre ? 'border-red-500/60' : ''}`}
          placeholder="Matemáticas"
          {...register('nombre', { required: 'Requerido' })}
        />
        {errors.nombre && <p className="text-xs text-red-400 mt-1">{errors.nombre.message}</p>}
      </div>
      <div>
        <label className="label-text">Clave</label>
        <input
          className={`input-field ${errors.clave ? 'border-red-500/60' : ''}`}
          placeholder="MAT-01"
          {...register('clave', { required: 'Requerido' })}
        />
        {errors.clave && <p className="text-xs text-red-400 mt-1">{errors.clave.message}</p>}
      </div>
      <div>
        <label className="label-text">Descripción</label>
        <textarea
          className="input-field resize-none h-20"
          placeholder="Descripción de la materia..."
          {...register('descripcion')}
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

function ModuloForm({ onSubmit, onCancel, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues ?? { nombre: '', descripcion: '', orden: 1 }
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/10 mt-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-text">Nombre del módulo</label>
          <input
            className={`input-field ${errors.nombre ? 'border-red-500/60' : ''}`}
            placeholder="Álgebra Lineal"
            {...register('nombre', { required: 'Requerido' })}
          />
          {errors.nombre && <p className="text-xs text-red-400 mt-0.5">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="label-text">Orden</label>
          <input
            type="number"
            min={1}
            className="input-field"
            {...register('orden', { valueAsNumber: true })}
          />
        </div>
      </div>
      <div>
        <label className="label-text">Descripción</label>
        <input
          className="input-field"
          placeholder="Breve descripción..."
          {...register('descripcion')}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary py-1 px-3 text-xs">
          <X size={12} /> Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary py-1 px-3 text-xs">
          <Check size={12} /> {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

function MateriaRow({ materia, onEdit, onDelete, onRefresh }) {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail] = useState(null)
  const [addingMod, setAddingMod] = useState(false)
  const [editingModId, setEditingModId] = useState(null)
  const [deletingModId, setDeletingModId] = useState(null)
  const [modLoading, setModLoading] = useState(false)

  const loadDetail = useCallback(async () => {
    try {
      const d = await getMateria(materia.id)
      setDetail(d)
    } catch {
      toast.error('Error cargando módulos')
    }
  }, [materia.id])

  const handleExpand = async () => {
    setExpanded((v) => !v)
    if (!expanded) await loadDetail()
  }

  const handleAddModulo = async (data) => {
    setModLoading(true)
    try {
      await createModulo(materia.id, data)
      toast.success('Módulo agregado')
      setAddingMod(false)
      await loadDetail()
      onRefresh()
    } catch { toast.error('Error al agregar módulo') }
    finally { setModLoading(false) }
  }

  const handleUpdateModulo = async (modId, data) => {
    setModLoading(true)
    try {
      await updateModulo(materia.id, modId, data)
      toast.success('Módulo actualizado')
      setEditingModId(null)
      await loadDetail()
    } catch { toast.error('Error al actualizar módulo') }
    finally { setModLoading(false) }
  }

  const handleDeleteModulo = async (modId) => {
    setModLoading(true)
    try {
      await deleteModulo(materia.id, modId)
      toast.success('Módulo eliminado')
      setDeletingModId(null)
      await loadDetail()
      onRefresh()
    } catch { toast.error('Error al eliminar módulo') }
    finally { setModLoading(false) }
  }

  const sortedModulos = detail?.modulos?.slice().sort((a, b) => a.orden - b.orden) ?? []

  return (
    <div className="glass-card animate-fade-in">
      {/* Cabecera de la materia */}
      <button
        onClick={handleExpand}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors rounded-xl text-left"
      >
        {expanded ? <ChevronDown size={16} className="text-violet-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{materia.nombre}</p>
          <p className="text-xs text-gray-500">{materia.clave} · {materia.total_modulos ?? 0} módulos</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(materia) }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(materia) }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </button>

      {/* Módulos expandidos */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          {sortedModulos.length === 0 && !addingMod && (
            <p className="text-xs text-gray-600 py-2">Sin módulos aún.</p>
          )}
          <div className="space-y-2">
            {sortedModulos.map((mod) => (
              <div key={mod.id}>
                {editingModId === mod.id ? (
                  <ModuloForm
                    defaultValues={mod}
                    onSubmit={(data) => handleUpdateModulo(mod.id, data)}
                    onCancel={() => setEditingModId(null)}
                    loading={modLoading}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] group">
                    <GripVertical size={12} className="text-gray-700 flex-shrink-0" />
                    <span className="text-xs font-mono text-gray-500 w-5 flex-shrink-0">{mod.orden}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-300">{mod.nombre}</p>
                      {mod.descripcion && <p className="text-xs text-gray-600 truncate">{mod.descripcion}</p>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingModId(mod.id)} className="p-1 text-gray-500 hover:text-white"><Pencil size={11} /></button>
                      <button onClick={() => setDeletingModId(mod.id)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 size={11} /></button>
                    </div>
                  </div>
                )}
                <ConfirmDialog
                  isOpen={deletingModId === mod.id}
                  onClose={() => setDeletingModId(null)}
                  onConfirm={() => handleDeleteModulo(mod.id)}
                  title="Eliminar módulo"
                  message={`¿Eliminar el módulo "${mod.nombre}"?`}
                  loading={modLoading}
                />
              </div>
            ))}
          </div>

          {addingMod ? (
            <ModuloForm
              onSubmit={handleAddModulo}
              onCancel={() => setAddingMod(false)}
              loading={modLoading}
              defaultValues={{ nombre: '', descripcion: '', orden: sortedModulos.length + 1 }}
            />
          ) : (
            <button
              onClick={() => setAddingMod(true)}
              className="mt-3 flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Plus size={13} /> Agregar módulo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Materias() {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchMaterias = useCallback(async () => {
    try {
      const data = await getMaterias()
      setMaterias(data ?? [])
    } catch { toast.error('Error cargando materias') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchMaterias() }, [fetchMaterias])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await createMateria(data)
      toast.success('Materia creada')
      setModalOpen(false)
      fetchMaterias()
    } catch { toast.error('Error al crear materia') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (data) => {
    setSaving(true)
    try {
      await updateMateria(editing.id, data)
      toast.success('Materia actualizada')
      setEditing(null)
      fetchMaterias()
    } catch { toast.error('Error al actualizar') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await deleteMateria(deleting.id)
      toast.success('Materia eliminada')
      setDeleting(null)
      fetchMaterias()
    } catch { toast.error('Error al eliminar') }
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
          <h1 className="page-title">Materias</h1>
          <p className="text-gray-500 text-sm mt-1">{materias.length} materias registradas</p>
        </div>
        <button id="btn-nueva-materia" onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} /> Nueva materia
        </button>
      </div>

      {/* Lista de materias */}
      {materias.length === 0 ? (
        <div className="glass-card p-10 text-center text-gray-500 text-sm">
          <BookOpen size={28} className="mx-auto mb-2 text-gray-700" />
          No hay materias registradas. Crea la primera.
        </div>
      ) : (
        <div className="space-y-3">
          {materias.map((m) => (
            <MateriaRow
              key={m.id}
              materia={m}
              onEdit={setEditing}
              onDelete={setDeleting}
              onRefresh={fetchMaterias}
            />
          ))}
        </div>
      )}

      {/* Modal crear */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Materia">
        <MateriaForm onSubmit={handleCreate} loading={saving} />
      </Modal>

      {/* Modal editar */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Editar Materia">
        {editing && (
          <MateriaForm defaultValues={editing} onSubmit={handleUpdate} loading={saving} />
        )}
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Eliminar Materia"
        message={`¿Eliminar la materia "${deleting?.nombre}"? Esta acción es irreversible.`}
        loading={saving}
      />
    </div>
  )
}
