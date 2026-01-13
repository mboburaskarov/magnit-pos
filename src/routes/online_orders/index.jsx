import OnlineOrders from '@/pages/online_orders/orders'
import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'

const OnlineOrdersRoutes = {
  path: 'online-orders',
  element: <LayoutWithHeaderNavbar />,
  children: [
    {
      path: 'orders',
      element: <OnlineOrders />,
    },
  ],
}

export default OnlineOrdersRoutes
