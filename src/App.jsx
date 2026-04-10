import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e2130',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '13px',
            padding: '10px 14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#1e2130' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1e2130' },
          },
        }}
      />
      <AppRouter />
    </AuthProvider>
  )
}
