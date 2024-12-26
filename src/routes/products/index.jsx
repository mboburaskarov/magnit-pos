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
      path: 'all',
      element: <ProductsPage />,
    },

    {
      path: 'import',
      element: <ImportPage />,
    },
  ],
}

export default productsRoutes
