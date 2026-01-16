import { useSelector } from 'react-redux'

let wsInstance = null
let subscribers = new Set()
let reconnectAttempts = 0
let maxReconnectAttempts = 5
let reconnectTimeout = null

class WebSocketService {
  constructor() {
    this.ws = null
    this.userData = null
    this.isConnecting = false
    this.messageQueue = []
  }

  connect(userData) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.userData = userData
    this.isConnecting = true

    const url = import.meta.env.VITE_MODE == 'dev' 
      ? import.meta.env.VITE_BASE_API_URL_DEV 
      : import.meta.env.VITE_BASE_API_URL
    
    const wsUrl = `wss://${url.split('https://')[1]}/ws?store_id=${userData?.store?.id}`
    
    try {
      this.ws = new WebSocket(wsUrl)
      wsInstance = this.ws

      this.ws.onopen = () => {
        console.log('WebSocket connection established')
        this.isConnecting = false
        reconnectAttempts = 0
        
        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift()
          this.send(message)
        }
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('WebSocket received:', data)
          
          // Notify all subscribers
          subscribers.forEach(callback => {
            try {
              callback(data)
            } catch (error) {
              console.error('Error in subscriber callback:', error)
            }
          })
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
      }

      this.ws.onclose = () => {
        console.log('WebSocket closed')
        this.isConnecting = false
        this.ws = null
        wsInstance = null

        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          const delay = Math.pow(2, reconnectAttempts) * 1000 // Exponential backoff
          
          reconnectTimeout = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})`)
            this.connect(this.userData)
          }, delay)
        }
      }
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      this.isConnecting = false
    }
  }

  disconnect() {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    wsInstance = null
    this.isConnecting = false
    this.messageQueue = []
    subscribers.clear()
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(typeof message === 'string' ? message : JSON.stringify(message))
    } else {
      // Queue message if not connected
      this.messageQueue.push(message)
      
      // Try to connect if not already connecting
      if (!this.isConnecting && this.userData) {
        this.connect(this.userData)
      }
    }
  }

  subscribe(callback) {
    subscribers.add(callback)
    
    // Return unsubscribe function
    return () => {
      subscribers.delete(callback)
    }
  }

  getReadyState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// Create singleton instance
const websocketService = new WebSocketService()

// Hook for using WebSocket in components
export const useWebSocket = () => {
  const userData = useSelector((state) => state.user)
  
  const connect = () => {
    if (userData?.store?.id) {
      websocketService.connect(userData)
    }
  }

  const disconnect = () => {
    websocketService.disconnect()
  }

  const send = (message) => {
    websocketService.send(message)
  }

  const subscribe = (callback) => {
    return websocketService.subscribe(callback)
  }

  const isConnected = () => {
    return websocketService.isConnected()
  }

  const getReadyState = () => {
    return websocketService.getReadyState()
  }

  return {
    connect,
    disconnect,
    send,
    subscribe,
    isConnected,
    getReadyState
  }
}

// Export the service instance for direct usage
export default websocketService
