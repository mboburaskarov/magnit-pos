import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import ShopsPage from '../../pages/shops'
import VendorsPage from '../../pages/shops/vendors'

const shopRoutes = {
  path: 'shops',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: '',
      element: <ShopsPage />,
    },
    {
      path: 'vendors',
      element: <VendorsPage />,
    },
  ],
}

export default shopRoutes
