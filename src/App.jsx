import Providers from './Providers'
import Routes from './Routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import GlobalStyles from './assets/GlobalStyles'
import { SocketProvider } from '../utils/SocketContext'

function App() {
  return (
    <Providers>
      <SocketProvider>
        <Routes />
        <GlobalStyles />
        <ToastContainer limit={3} position='top-center' autoClose={1000} hideProgressBar closeOnClick pauseOnHover draggable closeButton={false} />
      </SocketProvider>
    </Providers>
  )
}

export default App
