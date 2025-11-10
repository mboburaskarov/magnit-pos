import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar';
import NewCashRegister from '../../pages/sales/create-cash-register';
import CardShiftDetails from '../../pages/sales/card-shift-details';
import AllSalesPage from '../../pages/sales/all-sales';
import NewSaleV2 from '../../pages/sales/new-sale-v2';
import EposSales from '../../pages/sales/epos-sales';
import NewSale from '../../pages/sales/new-order';


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
      path: 'new-sale-v2',
      children: [{ path: ':id', element: <NewSaleV2 /> }],
    },

    {
      path: 'cash-shift-detail',
      children: [{ path: ':id', element: <CardShiftDetails /> }],
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
