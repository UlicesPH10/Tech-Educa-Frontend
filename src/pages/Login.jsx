import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, TrendingUp, Users, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roleHomeMap = {
  admin: '/dashboard',
  docente: '/estudiantes',
  estudiante: '/mi-perfil',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'admin@escuela.edu.mx',
      password: 'SecurePass123',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login({ email: data.email, password: data.password })
      toast.success(`Bienvenido, ${user.nombre}`)
      navigate(roleHomeMap[user.rol] ?? '/dashboard')
    } catch (err) {
      const msg =
        err.response?.data?.detail ?? 'Credenciales incorrectas. Intenta de nuevo.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative overflow-hidden font-sans">
      {/* Sección Izquierda - Diseño Corporativo con Figuras Geométricas */}
      <div className="md:w-1/2 min-h-[40vh] md:min-h-screen bg-corp-navy relative flex items-center justify-center p-12 overflow-hidden">
        {/* Abstract Geometric Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-60 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[50vw] md:w-[40vw] h-[50vw] md:h-[40vw] rounded-full bg-corp-teal opacity-50 mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] md:w-[35vw] h-[40vw] md:h-[35vw] rounded-full bg-corp-emerald opacity-60 mix-blend-screen"></div>
          <div className="absolute top-[30%] right-[10%] w-32 h-32 rotate-45 border-[16px] border-corp-mutedorange opacity-80"></div>
          <div className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full bg-corp-bluegrey opacity-70"></div>
          {/* Subtle Accent */}
          <div className="absolute top-[20%] left-[40%] w-6 h-6 rounded-full bg-corp-lime"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6">
            <ShieldCheck size={40} className="text-corp-navy" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Gestión Educativa <br/>
            <span className="text-corp-orange">Profesional</span>
          </h1>
          <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-md">
            Plataforma integral para el monitoreo y seguimiento analítico de estudiantes en tiempo real.
          </p>
          
          <div className="space-y-6 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-corp-teal/20 flex items-center justify-center backdrop-blur-sm border border-corp-teal/30">
                <TrendingUp className="text-corp-lime" />
              </div>
              <span className="text-white/90 text-sm font-medium">Análisis de rendimiento institucional</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-corp-emerald/20 flex items-center justify-center backdrop-blur-sm border border-corp-emerald/30">
                <Users className="text-corp-lime" />
              </div>
              <span className="text-white/90 text-sm font-medium">Conexión integral: docentes y alumnos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Derecha - Formulario Flat UI */}
      <div className="md:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-corp-navy mb-2 tracking-tight">Iniciar Sesión</h2>
            <p className="text-gray-500">Accede a tu panel de control EduGuard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="login-form">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-corp-navy mb-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-corp-bluegrey group-focus-within:text-corp-teal transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@institucion.edu"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-500/60' : 'border-gray-200'} rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corp-teal/20 focus:border-corp-teal transition-all shadow-sm`}
                  {...register('email', {
                    required: 'El correo es requerido',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Correo electrónico inválido',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={13} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-corp-navy mb-2">
                Contraseña
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-corp-bluegrey group-focus-within:text-corp-teal transition-colors" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border ${errors.password ? 'border-red-500/60' : 'border-gray-200'} rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corp-teal/20 focus:border-corp-teal transition-all shadow-sm`}
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-corp-bluegrey hover:text-corp-navy transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={13} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Link recuperación */}
            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-corp-teal focus:ring-corp-teal/30" />
                <span className="text-sm font-medium text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-sm font-semibold text-corp-teal hover:text-corp-navy transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-4 py-4 bg-corp-orange hover:bg-[#E0791F] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : (
                <>
                  Ingresar a tu cuenta <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-xs text-gray-400 font-medium tracking-wide">
               © {new Date().getFullYear()} EduGuard Inc.
             </p>
             <div className="flex gap-2">
               <span className="w-2 h-2 rounded-full bg-corp-lime"></span>
               <span className="w-2 h-2 rounded-full bg-corp-teal"></span>
               <span className="w-2 h-2 rounded-full bg-corp-orange"></span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
