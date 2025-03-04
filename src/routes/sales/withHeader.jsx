import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import CasShiftsPage from '../../pages/sales/cash-shift/index'

const salesWithHeaderRoutes = {
  path: 'sales',
  element: <LayoutWithHeaderNavbar hasHeader={true} />,

  children: [
    {
      path: 'cash-shifts',
      children: [{ path: '', element: <CasShiftsPage /> }],
    },
  ],
}

export default salesWithHeaderRoutes
