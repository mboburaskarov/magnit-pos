import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import DashboarPage from '../../pages/dashboard'

const dashboardRoutes = {
  path: 'dashboard',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: '',
      element: <DashboarPage />,
    },
  ],
}

export default dashboardRoutes
