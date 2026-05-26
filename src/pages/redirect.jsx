import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingContainer from '../../components/LoadingContainer'

export default function Redirect() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setTimeout(() => {
        navigate('/sales/create', { replace: true })
      }, 400)
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return <LoadingContainer readyState={false} fullHeight />
}
