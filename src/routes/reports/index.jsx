import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import BranchReportsList from '../../pages/reports/branch'
import PoductReportsList from '../../pages/reports/product'
import VendorReportsList from '../../pages/reports/vendor'

const reportsRoutes = {
  path: 'reports',
  element: <LayoutWithHeaderNavbar />,

  children: [
    {
      path: 'product',
      children: [{ path: '', element: <PoductReportsList /> }],
    },
    {
      path: 'branch',
      children: [{ path: '', element: <BranchReportsList /> }],
    },
    {
      path: 'vendor',
      children: [{ path: '', element: <VendorReportsList /> }],
    },
  ],
}

export default reportsRoutes
