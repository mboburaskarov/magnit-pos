import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import ProductsPage from '../../pages/products'
import ImportPage from '../../pages/products/import'
import ProductReviewsPage from '../../pages/products/product-reviews'

const productsRoutes = {
  path: 'products',
  element: <LayoutWithHeaderNavbar />,
  children: [
    {
      path: '',
      element: <ProductsPage />,
    },
    {
      path: 'reviews',
      element: <ProductReviewsPage />,
    },
    {
      path: 'import',
      element: <ImportPage />,
    },
  ],
}

export default productsRoutes
