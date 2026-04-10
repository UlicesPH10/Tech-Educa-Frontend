/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string} isoString - fecha ISO 8601
 * @returns {string}
 */
export const formatDate = (isoString) => {
  if (!isoString) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoString))
}

/**
 * Formatea una fecha ISO con hora
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}

/**
 * Formatea un score numérico a 1 decimal
 */
export const formatScore = (score) => {
  if (score === null || score === undefined) return '—'
  return Number(score).toFixed(1)
}

/**
 * Genera iniciales de un nombre completo
 */
export const getInitials = (nombre, apellido = '') => {
  const n = (nombre?.[0] ?? '').toUpperCase()
  const a = (apellido?.[0] ?? '').toUpperCase()
  return `${n}${a}`
}

/**
 * Trunca texto a un número máximo de caracteres
 */
export const truncate = (text, max = 100) => {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

/**
 * Formatea el label del tipo de calificación
 */
export const formatTipoCalificacion = (tipo) => {
  const map = {
    parcial: 'Parcial',
    examen: 'Examen',
    tarea: 'Tarea',
    proyecto: 'Proyecto',
  }
  return map[tipo] ?? tipo
}
