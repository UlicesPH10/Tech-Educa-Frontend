import api from './axios'

export const getMaterias = () => api.get('/materias').then((r) => r.data)

export const getMateria = (id) => api.get(`/materias/${id}`).then((r) => r.data)

export const createMateria = (data) => api.post('/materias', data).then((r) => r.data)

export const updateMateria = (id, data) =>
  api.put(`/materias/${id}`, data).then((r) => r.data)

export const deleteMateria = (id) => api.delete(`/materias/${id}`).then((r) => r.data)

export const createModulo = (materiaId, data) =>
  api.post(`/materias/${materiaId}/modulos`, data).then((r) => r.data)

export const updateModulo = (materiaId, moduloId, data) =>
  api.put(`/materias/${materiaId}/modulos/${moduloId}`, data).then((r) => r.data)

export const deleteModulo = (materiaId, moduloId) =>
  api.delete(`/materias/${materiaId}/modulos/${moduloId}`).then((r) => r.data)
