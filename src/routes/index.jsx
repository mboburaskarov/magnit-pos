import authRoutes from './auth'
import dashboardRoutes from './dashboard'
import productsRoutes from './products'
import productsCreateRoutes from './products/product-create'
import salesRoutes from './sales'
import settingsRoutes from './settings'
import rolesCreateRoutes from './settings/role-create'
import userRoutes from './users'

const routes = [
  { ...dashboardRoutes },
  { ...authRoutes },
  { ...salesRoutes },
  { ...productsRoutes },
  { ...productsCreateRoutes },
  { ...rolesCreateRoutes },
  { ...userRoutes },
  { ...settingsRoutes },
]
export default routes
