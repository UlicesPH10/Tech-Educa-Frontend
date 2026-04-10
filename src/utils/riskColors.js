export const RISK_CONFIG = {
  bajo: {
    color: '#1E875F',
    label: 'Bajo riesgo',
    bg: 'bg-[#1E875F]/10',
    text: 'text-[#156142]',
    border: 'border-[#1E875F]/20',
    emoji: '🟢',
  },
  medio: {
    color: '#F58723',
    label: 'Riesgo medio',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    emoji: '🟡',
  },
  alto: {
    color: '#ef4444',
    label: 'Riesgo alto',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    emoji: '🟠',
  },
  critico: {
    color: '#b91c1c',
    label: 'Riesgo crítico',
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    emoji: '🔴',
  },
}

export const getRiskConfig = (nivel) =>
  RISK_CONFIG[nivel] ?? RISK_CONFIG.bajo
