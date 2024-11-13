import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import ReportMainPage from '../../pages/reports'
import ReportAccountingPage from '../../pages/reports/accounting'
import ReportAppPage from '../../pages/reports/app'
import ReportDeliveryPage from '../../pages/reports/delivery'
import ReportTraficPage from '../../pages/reports/trafic'
import ReportTransactions from '../../pages/reports/transactions'

const reportRoutes = {
  path: 'reports',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'delivery',
      element: <ReportDeliveryPage />,
    },
    {
      path: 'accounting',
      element: <ReportAccountingPage />,
    },
    {
      path: 'main',
      element: <ReportMainPage />,
    },
    {
      path: 'trafic',
      element: <ReportTraficPage />,
    },
    {
      path: 'app',
      element: <ReportAppPage />,
    },
    {
      path: 'transactions',
      element: <ReportTransactions />,
    },
  ],
}

export default reportRoutes
