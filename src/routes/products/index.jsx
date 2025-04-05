import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import ProductsPage from '../../pages/products'
import AutoOrderPage from '../../pages/products/autoOrder'
import BonusProductPage from '../../pages/products/bonusProduct/index'
import CatalogManagement from '../../pages/products/categories'
import ImportPage from '../../pages/products/import'
import InventoryPage from '../../pages/products/inventory'
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
    {
      path: 'categories',
      element: <CatalogManagement />,
    },
    {
      path: 'auto-order',
      element: <AutoOrderPage />,
    },
    {
      path: 'inventory',
      element: <InventoryPage />,
    },
    {
      path: 'bonus-product',
      element: <BonusProductPage />,
    },
  ],
}

export default productsRoutes
