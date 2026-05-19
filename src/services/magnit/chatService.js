import { magnitClient } from './magnitClient'

export const magnitChatService = {
  getConversations: (filters = {}) => {
    const p = new URLSearchParams()
    if (filters.status) p.append('status', filters.status)
    if (filters.limit) p.append('limit', filters.limit)
    if (filters.offset !== undefined) p.append('offset', filters.offset)
    const qs = p.toString()
    return magnitClient.get(`/api/v1/admin/chat/conversations${qs ? `?${qs}` : ''}`)
  },
  getMessages: (conversationId, params = {}) => {
    const p = new URLSearchParams()
    if (params.limit) p.append('limit', params.limit)
    if (params.before_id) p.append('before_id', params.before_id)
    const qs = p.toString()
    return magnitClient.get(`/api/v1/admin/chat/conversations/${conversationId}/messages${qs ? `?${qs}` : ''}`)
  },
  sendMessage: (conversationId, data) =>
    magnitClient.post(`/api/v1/admin/chat/conversations/${conversationId}/messages`, data),
  closeConversation: conversationId =>
    magnitClient.patch(`/api/v1/admin/chat/conversations/${conversationId}/close`, {}),
}
