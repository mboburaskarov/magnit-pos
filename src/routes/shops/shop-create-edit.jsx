import MainLayout from '../../layouts/MainLayout'
import ShopCreatePage from '../../pages/shops/shop-create'
import ShopEditPage from '../../pages/shops/shop-edit'

const shopCreateEditRoutes = {
  path: 'shops',
  element: <MainLayout />,
  children: [
    {
      path: 'create',
      element: <ShopCreatePage />,
    },
    {
      path: 'edit/:id',
      children: [{ path: '', element: <ShopEditPage /> }],
    },
  ],
}

export default shopCreateEditRoutes
