import api from './axios'

export const getAlertas = (params = {}) =>
  api.get('/alertas', { params }).then((r) => r.data)

export const atenderAlerta = (id, data) =>
  api.put(`/alertas/${id}/atender`, data).then((r) => r.data)
