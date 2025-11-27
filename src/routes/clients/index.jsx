import LoyaltyLevel from '@/pages/clients/loyalty-level'
import ClientsPage from '../../pages/clients'
import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'

const clientsRoutes = {
  path: 'clients',
  children: [
    {
      path: 'all',
      element: <LayoutWithNavbar />,
      children: [
        {
          path: '',
          element: <ClientsPage />,
        },
      ],
    },
    {
      path: 'loyalty-level',
      element: <LayoutWithHeaderNavbar />,
      children: [
        {
          path: '',
          element: <LoyaltyLevel />,
        },
      ],
    },
  ],
}

export default clientsRoutes
