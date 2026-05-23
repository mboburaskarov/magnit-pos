import MainLayout from '@/layouts/MainLayout'
import CardShiftDetails from '../../pages/sales/card-shift-details'
import NewCashRegister from '../../pages/sales/create-cash-register'
import PosApp from '../../pages/sales/new-sale/pos/PosApp'

const salesRoutes = {
  path: 'sales',
  element: <MainLayout />,

  children: [
    {
      path: 'create',
      children: [{ path: '', element: <NewCashRegister /> }],
    },
    {
      path: 'pos/:id',
      children: [{ path: '', element: <PosApp /> }],
    },
    {
      path: 'cash-shift-detail/:id',
      children: [{ path: '', element: <CardShiftDetails /> }],
    },
  ],
}

export default salesRoutes
