// socket.js
import { io } from 'socket.io-client'

// Replace with your server URL
const SOCKET_SERVER_URL = 'https://test-back.buchet.uz'

const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket'], // You can specify other transports if needed
})

export default socket
