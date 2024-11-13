import { useEffect, useRef, useState } from 'react'
import CardDrawer from '../../../components/Drawers/CardDrawer'
import { Box } from '@mui/material'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'

import { error, success } from '../../../utils/toast'

export default function CreateWithNoorDrawer({ isOpen, setIsDrawer }) {
  const webviewRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [calculatedValue, setCalculatedValue] = useState(0)
  const { data, isLoading } = useQuery('get-token-noor', () => requests.getNoorToken(), {
    enabled: isOpen,
  })
  useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.data.type === 'error-form-data') {
        error('Заполните все поля!')
      }
      if (e.data.type === 'error-on-create') {
        error('Ошибка при создании!')
        setIsDrawer(null)
      }
      if (e.data.type === 'created') {
        success('Успешно создан!')
        setIsDrawer(null)
      }
      if (e.data.type === 'iframe-ready') {
        setReady(true)
      }
    })
    return window.removeEventListener('message', () => {})
  }, [])

  useEffect(() => {
    if (data?.data?.token && ready && webviewRef) {
      webviewRef.current?.contentWindow?.postMessage(
        {
          type: 'test',
          access_token: data?.data?.token,
          shop_id: '4ec4c1ba-6403-4c8d-9416-ab09769b728s',
        },
        '*'
      )
      setReady(false)
    }
  }, [data?.data?.token, ready])
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth
      const result = viewportWidth - 228
      setCalculatedValue(result)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <CardDrawer isLoading={isLoading} title={'Заказать с Noor'} withoutActions isOpen={isOpen} closeDrawer={() => setIsDrawer(null)} width={calculatedValue}>
      <iframe
        allow='geolocation'
        ref={webviewRef}
        src='https://tmerchant.noor.uz/orders/create-order-wv'
        style={{
          width: '100%',
          height: 'calc(100vh - 230px)',
          border: 'none',
          borderRadius: '48px',
        }}
        allowFullScreen
      />
    </CardDrawer>
  )
}
