import api from './axios'

export const getGrupos = () => api.get('/grupos').then((r) => r.data)

export const createGrupo = (data) => api.post('/grupos', data).then((r) => r.data)
