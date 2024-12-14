import authRoutes from './auth'
import dashboardRoutes from './dashboard'
import salesRoutes from './sales'
import productsRoutes from './products'
import productsCreateRoutes from './products/product-create'
import userRoutes from './users'
import reportRoutes from './reports'
import settingsRoutes from './settings'
import vendorRoutes from './vendors'
import rolesCreateRoutes from './settings/role-create'

const routes = [
  { ...dashboardRoutes },
  { ...authRoutes },
  { ...salesRoutes },
  { ...productsRoutes },
  { ...productsCreateRoutes },
  { ...rolesCreateRoutes },
  { ...userRoutes },
  { ...vendorRoutes },
  { ...reportRoutes },
  { ...settingsRoutes },
]
export default routes
