import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import LFLReport from '../../pages/reports/lfl'
import ProductReportPage from '../../pages/reports/productReport'
import SellerBonus from '../../pages/reports/sellerBonus'

const reportsRoutes = {
  path: 'reports',
  element: <LayoutWithHeaderNavbar />,

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
  ],
}

export default reportsRoutes
