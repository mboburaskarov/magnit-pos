import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import VendorsPage from '../../pages/settings/vendors'

const cashboxRoutes = {
  path: 'cashbox',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'all',
      element: <VendorsPage />,
    },
  ],
}

export default cashboxRoutes
