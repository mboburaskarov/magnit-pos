import MainLayout from '../../layouts/MainLayout'
import AutoOrderDetailPage from '../../pages/products/autoOrderDetail'
import BannedProductPage from '../../pages/products/bannedProduct'
import BonusProductPage from '../../pages/products/bonusProduct'
import CatalogManagement from '../../pages/products/categories/index'
import ChangePriceDetailPage from '../../pages/products/changePriceDetail'
import ChangePriceDetailViewPage from '../../pages/products/changePriceDetailView'
import CreateMinMaxPage from '../../pages/products/createMinMax'
import ImportDetailsPage from '../../pages/products/importDetails'
import ImportWithCheckingPage from '../../pages/products/importWithChecking'
import InventoryCompleted from '../../pages/products/inventoryCompleted'
import InventoryDetailPage from '../../pages/products/inventoryDetails/index'
import InventoryWithCheckingPage from '../../pages/products/inventoryWithChecking/index'
import InventoryWithCheckingPageNew from '../../pages/products/inventoryWithCheckingNew'
import ProductCreatePage from '../../pages/products/product-create'
import ProductEditPage from '../../pages/products/product-edit'
import ReturnToWarehouseCompletedPage from '../../pages/products/returnToWarehouseComplated'
import ReturnToWarehouseGetScanWithCheckingPage from '../../pages/products/returnToWarehouseGetWithChecking'
import ReturnToWarehouseSentScanWithCheckingPage from '../../pages/products/returnToWarehouseSentWithChecking'
import TransferCompletedPage from '../../pages/products/transferComplated'
import TransferGetScanWithCheckingPage from '../../pages/products/transferGetWithChecking'
import TransferSentScanWithCheckingPage from '../../pages/products/transferSentWithChecking'
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
      path: 'inventory-with-checking/new/:id',
      children: [
        {
          path: '',
          element: <InventoryWithCheckingPageNew />,
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
      path: 'return-to-warehouse-get-with-checking/:id',
      children: [
        {
          path: '',
          element: <ReturnToWarehouseGetScanWithCheckingPage />,
        },
      ],
    },
    {
      path: 'return-to-warehouse-sent-with-checking/:id',
      children: [
        {
          path: '',
          element: <ReturnToWarehouseSentScanWithCheckingPage />,
        },
      ],
    },
    {
      path: 'return-to-warehouse-completed/:id',
      children: [
        {
          path: '',
          element: <ReturnToWarehouseCompletedPage />,
        },
      ],
    },

    {
      path: 'transfer-get-with-checking/:id',
      children: [
        {
          path: '',
          element: <TransferGetScanWithCheckingPage />,
        },
      ],
    },
    {
      path: 'transfer-sent-with-checking/:id',
      children: [
        {
          path: '',
          element: <TransferSentScanWithCheckingPage />,
        },
      ],
    },
    {
      path: 'transfer-completed/:id',
      children: [
        {
          path: '',
          element: <TransferCompletedPage />,
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
      path: 'banned-product',
      element: <BannedProductPage />,
    },
    {
      path: 'min-max-create',
      element: <CreateMinMaxPage />,
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
    {
      path: 'auto-order/view/:id',
      children: [
        {
          path: '',
          element: <AutoOrderDetailPage isNew={false} />,
        },
      ],
    },
    {
      path: 'revaluation/create/:id',
      children: [
        {
          path: '',
          element: <ChangePriceDetailPage />,
        },
      ],
    },
    {
      path: 'revaluation/view/:id',
      children: [
        {
          path: '',
          element: <ChangePriceDetailViewPage />,
        },
      ],
    },
  ],
}

export default productsCreateRoutes
