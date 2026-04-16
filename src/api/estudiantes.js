import api from './axios'

export const getEstudiantes = (params = {}) =>
  api.get('/estudiantes', { params }).then((r) => r.data)

export const getEstudiante = (id) =>
  api.get(`/estudiantes/${id}`).then((r) => r.data)

export const getMisMaterias = () =>
  api.get('/estudiantes/me/materias').then((r) => r.data)

export const getMiResumenAcademico = () =>
  api.get('/estudiantes/me/resumen-academico').then((r) => r.data)
