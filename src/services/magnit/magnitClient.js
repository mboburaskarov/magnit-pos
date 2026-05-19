// magnitClient.js — API client for https://api.magnitgo.uz
// Used ONLY by migrated MagnitGo sections. Never use for pharma modules.

const MAGNIT_API_BASE = import.meta.env.VITE_MAGNIT_API_URL || 'https://api.magnitgo.uz'

function getMagnitToken() {
  return localStorage.getItem('admin_token') || localStorage.getItem('noorToken')
}

export class MagnitApiError extends Error {
  constructor(apiError) {
    super(apiError.message || 'API Error')
    this.name = 'MagnitApiError'
    this.code = apiError.code || apiError.statusCode
    this.details = apiError.details
  }
}

async function magnitRequest(method, path, body, signal) {
  const url = `${MAGNIT_API_BASE}${path}`
  const token = getMagnitToken()

  const headers = {
    'Accept': 'application/json',
    'Accept-Language': 'ru',
  }

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  if (res.status === 204) return undefined

  const data = await res.json()

  if (!res.ok) {
    throw new MagnitApiError(data)
  }

  return data
}

export const magnitClient = {
  get: (path, signal) => magnitRequest('GET', path, undefined, signal),
  post: (path, body, signal) => magnitRequest('POST', path, body, signal),
  put: (path, body, signal) => magnitRequest('PUT', path, body, signal),
  patch: (path, body, signal) => magnitRequest('PATCH', path, body, signal),
  delete: (path, signal) => magnitRequest('DELETE', path, undefined, signal),
}
