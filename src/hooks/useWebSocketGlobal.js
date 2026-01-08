import { useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import websocketService from '@/utils/websocket'

export const useWebSocketGlobal = (options = {}) => {
  const { 
    onMessage, 
    onConnect, 
    onDisconnect, 
    onError,
    autoConnect = true,
    reconnectOnVisibilityChange = true
  } = options
  
  const userData = useSelector((state) => state.user)
  const unsubscribeRef = useRef(null)
  const isConnectedRef = useRef(false)

  const connect = useCallback(() => {
    if (userData?.store?.id && !websocketService.isConnected()) {
      websocketService.connect(userData)
    }
  }, [userData])

  const disconnect = useCallback(() => {
    websocketService.disconnect()
  }, [])

  const send = useCallback((message) => {
    websocketService.send(message)
  }, [])

  const subscribe = useCallback((callback) => {
    return websocketService.subscribe(callback)
  }, [])

  useEffect(() => {
    if (autoConnect && userData?.store?.id) {
      connect()
    }

    // Set up event handlers
    if (onMessage || onConnect || onDisconnect || onError) {
      unsubscribeRef.current = subscribe((data) => {
        if (onMessage) {
          onMessage(data)
        }
      })
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [autoConnect, userData, connect, subscribe, onMessage])

  // Handle visibility change for reconnection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (reconnectOnVisibilityChange && document.visibilityState === 'visible') {
        if (!websocketService.isConnected() && userData?.store?.id) {
          connect()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [connect, reconnectOnVisibilityChange, userData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  return {
    connect,
    disconnect,
    send,
    subscribe,
    isConnected: () => websocketService.isConnected(),
    getReadyState: () => websocketService.getReadyState()
  }
}

export default useWebSocketGlobal
