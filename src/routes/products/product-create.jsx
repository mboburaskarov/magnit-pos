import MainLayout from '../../layouts/MainLayout'
import AutoOrderDetailPage from '../../pages/products/autoOrderDetail'
import BonusProductPage from '../../pages/products/bonusProduct'
import CatalogManagement from '../../pages/products/categories/index'
import ImportDetailsPage from '../../pages/products/importDetails'
import ImportWithCheckingPage from '../../pages/products/importWithChecking'
import InventoryCompleted from '../../pages/products/inventoryCompleted'
import InventoryDetailPage from '../../pages/products/inventoryDetails/index'
import InventoryWithCheckingPage from '../../pages/products/inventoryWithChecking/index'
import ProductCreatePage from '../../pages/products/product-create'
import ProductEditPage from '../../pages/products/product-edit'
import WriteOffCompletedPage from '../../pages/products/writeOffComplated/index'
import WriteOffScanWithCheckingPage from '../../pages/products/writeOffWithChecking'
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
      path: 'inventory-completed/:id',
      children: [
        {
          path: '',
          element: <InventoryCompleted />,
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
      path: 'write-off-completed/:id',
      children: [
        {
          path: '',
          element: <WriteOffCompletedPage />,
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
      path: 'categories',
      element: <CatalogManagement />,
    },
    {
      path: 'bonus-product',
      element: <BonusProductPage />,
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
