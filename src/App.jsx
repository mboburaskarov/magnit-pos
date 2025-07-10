import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GlobalStyles from './assets/GlobalStyles'
// import { SocketProvider } from './context/SocketContext'
import Providers from './Providers'
import Routes from './Routes'

function App() {
  return (
    <Providers>
      {/* <SocketProvider> */}
      <Routes />
      <GlobalStyles />
      <ToastContainer limit={3} position='top-center' autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable closeButton={false} />
      {/* </SocketProvider> */}
    </Providers>
  )
}

export default App
