import MainLayout from '../../layouts/MainLayout'
import AutoOrderDetailPage from '../../pages/products/autoOrderDetail'
import ImportDetailsPage from '../../pages/products/importDetails'
import ImportWithCheckingPage from '../../pages/products/importWithChecking'
import InventoryDetailPage from '../../pages/products/inventoryDetails/index'
import InventoryWithCheckingPage from '../../pages/products/inventoryWithChecking/index'
import ProductCreatePage from '../../pages/products/product-create'
import ProductEditPage from '../../pages/products/product-edit'
import WriteOffScanWithCheckingPage from '../../pages/products/writeOff2WithChecking'
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
      path: 'inventory-with-checking/:id',
      children: [
        {
          path: '',
          element: <InventoryWithCheckingPage />,
        },
      ],
    },
    {
      path: 'write-off-with-checking/:id',
      children: [
        {
          path: '',
          element: <WriteOffScanWithCheckingPage />,
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
      path: 'inventory/:id',
      children: [
        {
          path: '',
          element: <InventoryDetailPage />,
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
