import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { login as loginApi } from '../api/auth'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: null,
  loading: true,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, user: action.user, token: action.token, loading: false }
    case 'LOGIN':
      return { user: action.user, token: action.token, loading: false }
    case 'LOGOUT':
      return { user: null, token: null, loading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restaurar sesión de localStorage al montar
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw)
        dispatch({ type: 'INIT', user, token })
      } catch {
        dispatch({ type: 'INIT', user: null, token: null })
      }
    } else {
      dispatch({ type: 'INIT', user: null, token: null })
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials)
    const user = {
      id: data.usuario_id,
      nombre: data.nombre,
      rol: data.rol,
    }
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', user, token: data.access_token })
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
