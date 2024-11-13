import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import NotificationsPage from '../../pages/marketing/notifications'

const marketingRoutes = {
  path: 'marketing',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'notifications',
      element: <NotificationsPage />,
    },
  ],
}

export default marketingRoutes
