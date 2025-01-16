import { createContext, useState, useContext, useEffect } from 'react'
import socket from '../socket'
import { useSelector } from 'react-redux'
import { success, warning } from './toast'

export const SocketProvider = ({ children }) => {
  const user_data = useSelector((state) => state.user)
  const [socketData, setSocketData] = useState(null)

  const SocketContext = createContext()
  useEffect(() => {
    socket.on(user_data?.id, (data) => {
      if (Array.isArray(data)) {
        setSocketData(data)
        success('Данные получены из pharma')
        localStorage.setItem('socketData', JSON.stringify(data))
      } else {
        if (data?.success) {
          warning('Успешно обновлено pharma категории!')
        }
        if (!data?.succes) {
          warning(data?.error)
        }
      }
    })

    return () => {
      socket.off(user_data?.id)
    }
  }, [])

  return <SocketContext.Provider value={{ socketData }}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
