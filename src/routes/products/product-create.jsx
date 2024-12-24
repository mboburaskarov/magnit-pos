import MainLayout from '../../layouts/MainLayout'
import ImportWithCheckingPage from '../../pages/products/importWithChecking'
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
    {
      path: 'import-with-checking/:id',
      children: [
        {
          path: '',
          element: <ImportWithCheckingPage />,
        },
      ],
    },
  ],
}

export default productsCreateRoutes
