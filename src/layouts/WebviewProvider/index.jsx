import { createContext, useContext, useEffect, useState } from 'react'

const WebviewProviderContext = createContext({
  isWebview: false,
})

const isElectron = () => {
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true
  }

  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true
  }

  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true
  }

  return false
}

export default function WebviewProvider({ children }) {
  const [isWebview, setIsWebview] = useState(false)

  useEffect(() => {
    if (isElectron()) {
      setIsWebview(true)
    }
    const handler = (e) => {
      if (!e.data) return
      switch (e.data.type) {
        case 'ENV':
          setIsWebview(!!e.data.isWebView)
          break

        case 'SET_LOCALSTORAGE':
          const payload = e.data.payload || {}
          Object.entries(payload).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              localStorage.setItem(key, value)
            }
          })
          break

        case 'QUERY_UPDATE':
          const search = e.data.payload || ''
          const url = new URL(window.location.href)
          url.search = search
          window.history.replaceState(null, '', url.toString())
          console.log('Updated search params:', url.search)
          break

        default:
          console.warn('Unknown message type from webview:', e.data.type)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    if (!window.parent) return
    window.parent.postMessage(
      {
        type: 'LOCATION_UPDATE',
        payload: location.pathname,
        search: location.search,
      },
      '*',
    )
  }, [location.pathname, location.search])

  return <WebviewProviderContext.Provider value={{ isWebview }}>{children}</WebviewProviderContext.Provider>
}

export const useWebView = () => useContext(WebviewProviderContext)
