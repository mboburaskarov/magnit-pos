import React, { createContext, useContext, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import websocketService from '@utils/websocket'

const WebSocketContext = createContext()

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  return context
}

export const WebSocketProvider = ({ children }) => {
  const userData = useSelector((state) => state.user)
  const subscribersRef = useRef(new Set())
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // Initialize WebSocket only once when user data is available
    if (userData?.store?.id && !isInitializedRef.current) {
      isInitializedRef.current = true
      websocketService.connect(userData)

      console.log('Global WebSocket initialized for store:', userData.store.id)
    }

    // Cleanup when user data changes or component unmounts
    return () => {
      if (isInitializedRef.current && !userData?.store?.id) {
        websocketService.disconnect()
        isInitializedRef.current = false
        subscribersRef.current.clear()
      }
    }
  }, [userData])

  const contextValue = {
    send: websocketService.send.bind(websocketService),
    subscribe: websocketService.subscribe.bind(websocketService),
    isConnected: websocketService.isConnected.bind(websocketService),
    getReadyState: websocketService.getReadyState.bind(websocketService),
    connect: () => {
      if (userData?.store?.id) {
        websocketService.connect(userData)
      }
    },
    disconnect: websocketService.disconnect.bind(websocketService),
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

export default WebSocketProvider
