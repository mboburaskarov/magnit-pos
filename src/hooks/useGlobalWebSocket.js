import { useWebSocketContext } from '@/context/WebSocketContext'
import { useEffect } from 'react'

export const useGlobalWebSocket = (options = {}) => {
  const { onMessage, onConnect, onDisconnect, onError } = options

  const websocket = useWebSocketContext()

  useEffect(() => {
    if (onMessage || onConnect || onDisconnect || onError) {
      const unsubscribe = websocket.subscribe((data) => {
        if (onMessage) {
          onMessage(data)
        }
      })

      return unsubscribe
    }
  }, [onMessage, websocket.subscribe])

  return {
    send: websocket.send,
    subscribe: websocket.subscribe,
    isConnected: websocket.isConnected,
    getReadyState: websocket.getReadyState,
    connect: websocket.connect,
    disconnect: websocket.disconnect,
  }
}

export default useGlobalWebSocket
