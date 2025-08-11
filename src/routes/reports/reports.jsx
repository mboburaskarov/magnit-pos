import MainLayout from '../../layouts/MainLayout'
import BonusProductsPage from '../../pages/reports/bonusProducts'
import LFLReport from '../../pages/reports/lfl'
import ProductReportPage from '../../pages/reports/productReport'
import SellerBonus from '../../pages/reports/sellerBonus'
import StoreReportPage from '../../pages/reports/storeReport'
import StoreSummaryPage from '../../pages/reports/storeSummary'
import TopBranchesPage from '../../pages/reports/topBranches'
import TopProductsPage from '../../pages/reports/topProducts'
import TopVendorsPage from '../../pages/reports/topVendor'

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
      path: 'top-products',
      element: <TopProductsPage />,
    },
    {
      path: 'bonus-products',
      element: <BonusProductsPage />,
    },
    {
      path: 'top-branchs',
      element: <TopBranchesPage />,
    },
    {
      path: 'store-summary',
      element: <StoreSummaryPage />,
    },
    {
      path: 'top-vendors',
      element: <TopVendorsPage />,
    },
    {
      path: 'store-report',
      children: [{ path: '', element: <StoreReportPage /> }],
    },
  ],
}

export default reportsInsideRoutes
