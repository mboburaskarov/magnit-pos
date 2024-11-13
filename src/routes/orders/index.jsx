import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import MainLayout from '../../layouts/MainLayout'
import OrdersPage from '../../pages/orders'
import OrderSinglePage from '../../pages/orders/order-single'
import QRsalePage from '../../pages/orders/qr-sale'
import TransactionsPage from '../../pages/orders/transactions'

const ordersRoutes = {
  path: 'orders',
  children: [
    {
      path: 'all',
      element: <LayoutWithNavbar />,
      children: [
        {
          path: '',
          element: <OrdersPage />,
        },
      ],
    },
    {
      path: 'qr-sale',
      element: <LayoutWithNavbar />,
      children: [
        {
          path: '',
          element: <QRsalePage />,
        },
      ],
    },
    {
      path: 'order-transactions',
      element: <LayoutWithNavbar />,
      children: [
        {
          path: '',
          element: <TransactionsPage />,
        },
      ],
    },
    {
      path: ':id',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <OrderSinglePage />,
        },
      ],
    },
  ],
}

export default ordersRoutes
