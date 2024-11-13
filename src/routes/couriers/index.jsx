import Couriers from '../../pages/couriers'
import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'

const couriersRoutes = {
  path: 'couriers',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: '',
      element: <Couriers />,
    },
  ],
}

export default couriersRoutes
