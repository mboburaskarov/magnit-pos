import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import AllSalesPage from '../../pages/sales/all-sales'
import CardShiftDetails from '../../pages/sales/card-shift-details'
import NewCashRegister from '../../pages/sales/create-cash-register'
import EposSales from '../../pages/sales/epos-sales'
import NewSale from '../../pages/sales/new-order'
import NewSaleV2 from '../../pages/sales/new-sale-v2'

const salesRoutes = {
  path: 'sales',
  element: <LayoutWithHeaderNavbar hasHeader={false} />,

  children: [
    {
      path: 'create',
      children: [{ path: '', element: <NewCashRegister /> }],
    },
    {
      path: 'new-sale/:id',
      children: [{ path: '', element: <NewSale /> }],
    },
    {
      path: 'new-sale-v2/:id',
      children: [{ path: '', element: <NewSaleV2 /> }],
    },

    {
      path: 'cash-shift-detail/:id',
      children: [{ path: '', element: <CardShiftDetails /> }],
    },
    {
      path: 'epos-sales',
      children: [{ path: '', element: <EposSales /> }],
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
