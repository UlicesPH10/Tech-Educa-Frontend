import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getRiskConfig } from '../../utils/riskColors'
import { formatDate } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const config = getRiskConfig(d.nivel_riesgo)
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{formatDate(d.calculado_en)}</p>
      <p className="font-semibold" style={{ color: config.color }}>
        Score: {d.score_total?.toFixed(1)}
      </p>
      <p className={config.text}>{config.label}</p>
    </div>
  )
}

/**
 * Gráfica de líneas para historial de scores de riesgo
 * @param {Array} data - array de { score_total, nivel_riesgo, calculado_en }
 */
export default function ScoreLineChart({ data = [] }) {
  const chartData = [...data].reverse().map((d) => ({
    ...d,
    fecha: formatDate(d.calculado_en),
  }))

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="fecha"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score_total"
            stroke="url(#scoreGradient)"
            strokeWidth={2.5}
            dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#a78bfa' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
