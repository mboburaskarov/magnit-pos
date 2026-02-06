import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryParams } from './useQueryParams'

export function useNavigateWithParams() {
  const navigate = useNavigate()
  const location = useLocation()
  const { values } = useQueryParams()
  const [fromUrl, setFromUrl] = useState(location.state?.from)

  // Store previous full URL (pathname + search)
  const prevUrlRef = useRef(null)

  // useEffect(() => {
  //   prevUrlRef.current = `${location.pathname}${location.search}`
  // }, [location.pathname, location.search])

  // Navigate to a new path while keeping (or merging) query params
  const navigateWithParams = (path, options = {}) => {
    const params = new URLSearchParams(options.keep ? location.search : '')
    prevUrlRef.current = `${location.pathname}${location.search}`
    if (options.extraParams) {
      Object.entries(options.extraParams).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })
    }

    const queryString = params.toString()
    const fullPath = queryString ? `${path}?${queryString}` : path

    navigate(fullPath, { replace: options.replace })
  }

  // Go back to previous page with its query params
  const goBackWithParams = (backHref = '/') => {
    if (fromUrl) {
      navigate(fromUrl)
    } else if (prevUrlRef.current) {
      navigate(prevUrlRef.current)
    } else {
      if (values?.start_date && values?.end_date) {
        const link = `${values?.backHref || backHref}?start_date=${values?.start_date}&end_date=${values?.end_date}&from_time=${values?.from_time}&to_time=${
          values?.to_time
        }`
        navigate(link)
        return
      }
      navigate(values?.backHref || backHref)
    }
  }

  return { navigateWithParams, goBackWithParams }
}
