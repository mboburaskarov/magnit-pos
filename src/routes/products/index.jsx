import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import ProductsPage from '../../pages/products'
import ProductReviewsPage from '../../pages/products/product-reviews'

const productsRoutes = {
  path: 'products',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: '',
      element: <ProductsPage />,
    },
    {
      path: 'reviews',
      element: <ProductReviewsPage />,
    },
  ],
}

export default productsRoutes
