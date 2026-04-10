import api from './axios'

export const registrarAsistencia = (data) =>
  api.post('/registros/asistencia', data).then((r) => r.data)

export const registrarCalificacion = (data) =>
  api.post('/registros/calificacion', data).then((r) => r.data)
