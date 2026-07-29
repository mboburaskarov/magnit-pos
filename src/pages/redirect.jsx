import { useEffect } from 'react'
import LoadingContainer from '../../components/LoadingContainer'
import { bypassNextAppExit } from '../hooks/useExitConfirm'

export default function Redirect() {
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setTimeout(() => {
        bypassNextAppExit()
        window.location.replace('/sales/create')
      }, 400)
    } else {
      bypassNextAppExit()
      window.location.replace(`/login`)
    }

    return
  }, [])

  return <LoadingContainer readyState={false} fullHeight />
}
