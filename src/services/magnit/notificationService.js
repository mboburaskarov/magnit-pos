import { magnitClient } from './magnitClient'

export const magnitNotificationService = {
  getAll: (filters = {}) => {
    const p = new URLSearchParams()
    if (filters.limit) p.append('limit', filters.limit)
    if (filters.offset !== undefined) p.append('offset', filters.offset)
    const qs = p.toString()
    return magnitClient.get(`/api/v1/admin/notifications${qs ? `?${qs}` : ''}`)
  },
  getStats: () => magnitClient.get('/api/v1/admin/notifications/stats'),
  create: data => magnitClient.post('/api/v1/admin/notifications', data),
  delete: id => magnitClient.delete(`/api/v1/admin/notifications/${id}`),
}
