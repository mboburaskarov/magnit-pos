import MainLayout from '../../layouts/MainLayout'
import StoreReportPage from '../../pages/reports/branch/storeReport'
import StoreSummaryPage from '../../pages/reports/branch/storeSummary'
import TopBranchesPage from '../../pages/reports/branch/topBranches'
import DiscountCardReport from '../../pages/reports/client/discountCardReport'
import BonusProductsPage from '../../pages/reports/product/bonusProducts'
import LFLReport from '../../pages/reports/product/lfl'
import ProductReportPage from '../../pages/reports/product/productReport'
import TopProductsPage from '../../pages/reports/product/topProducts'
import SellerBonus from '../../pages/reports/vendor/sellerBonus'
import TopVendorsPage from '../../pages/reports/vendor/topVendor'

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
    {
      path: 'discount-card-report',
      children: [{ path: '', element: <DiscountCardReport /> }],
    },
  ],
}

export default reportsInsideRoutes
