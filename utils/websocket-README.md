# Global WebSocket Service

This project now includes a global WebSocket service that is initialized at the App level and can be used across all pages and components.

## Files Created/Updated

- `/utils/websocket.js` - Core WebSocket service
- `/src/context/WebSocketContext.jsx` - React Context for global WebSocket
- `/src/hooks/useGlobalWebSocket.js` - React hook for easy WebSocket usage
- `/src/Providers.jsx` - Updated to include WebSocketProvider globally

## Architecture

The WebSocket service is now **globally initialized** in the App component tree:

1. **WebSocketProvider** in `Providers.jsx` initializes the WebSocket when user data is available
2. **WebSocketContext** provides the WebSocket instance to all child components
3. **useGlobalWebSocket** hook allows components to subscribe to events

## How to Use

### 1. Basic Usage in Components

```jsx
import useGlobalWebSocket from '@hooks/useGlobalWebSocket'

function MyComponent() {
  useGlobalWebSocket({
    onMessage: (data) => {
      console.log('Received WebSocket message:', data)
      // Handle different events
      if (data.event === 'noor_order') {
        // Handle Noor order updates
      }
    }
  })

  return <div>My Component</div>
}
```

### 2. Advanced Usage with Send Functionality

```jsx
import useGlobalWebSocket from '@hooks/useGlobalWebSocket'

function InteractiveComponent() {
  const { send, isConnected } = useGlobalWebSocket({
    onMessage: (data) => {
      console.log('Received:', data)
    }
  })

  const sendMessage = () => {
    send({ type: 'ping', data: 'hello' })
  }

  return (
    <div>
      <p>WebSocket Status: {isConnected() ? 'Connected' : 'Disconnected'}</p>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}
```

### 3. Subscribe to Specific Events

```jsx
function EventSubscriber() {
  const { subscribe } = useGlobalWebSocket()

  useEffect(() => {
    // Subscribe to specific events
    const unsubscribe = subscribe((data) => {
      if (data.event === 'new_sale') {
        // Handle new sale event
        console.log('New sale received:', data)
      }
    })

    // Cleanup subscription when component unmounts
    return unsubscribe
  }, [])

  return <div>Event Subscriber Component</div>
}
```

## Global Initialization

The WebSocket is automatically initialized when:
- User is logged in (`userData.store.id` is available)
- The `WebSocketProvider` is mounted in `Providers.jsx`

No manual connection is needed in individual components!

## Features

- **Global Singleton**: Only one WebSocket connection for the entire app
- **Auto Initialization**: Connects automatically when user data is available
- **Auto Reconnection**: Automatically reconnects with exponential backoff
- **Message Queuing**: Messages sent while disconnected are queued
- **Event Subscription**: Multiple components can subscribe to the same events
- **Context-based**: Uses React Context for clean state management

## WebSocket Events

The service handles various WebSocket events:

- `noor_order` - Noor order updates
- `new_sale` - New sale notifications  
- `inventory_update` - Inventory changes
- Custom events as defined by your backend

## Migration from Local WebSocket

To migrate from local WebSocket implementation:

1. Remove local WebSocket code
2. Import `useGlobalWebSocket` hook
3. Replace WebSocket logic with the hook

### Before (Local WebSocket):
```jsx
useEffect(() => {
  const ws = new WebSocket(`wss://url/ws?store_id=${userData?.store?.id}`)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data?.event == 'noor_order') {
      refetchNoorOrderCount()
    }
  }
  
  return () => ws.close()
}, [])
```

### After (Global WebSocket):
```jsx
useGlobalWebSocket({
  onMessage: (data) => {
    if (data?.event == 'noor_order') {
      refetchNoorOrderCount()
    }
  }
})
```

## Hook Options

The `useGlobalWebSocket` hook accepts these options:

- `onMessage` - Callback for received messages
- `onConnect` - Callback when connection is established  
- `onDisconnect` - Callback when connection is closed
- `onError` - Callback for connection errors

## Available Methods

When you destructure the hook return value:

```jsx
const { send, subscribe, isConnected, getReadyState, connect, disconnect } = useGlobalWebSocket()
```

- `send(message)` - Send a message through WebSocket
- `subscribe(callback)` - Subscribe to WebSocket messages, returns unsubscribe function
- `isConnected()` - Check if WebSocket is connected
- `getReadyState()` - Get WebSocket ready state
- `connect()` - Manually connect to WebSocket
- `disconnect()` - Manually disconnect from WebSocket

## Environment Variables

The WebSocket service uses these environment variables:

- `VITE_MODE` - Development/production mode
- `VITE_BASE_API_URL_DEV` - Development API URL
- `VITE_BASE_API_URL` - Production API URL

The WebSocket URL is automatically constructed from these variables.
