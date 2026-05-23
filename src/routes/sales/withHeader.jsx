import MainLayout from '@/layouts/MainLayout'
import CashShiftHistoryPage from '../../pages/sales/cash-shift-history'
import CasShiftsPage from '../../pages/sales/cash-shift/index'

const salesWithHeaderRoutes = {
  path: 'sales',
  element: <MainLayout />,
  children: [
    {
      path: 'cash-shifts',
      children: [{ path: '', element: <CasShiftsPage /> }],
    },
    {
      path: 'cash-shift-history',
      children: [{ path: '', element: <CashShiftHistoryPage /> }],
    },
  ],
}

export default salesWithHeaderRoutes
