import { debounce } from '@mui/material'
import axios from 'axios'
import { error } from '../toast'

const debouncedShowNotification = debounce(() => error('Нет соединения'), 2000)

export const authRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  },
})

export const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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

export const eposRequest = axios.create({
  baseURL: import.meta.env.VITE_EPOS_BASE_API_URL,
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
  baseURL: import.meta.env.VITE_FILE_API_URL,
  headers: {
    Authorization: localStorage.getItem('access_token'),
    'Content-Type': 'multipart/form-data',
    accept: '*/*',
  },
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
      localStorage.clear()
      window.location.replace('/login')
    }

    return Promise.reject(err)
  }
)
