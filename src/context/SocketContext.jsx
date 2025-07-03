// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const socket = useRef(null)

  useEffect(() => {
    // Connect to your backend server
    socket.current = io('http://localhost:3000', {
      transports: ['websocket'], // Optional, depending on your setup
    })

    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id)
    })

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      socket.current.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>
}

// Custom hook to use the socket
export const useSocket = () => useContext(SocketContext)
