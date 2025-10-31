// useSocket.js
import { useEffect, useRef } from 'react'

export const useSocket = (url, onMessage) => {
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onmessage = onMessage
    socket.onerror = (err) => console.error('WS Error', err)
    socket.onclose = () => console.error('WS Closed')

    return () => socket.close()
  }, [url, onMessage])

  return socketRef
}
