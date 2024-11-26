import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import VendorsPage from '../../pages/vendors'

const vendorRoutes = {
  path: 'vendors',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'all',
      element: <VendorsPage />,
    },
  ],
}

export default vendorRoutes
