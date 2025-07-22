import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import ClientsPage from '../../pages/clients'
import DiscountCardPage from '../../pages/clients/discountCard'

const userRoutes = {
  path: 'clients',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'all',
      element: <ClientsPage />,
    },

    {
      path: 'discount-card',
      element: <DiscountCardPage />,
    },
  ],
}

export default userRoutes
