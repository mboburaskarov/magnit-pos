import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar';
import VendorReportsList from '../../pages/reports/employees';
import PoductReportsList from '../../pages/reports/product';
import ClientReportsList from '../../pages/reports/client';
import BranchReportsList from '../../pages/reports/branch';


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
    {
      path: 'client',
      children: [{ path: '', element: <ClientReportsList /> }],
    },
  ],
}

export default reportsRoutes
