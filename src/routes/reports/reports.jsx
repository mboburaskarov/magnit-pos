import MainLayout from '../../layouts/MainLayout'
import LFLReport from '../../pages/reports/lfl'
import ProductReportPage from '../../pages/reports/productReport'
import SellerBonus from '../../pages/reports/sellerBonus'
import StoreReportPage from '../../pages/reports/storeReport'
import TopReportsPage from '../../pages/reports/topReports'

const reportsInsideRoutes = {
  path: 'reports',
  element: <MainLayout />,

  children: [
    {
      path: 'lfl',
      children: [{ path: '', element: <LFLReport /> }],
    },
    {
      path: 'seller-bonus',
      children: [{ path: '', element: <SellerBonus /> }],
    },
    {
      path: 'product-report',
      children: [{ path: '', element: <ProductReportPage /> }],
    },
    {
      path: 'top-reports',
      element: <TopReportsPage />,
    },
    {
      path: 'store-report',
      children: [{ path: '', element: <StoreReportPage /> }],
    },
  ],
}

export default reportsInsideRoutes
