import { useEffect, useState } from 'react'
import { BookOpen, Layers, Search, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

export default function Materias() {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await api.get('/materias/docente/me')
        setMaterias(response.data)
      } catch (error) {
        toast.error('Error al cargar currículo')
      } finally {
        setLoading(false)
      }
    }
    fetchMaterias()
  }, [])

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredMaterias = materias.filter(m => 
    m.nombre.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1E69A0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="page-title">Gestión Curricular</h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">Visualiza las materias y sus módulos programáticos.</p>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 items-center">
         <Search size={18} className="text-gray-400 mr-3" />
         <input 
            type="text" 
            placeholder="Buscar materia..." 
            className="w-full focus:outline-none text-sm bg-transparent font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterias.map((materia) => (
          <div key={materia.id} className="glass-card flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-[#F0F5F9] text-[#0F3C73] rounded-lg">
                  <BookOpen size={20} />
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">
                  {materia.clave}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0F3C73] mb-1">{materia.nombre}</h3>
              <p className="text-sm text-gray-500 font-medium line-clamp-2">{materia.descripcion}</p>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-100">
               <button 
                  onClick={() => toggleExpand(materia.id)}
                  className="w-full flex items-center justify-between p-4 text-sm font-semibold text-[#1E69A0] hover:bg-gray-100 transition-colors"
               >
                  <span className="flex items-center gap-2">
                     <Layers size={16} /> 
                     {materia.modulos.length} Módulos
                  </span>
                  {expanded[materia.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
               </button>
               
               {expanded[materia.id] && (
                  <div className="px-5 pb-5 pt-1 space-y-3">
                     {materia.modulos.length > 0 ? materia.modulos.map(mod => (
                        <div key={mod.id} className="relative pl-4 border-l-2 border-[#1E875F]">
                           <h4 className="text-sm font-bold text-gray-800">{mod.nombre}</h4>
                           <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">{mod.descripcion}</p>
                        </div>
                     )) : (
                        <p className="text-xs text-gray-400 italic">No hay módulos registrados.</p>
                     )}
                  </div>
               )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredMaterias.length === 0 && (
         <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron materias vinculadas.</p>
         </div>
      )}
    </div>
  )
}
