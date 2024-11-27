import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import MainLayout from '../../layouts/MainLayout'
import SalesPage from '../../pages/sales'
import NewCashRegister from '../../pages/sales/create-cash-register'
import NewSale from '../../pages/sales/new-order'

const salesRoutes = {
  path: 'sales',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'create',
      children: [{ path: '', element: <NewCashRegister /> }],
    },
    {
      path: 'new-sale',
      children: [{ path: ':id', element: <NewSale /> }],
    },
    {
      path: 'all',
      children: [
        {
          path: '',
          element: <SalesPage />,
        },
      ],
    },
  ],
}

export default salesRoutes
