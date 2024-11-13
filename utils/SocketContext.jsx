import { createContext, useState, useContext, useEffect } from 'react'
import socket from '../socket'
import { useSelector } from 'react-redux'
import { success, warning } from './toast'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const user_data = useSelector((state) => state.user)
  const [socketData, setSocketData] = useState(null)

  useEffect(() => {
    socket.on(user_data?.id, (data) => {
      if (Array.isArray(data)) {
        setSocketData(data)
        success('Данные получены из billz')
        localStorage.setItem('socketData', JSON.stringify(data))
      } else {
        if (data?.success) {
          warning('Успешно обновлено billz категории!')
        }
        if (!data?.succes) {
          warning(data?.error)
        }
      }
      console.log(data)
    })

    return () => {
      socket.off(user_data?.id)
    }
  }, [])

  return <SocketContext.Provider value={{ socketData }}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
