import { useEffect } from 'react'
import LoadingContainer from '../../components/LoadingContainer'
export default function Redirect() {
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setTimeout(() => {
        window.location.replace('/products') //change
      }, 400)
    } else {
      window.location.replace(`/login`)
    }

    return
  }, [])

  return <LoadingContainer readyState={false} fullHeight />
}
