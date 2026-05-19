import { magnitClient } from './magnitClient'

export const magnitHomeSectionsService = {
  getAll: (params = {}) => {
    const p = new URLSearchParams()
    if (params.limit) p.append('limit', params.limit)
    if (params.offset !== undefined) p.append('offset', params.offset)
    const qs = p.toString()
    return magnitClient.get(`/api/v1/admin/home-sections${qs ? `?${qs}` : ''}`)
  },
  create: data => magnitClient.post('/api/v1/admin/home-sections', data),
  update: (id, data) => magnitClient.patch(`/api/v1/admin/home-sections/${id}`, data),
  delete: id => magnitClient.delete(`/api/v1/admin/home-sections/${id}`),
  toggleStatus: (id, is_active) => magnitClient.patch(`/api/v1/admin/home-sections/${id}`, { is_active }),
  reorder: items => magnitClient.post('/api/v1/admin/home-sections/reorder', { items }),
}
