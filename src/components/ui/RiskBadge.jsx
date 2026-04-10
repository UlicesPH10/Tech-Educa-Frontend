import { getRiskConfig } from '../../utils/riskColors'

/**
 * Badge de semáforo de riesgo
 * @param {string} nivel - 'bajo' | 'medio' | 'alto' | 'critico'
 * @param {boolean} showEmoji
 * @param {string} size - 'sm' | 'md'
 */
export default function RiskBadge({ nivel, showEmoji = true, size = 'md' }) {
  const config = getRiskConfig(nivel)
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`badge ${config.bg} ${config.text} border ${config.border} ${padding} font-semibold`}
    >
      {showEmoji && <span className="mr-0.5">{config.emoji}</span>}
      {config.label}
    </span>
  )
}
