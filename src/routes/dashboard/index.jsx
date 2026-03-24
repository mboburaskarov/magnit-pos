import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import DashboarPage from '../../pages/dashboard'
import DashboarB2BPage from '../../pages/dashboard/B2B'

const dashboardRoutes = {
  path: 'dashboard',
  element: <LayoutWithHeaderNavbar />,
  children: [
    {
      path: '',
      element: <DashboarPage />,
    },
    {
      path: 'b2b',
      element: <DashboarB2BPage />,
    },
  ],
}

export default dashboardRoutes
