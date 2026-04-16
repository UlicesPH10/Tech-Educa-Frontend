import api from './axios'

/**
 * Genera un nuevo plan de estudio semanal usando el Agente Mentor.
 * Solo accesible por el estudiante autenticado.
 * @returns {Promise<PlanEstudio>}
 */
export const generarPlan = () => api.post('/planes/generar').then(r => r.data)

/**
 * Obtiene el plan de estudio activo de la semana actual.
 * @returns {Promise<PlanEstudio|null>}
 */
export const getMiPlan = () => api.get('/planes/mi-plan').then(r => r.data)

/**
 * Marca/desmarca un ítem del plan como completado.
 * @param {number} itemId
 * @returns {Promise<ItemPlan>}
 */
export const completarItem = (itemId) =>
  api.patch(`/planes/items/${itemId}/completar`).then(r => r.data)
