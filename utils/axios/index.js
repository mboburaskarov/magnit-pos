import { debounce } from '@mui/material'
import axios from 'axios'
import { error } from '../toast'

const debouncedShowNotification = debounce(() => error('Нет соединения'), 2000)

export const authRequest = axios.create({
  baseURL: import.meta.env.VITE_MODE == 'dev' ? import.meta.env.VITE_BASE_API_URL_DEV : import.meta.env.VITE_BASE_API_URL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  },
})

export const request = axios.create({
  baseURL: import.meta.env.VITE_MODE == 'dev' ? import.meta.env.VITE_BASE_API_URL_DEV : import.meta.env.VITE_BASE_API_URL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  },

  transformRequest: [
    (data) => {
      return JSON.stringify(data)
    },
  ],
})

export const requestEXCEL = axios.create({
  baseURL: import.meta.env.VITE_MODE == 'dev' ? import.meta.env.VITE_BASE_API_URL_DEV : import.meta.env.VITE_BASE_API_URL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  },
  // responseType: 'blob',
  transformRequest: [
    (data) => {
      return JSON.stringify(data)
    },
  ],
})

export const eposRequest = axios.create({
  baseURL: import.meta.env.VITE_MODE == 'dev' ? import.meta.env.VITE_EPOS_BASE_API_URL_DEV : import.meta.env.VITE_EPOS_BASE_API_URL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  },
  transformRequest: [
    (data) => {
      return JSON.stringify(data)
    },
  ],
})

export const fileUploadRequest = axios.create({
  baseURL: import.meta.env.VITE_MODE == 'dev' ? import.meta.env.VITE_FILE_API_URL_DEV : import.meta.env.VITE_FILE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    accept: '*/*',
  },
})

const addAuthToken = (config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

request.interceptors.request.use(addAuthToken)
requestEXCEL.interceptors.request.use(addAuthToken)
eposRequest.interceptors.request.use(addAuthToken)
fileUploadRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = token
  return config
})

export const yandexMapsRequest = axios.create({
  baseURL: `https://geocode-maps.yandex.ru/1.x/`,
  headers: { accept: '*/*' },
  transformRequest: [
    (data) => {
      return JSON.stringify(data)
    },
  ],
})

request.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    if (err?.toJSON()?.message === 'Network Error') {
      debouncedShowNotification()
    }

    if (err.response.status === 401 || err.response.status === 403) {
      localStorage.removeItem('access_token')
      if (window.location.protocol === 'file:') {
        window.location.hash = '#/login'
      } else {
        window.location.replace('/login')
      }
    }

    return Promise.reject(err)
  }
)
