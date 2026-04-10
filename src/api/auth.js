import api from './axios'

export const login = (credentials) =>
  api.post('/auth/login', credentials).then((r) => r.data)
