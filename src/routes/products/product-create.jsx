import MainLayout from '../../layouts/MainLayout'
import AutoOrderDetailPage from '../../pages/products/autoOrder-all/autoOrderDetail'
import BannedProductPage from '../../pages/products/bannedProduct'
import BonusProductPage from '../../pages/products/bonusProduct'
import CatalogManagement from '../../pages/products/categories/index'
import ChangePriceDetailPage from '../../pages/products/changePrice-all/changePriceDetail'
import ChangePriceDetailViewPage from '../../pages/products/changePrice-all/changePriceDetailView'
import CreateMinMaxPage from '../../pages/products/createMinMax'
import ImportDetailsPage from '../../pages/products/import-all/importDetails'
import ImportWithCheckingPage from '../../pages/products/import-all/importWithChecking'
import InventoryCompleted from '../../pages/products/inventory-all/inventoryCompleted'
import InventoryDetailPage from '../../pages/products/inventory-all/inventoryDetails/index'
import InventoryWithCheckingPage from '../../pages/products/inventory-all/inventoryWithChecking/index'
import InventoryWithCheckingPageNew from '../../pages/products/inventory-all/inventoryWithCheckingNew'
import ProductCreatePage from '../../pages/products/product-create'
import ProductEditPage from '../../pages/products/product-edit'
import ReturnToWarehouseCompletedPage from '../../pages/products/returnToWarehouse-all/returnToWarehouseComplated'
import ReturnToWarehouseGetScanWithCheckingPage from '../../pages/products/returnToWarehouse-all/returnToWarehouseGetWithChecking'
import ReturnToWarehouseRecheckScanWithCheckingPage from '../../pages/products/returnToWarehouse-all/returnToWarehouseRecheckWithChecking'
import ReturnToWarehouseSentScanWithCheckingPage from '../../pages/products/returnToWarehouse-all/returnToWarehouseSentWithChecking'
import TransferCompletedPage from '../../pages/products/transfer-all/transferComplated'
import TransferGetScanWithCheckingPage from '../../pages/products/transfer-all/transferGetWithChecking'
import TransferRecheckScanWithCheckingPage from '../../pages/products/transfer-all/transferRecheckWithChecking'
import TransferSentScanWithCheckingPage from '../../pages/products/transfer-all/transferSentWithChecking'
import WriteOffCompletedPage from '../../pages/products/writeOff-all/writeOffComplated/index'
import WriteOffScanWithCheckingPage from '../../pages/products/writeOff-all/writeOffWithChecking'
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
      path: 'transfer-recheck-with-checking/:id',
      children: [
        {
          path: '',
          element: <TransferRecheckScanWithCheckingPage />,
        },
      ],
    },
    {
      path: 'return-to-warehouse-recheck-with-checking/:id',
      children: [
        {
          path: '',
          element: <ReturnToWarehouseRecheckScanWithCheckingPage />,
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
