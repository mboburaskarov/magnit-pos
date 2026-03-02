import ProductQtyByDateReportPage from '../../pages/reports/product/productQtyByDateReport'
import RemainingStockPage from '../../pages/reports/product/remainingStock/remainingStock'
import DiscountCardReport from '../../pages/reports/client/discountCardReport'
import ProductReportPage from '../../pages/reports/product/productReport'
import BonusProductsPage from '../../pages/reports/product/bonusProducts'
import TopEmployeesPage from '../../pages/reports/employees/topEmploees'
import StoreSummaryPage from '../../pages/reports/branch/storeSummary'
import TopProductsPage from '../../pages/reports/product/topProducts'
import TopBranchesPage from '../../pages/reports/branch/topBranches'
import StoreReportPage from '../../pages/reports/branch/storeReport'
import SellerBonus from '../../pages/reports/employees/sellerBonus'
import LFLReport from '../../pages/reports/product/lfl'
import MainLayout from '../../layouts/MainLayout'
import LoyaCardReportByUsers from '@/pages/reports/client/loyaCardReportByUsers'

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
      path: 'remaning-stock',
      element: <RemainingStockPage />,
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
      element: <TopEmployeesPage />,
    },

    {
      path: 'store-report',
      children: [{ path: '', element: <StoreReportPage /> }],
    },
    {
      path: 'product-qty-by-date',
      children: [{ path: '', element: <ProductQtyByDateReportPage /> }],
    },
    {
      path: 'discount-card-report',
      children: [{ path: '', element: <DiscountCardReport /> }],
    },
    {
      path: 'loya-card-report-by-users',
      children: [{ path: '', element: <LoyaCardReportByUsers /> }],
    },
  ],
}

export default reportsInsideRoutes
