import MainLayout from '../../layouts/MainLayout'
import AutoOrderDetailPage from '../../pages/products/autoOrderDetail'
import ImportDetailsPage from '../../pages/products/importDetails'
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
    {
      path: 'imports/:id',
      children: [
        {
          path: '',
          element: <ImportDetailsPage />,
        },
      ],
    },
    {
      path: 'auto-order/:id',
      children: [
        {
          path: '',
          element: <AutoOrderDetailPage />,
        },
      ],
    },
  ],
}

export default productsCreateRoutes
