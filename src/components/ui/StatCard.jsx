/**
 * Card de estadística resumen
 * @param {string} title
 * @param {string|number} value
 * @param {ReactNode} icon
 * @param {string} trend - texto de tendencia (opcional)
 * @param {string} color - clase de color del ícono ('violet', 'indigo', 'green', 'red', etc.)
 */
export default function StatCard({ title, value, icon, trend, color = 'violet', onClick }) {
  const colorMap = {
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-400',
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
  }
  const cls = colorMap[color] ?? colorMap.violet

  return (
    <div
      className={`glass-card p-5 flex items-start gap-4 animate-fade-in ${onClick ? 'cursor-pointer hover:border-violet-500/30 hover:bg-white/[0.06] transition-all duration-200' : ''}`}
      onClick={onClick}
    >
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br border ${cls} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value ?? '—'}</p>
        {trend && (
          <p className="text-xs text-gray-500 mt-1">{trend}</p>
        )}
      </div>
    </div>
  )
}
