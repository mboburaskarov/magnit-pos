import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import ProductsPage from '../../pages/products'
import ImportPage from '../../pages/products/import'
import ImportDetailsPage from '../../pages/products/importDetails'
import ImportWithCheckingPage from '../../pages/products/importWithChecking'

const productsRoutes = {
  path: 'products',
  element: <LayoutWithHeaderNavbar />,
  children: [
    {
      path: '',
      element: <ProductsPage />,
    },

    {
      path: 'import',
      element: <ImportPage />,
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

export default productsRoutes
