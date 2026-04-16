import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './PrivateRoute'
import AppLayout from '../components/layout/AppLayout'

// Pages
import Login from '../pages/Login'
import Dashboard from '../pages/admin/Dashboard'
import Materias from '../pages/admin/Materias'
import Grupos from '../pages/admin/Grupos'
import Asistencia from '../pages/docente/Asistencia'
import Calificaciones from '../pages/docente/Calificaciones'
import DocenteMaterias from '../pages/docente/Materias'
import Estudiantes from '../pages/shared/Estudiantes'
import EstudianteDetalle from '../pages/shared/EstudianteDetalle'
import Alertas from '../pages/shared/Alertas'
import MiPerfil from '../pages/estudiante/MiPerfil'
import MisMaterias from '../pages/estudiante/MisMaterias'
import MiPlanEstudio from '../pages/estudiante/MiPlanEstudio'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rutas protegidas — todas usan el AppLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>

            {/* Admin only */}
            <Route element={<PrivateRoute roles={['admin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/materias" element={<Materias />} />
              <Route path="/grupos" element={<Grupos />} />
            </Route>

            {/* Docente only */}
            <Route element={<PrivateRoute roles={['docente', 'admin']} />}>
              <Route path="/asistencia" element={<Asistencia />} />
              <Route path="/calificaciones" element={<Calificaciones />} />
              <Route path="/docente-materias" element={<DocenteMaterias />} />
            </Route>

            {/* Shared: admin, docente */}
            <Route element={<PrivateRoute roles={['admin', 'docente']} />}>
              <Route path="/estudiantes" element={<Estudiantes />} />
              <Route path="/estudiantes/:id" element={<EstudianteDetalle />} />
            </Route>

            {/* Alertas: admin */}
            <Route element={<PrivateRoute roles={['admin']} />}>
              <Route path="/alertas" element={<Alertas />} />
            </Route>

            {/* Estudiante only */}
            <Route element={<PrivateRoute roles={['estudiante']} />}>
              <Route path="/mi-perfil" element={<MiPerfil />} />
              <Route path="/mis-materias" element={<MisMaterias />} />
              <Route path="/mi-plan-estudio" element={<MiPlanEstudio />} />
            </Route>

          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
