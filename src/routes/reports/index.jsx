import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import LFLReport from '../../pages/reports/lfl'

const reportsRoutes = {
  path: 'reports',
  element: <LayoutWithHeaderNavbar hasHeader={false} />,

  children: [
    {
      path: 'lfl',
      children: [{ path: '', element: <LFLReport /> }],
    },
  ],
}

export default reportsRoutes
