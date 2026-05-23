import authRoutes from './auth'
import salesRoutes from './sales'
import salesWithHeaderRoutes from './sales/withHeader'

const routes = [
  { ...authRoutes },
  { ...salesRoutes },
  { ...salesWithHeaderRoutes },
]
export default routes
