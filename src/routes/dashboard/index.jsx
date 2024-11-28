import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import DashboarPage from '../../pages/dashboard'

const dashboardRoutes = {
  path: 'dashboard',
  element: <LayoutWithHeaderNavbar />,
  children: [
    {
      path: '',
      element: <DashboarPage />,
    },
  ],
}

export default dashboardRoutes
