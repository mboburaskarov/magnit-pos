import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import AllSalesPage from '../../pages/sales/all-sales'
import CardShiftDetails from '../../pages/sales/card-shift-details'
import NewCashRegister from '../../pages/sales/create-cash-register'
import EposSales from '../../pages/sales/epos-sales'
import NewSaleV2 from '../../pages/sales/new-sale-v2'
import PosApp from '../../pages/sales/new-sale-v2/pos/PosApp'

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
      children: [{ path: '', element: <NewSaleV2 /> }],
    },
    {
      path: 'pos/:id',
      children: [{ path: '', element: <PosApp /> }],
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
