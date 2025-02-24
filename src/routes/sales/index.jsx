import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import AllSalesPage from '../../pages/sales/all-sales'
import CardShiftDetails from '../../pages/sales/card-shift-details'
import NewCashRegister from '../../pages/sales/create-cash-register'
import NewSale from '../../pages/sales/new-order'
import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'

const salesRoutes = {
  path: 'sales',
  element: <LayoutWithHeaderNavbar hasHeader={false} />,

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
      path: 'cash-shift',
      children: [{ path: ':id', element: <CardShiftDetails /> }],
    },
    {
      path: 'all-sales',
      children: [
        {
          path: '',
          element: <AllSalesPage />,
        },
      ],
    },
  ],
}

export default salesRoutes
