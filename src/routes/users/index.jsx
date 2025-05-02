import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import ClientsPage from '../../pages/clients'
import DiscoundCardPage from '../../pages/clients/discountCard'

const userRoutes = {
  path: 'clients',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'all',
      element: <ClientsPage />,
    },
    {
      path: 'discount-cards',
      element: <DiscoundCardPage />,
    },
  ],
}

export default userRoutes
