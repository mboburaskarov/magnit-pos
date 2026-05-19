import { magnitClient } from './magnitClient'

export const magnitBrandService = {
  getAll: (filters = {}) => {
    const p = new URLSearchParams()
    if (filters.limit) p.append('limit', filters.limit)
    if (filters.offset !== undefined) p.append('offset', filters.offset)
    if (filters.search) p.append('search', filters.search)
    const qs = p.toString()
    return magnitClient.get(`/api/v1/admin/brands${qs ? `?${qs}` : ''}`)
  },
  getOne: id => magnitClient.get(`/api/v1/admin/brands/${id}`),
  create: data => magnitClient.post('/api/v1/admin/brands', data),
  update: (id, data) => magnitClient.patch(`/api/v1/admin/brands/${id}`, data),
  delete: id => magnitClient.delete(`/api/v1/admin/brands/${id}`),
}
