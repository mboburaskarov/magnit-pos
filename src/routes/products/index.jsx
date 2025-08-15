import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import ProductsPage from '../../pages/products'
import AutoOrderPage from '../../pages/products/autoOrder'
import ChangePricePage from '../../pages/products/changePrice'
import ProductsPageByImport from '../../pages/products/changeProductByImport'
import ImportPage from '../../pages/products/import'
import InventoryPage from '../../pages/products/inventory'
import RejectedProducts from '../../pages/products/rejectedProducts/RejectedProducts'
import ReturnToWarehousePage from '../../pages/products/returnToWarehouse'
import TransferPage from '../../pages/products/transfer'
import WriteOffPage from '../../pages/products/writeOff'
const productsRoutes = {
  path: 'products',
  element: <LayoutWithHeaderNavbar />,
  children: [
    {
      path: 'all',
      element: <ProductsPage />,
    },
    {
      path: 'rejected-products',
      element: <RejectedProducts />,
    },
    {
      path: 'all-by-import',
      element: <ProductsPageByImport />,
    },

    {
      path: 'import',
      element: <ImportPage />,
    },

    {
      path: 'auto-order',
      element: <AutoOrderPage />,
    },
    {
      path: 'revaluation',
      element: <ChangePricePage />,
    },

    {
      path: 'inventory',
      element: <InventoryPage />,
    },

    {
      path: 'transfer',
      element: <TransferPage />,
    },
    {
      path: 'write-off',
      element: <WriteOffPage />,
    },
    {
      path: 'return-to-warehouse',
      element: <ReturnToWarehousePage />,
    },
    {
      path: 'trasnfer',
      element: <TransferPage />,
    },
  ],
}

export default productsRoutes
