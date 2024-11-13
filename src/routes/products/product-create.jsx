import MainLayout from '../../layouts/MainLayout'
import ProductCreatePage from '../../pages/products/product-create'
import ProductEditPage from '../../pages/products/product-edit'

const productsCreateRoutes = {
  path: 'products',
  element: <MainLayout />,
  children: [
    {
      path: 'create',
      element: <ProductCreatePage />,
    },
    {
      path: 'edit/:id',
      children: [{ path: '', element: <ProductEditPage /> }],
    },
  ],
}

export default productsCreateRoutes
