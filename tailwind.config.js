/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        corp: {
          navy: '#132f5a',
          orange: '#F58723',
          teal: '#1E69A0',
          emerald: '#1E875F',
          bluegrey: '#A5AFBE',
          mutedorange: '#E1A55A',
          lime: '#87D264',
        },
        bg: {
          base: '#0f1117',
          surface: '#1a1d27',
          card: '#1e2130',
        },
        border: {
          subtle: 'rgba(255,255,255,0.08)',
          DEFAULT: 'rgba(255,255,255,0.12)',
        },
        risk: {
          bajo: '#22c55e',
          medio: '#eab308',
          alto: '#f97316',
          critico: '#ef4444',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-indigo': '0 0 20px rgba(79, 70, 229, 0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
