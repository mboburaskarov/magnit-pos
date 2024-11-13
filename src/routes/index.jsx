import authRoutes from './auth'
import dashboardRoutes from './dashboard'
import ordersRoutes from './orders'
import productsRoutes from './products'
import productsCreateRoutes from './products/product-create'
import shopRoutes from './shops'
import userRoutes from './users'
import reportRoutes from './reports'
import settingsRoutes from './settings'
import shopCreateEditRoutes from './shops/shop-create-edit'
import marketingRoutes from './marketing'
import notificationsCreateRoutes from './marketing/notifications-create'
import couriersRoutes from './couriers'

const routes = [
  { ...dashboardRoutes },
  { ...authRoutes },
  { ...ordersRoutes },
  { ...productsRoutes },
  { ...productsCreateRoutes },
  { ...shopRoutes },
  { ...userRoutes },
  { ...reportRoutes },
  { ...settingsRoutes },
  { ...shopCreateEditRoutes },
  { ...marketingRoutes },
  { ...notificationsCreateRoutes },
  { ...couriersRoutes },
]
export default routes
