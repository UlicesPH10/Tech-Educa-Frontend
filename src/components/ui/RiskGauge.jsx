import { getRiskConfig } from '../../utils/riskColors'

/**
 * Gauge circular de score de riesgo (0-100)
 * @param {number} score
 * @param {string} nivel - 'bajo' | 'medio' | 'alto' | 'critico'
 * @param {number} size - diámetro en px (default 120)
 */
export default function RiskGauge({ score = 0, nivel = 'bajo', size = 120 }) {
  const config = getRiskConfig(nivel)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  // El gauge recorre 270° (¾ de círculo)
  const maxAngle = 270
  const clampedScore = Math.min(100, Math.max(0, score))
  const progress = (clampedScore / 100) * (circumference * (maxAngle / 360))
  const dashOffset = circumference * (maxAngle / 360) - progress

  const center = size / 2
  // Rotamos el SVG para que el inicio sea abajo-izquierda
  const rotation = 135

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Pista de fondo */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="8"
            strokeDasharray={`${circumference * (maxAngle / 360)} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progreso */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="8"
            strokeDasharray={`${progress} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${config.color}80)`,
              transition: 'stroke-dasharray 0.6s ease',
            }}
          />
        </svg>
        {/* Texto central */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: 'none' }}
        >
          <span className={`text-2xl font-bold ${config.text}`}>
            {clampedScore.toFixed(0)}
          </span>
          <span className="text-xs text-gray-500 mt-0.5">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${config.text}`}>{config.label}</span>
    </div>
  )
}
