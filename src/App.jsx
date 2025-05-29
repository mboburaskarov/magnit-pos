import { Box } from '@mui/material'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GlobalStyles from './assets/GlobalStyles'
import Providers from './Providers'
import Routes from './Routes'
// import { SocketProvider } from '../utils/SocketContext'
// import { ShortcutProvider } from './ShortcutProvider'

function App() {
  return (
    <Providers>
      {import.meta.env.VITE_MODE == 'dev' ? (
        <Box
          sx={{
            position: 'fixed',
            zIndex: 999999,
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            backgroundColor: '#fe5000',
            height: '20px',
            bottom: 0,
          }}
        >
          <Box
            component='span'
            sx={{
              display: 'inline-block',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              px: 2,
              animation: 'scrollText 10s linear infinite',
              '@keyframes scrollText': {
                '0%': { transform: 'translateX(100vw)' },
                '100%': { transform: 'translateX(-10vw)' },
              },
            }}
          >
            THIS IS DEV MODE
          </Box>
        </Box>
      ) : (
        <Box></Box>
      )}
      {localStorage.getItem('leftZreportCount') <= 3 ? (
        <Box
          sx={{
            position: 'fixed',
            zIndex: 999999,
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            backgroundColor: '#fe5000',
            height: '20px',
            top: 0,
          }}
        >
          <Box
            component='span'
            sx={{
              display: 'inline-block',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              px: 2,
              animation: 'scrollText 10s linear infinite',
              '@keyframes scrollText': {
                '0%': { transform: 'translateX(100vw)' },
                '100%': { transform: 'translateX(-10vw)' },
              },
            }}
          >
            У вас есть еще {localStorage.getItem('leftZreportCount')} возможности открыть z-отчеты.
          </Box>
        </Box>
      ) : (
        <Box></Box>
      )}
      {/* <SocketProvider> */}
      {/* <ShortcutProvider> */}
      <Routes />
      <GlobalStyles />
      <ToastContainer limit={3} position='top-center' autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable closeButton={false} />
      {/* </ShortcutProvider> */}
      {/* </SocketProvider> */}
    </Providers>
  )
}

export default App
