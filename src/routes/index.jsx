import authRoutes from './auth'
import dashboardRoutes from './dashboard'
import productsRoutes from './products'
import productsCreateRoutes from './products/product-create'
import reportsRoutes from './reports'
import reportsInsideRoutes from './reports/reports'
import salesRoutes from './sales'
import salesWithHeaderRoutes from './sales/withHeader'
import settingsRoutes from './settings'
import rolesCreateRoutes from './settings/role-create'
import userRoutes from './users'

const routes = [
  { ...dashboardRoutes },
  { ...authRoutes },
  { ...salesRoutes },
  { ...reportsRoutes },
  { ...reportsInsideRoutes },
  { ...salesWithHeaderRoutes },
  { ...productsRoutes },
  { ...productsCreateRoutes },
  { ...rolesCreateRoutes },
  { ...userRoutes },
  { ...settingsRoutes },
]
export default routes
