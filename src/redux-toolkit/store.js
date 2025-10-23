import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { sidebarSettingsSlice } from './sidebarSettingsSlice'
import { autoOrderDetailSlice } from './tableSlices/autoOrderDetailTableColumns'
import { autoOrderTableColumnsSlice } from './tableSlices/autoOrderTableColumns'
import { bannedProductTableColumnsSlice } from './tableSlices/bannedProductTableColumns'
import { bonusProductTableColumnsSlice } from './tableSlices/bonusProductTableColumns'
import { cardShiftTableColumnsSlice } from './tableSlices/cardShiftTableColumns'
import { cashBoxShiftHistoryTableColumnsSlice } from './tableSlices/cashBoxShiftHistoryTableColumns'
import { cashBoxShiftsTableColumnsSlice } from './tableSlices/cashBoxShiftsTableColumns'
import { cashboxTableColumnsSlice } from './tableSlices/cashboxTableColumns'
import { changePriceDetailSlice } from './tableSlices/changePriceDetailTableColumns'
import { revaluationTableColumnsSlice } from './tableSlices/changePriceTableColumns'
import { clientTableColumnsSlice } from './tableSlices/clientTableColumns'
import { companiesTableColumnsSlice } from './tableSlices/companiesTableColumns'
import { discountCardTableColumnsSlice } from './tableSlices/discountCardTableColumns'
import { expiredImportsTableColumnsSlice } from './tableSlices/expiredImportsTableColumns'
import { importDetailsTableColumnsSlice } from './tableSlices/importDetailTableColumns'
import { importWithCheckingTableColumnsSlice } from './tableSlices/importWithCheckingTableColumns'
import { importsTableColumnsSlice } from './tableSlices/importsTableColumns'
import { inventoryDetailsTableColumnsSlice } from './tableSlices/inventoryDetailTableColumns'
import { inventoryTableColumnsSlice } from './tableSlices/inventoryTableColumns'
import { inventoryWithCheckingTableColumnsSlice } from './tableSlices/inventoryWithCheckingTableColumns'
import { minMaxTableColumnsSlice } from './tableSlices/minMaxTableColumns'
import { orderTableColumnsSlice } from './tableSlices/orderTableColumns'
import { paymentAssetsTableColumnsSlice } from './tableSlices/paymentAssetsTableColumns'
import { productPriceListTableColumnsForProductSlice } from './tableSlices/productPriceListTableColumnsForProduct'
import { productQuantityByDateReportTableColumnsSlice } from './tableSlices/productQuantityByDateReportTableColumns'
import { productReportTableColumnsSlice } from './tableSlices/productReportTableColumns'
import { productsTableColumnsSlice } from './tableSlices/productsTableColumns'
import { productsTableForChangeByStoreColumnsSlice } from './tableSlices/productsTableForChangeByStoreColumns'
import { returnToWarehouseGetWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseGetWithCheckingTableColumns'
import { returnToWarehouseRecheckWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseRecheckWithCheckingTableColumns'
import { returnToWarehouseSentWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseSentWithCheckingTableColumns'
import { returnToWarehouseTableColumnsSlice } from './tableSlices/returnToWarehouseTableColumns'
import { rolesTableColumnsSlice } from './tableSlices/rolesTableColumns'
import { salesTableColumnsSlice } from './tableSlices/salesTableColumns'
import { sellerBonusTableColumnsSlice } from './tableSlices/sellerBonusTableColumns'
import { storeReportTableColumnsSlice } from './tableSlices/storeReportTableColumns'
import { storeSummaryTableColumnsSlice } from './tableSlices/storeSummaryTableColumns'
import { storeTableColumnsSlice } from './tableSlices/storeTableColumns'
import { storesListTableColumnsForProductSlice } from './tableSlices/storesListTableColumnsForProduct'
import { topReportTableColumnsSlice } from './tableSlices/topReportsTableColumns'
import { taransferGetWithCheckingTableColumnsSlice } from './tableSlices/transferGetWithCheckingTableColumns'
import { transferRecheckWithCheckingTableColumnsSlice } from './tableSlices/transferRecheckWithCheckingTableColumns'
import { transferSentWithCheckingTableColumnsSlice } from './tableSlices/transferSentWithCheckingTableColumns'
import { transferTableColumnsSlice } from './tableSlices/transferTableColumns'
import { vendorsTableColumnsSlice } from './tableSlices/vendorsTableColumns'
import { writeOffTableColumnsSlice } from './tableSlices/writeOffTableColumns'
import { writeOffWithCheckingTableColumnsSlice } from './tableSlices/writeOffWithCheckingTableColumns'
import { userSlice } from './userSlice'

// Define your migration function here
const migrations = {
  // Example migration
  386: (state) => {
    // Check if state needs migration
    if (!state.migrated) {
      // Perform migration logic
      return Promise.resolve({
        ...state,
        // Update state to indicate migration has been applied
        migrated: true,
      })
    }
    return Promise.resolve(state)
  },
  // Add more migrations as needed
}

const persistConfig = {
  key: 'root',
  storage,
  version: 386, // Current version of the persisted state
  migrate: (state) => {
    // Apply migrations based on state version
    return migrations[state._persist.version](state)
  },
}

const reducer = combineReducers({
  sidebarSettings: sidebarSettingsSlice,
  orderTableColumns: orderTableColumnsSlice,
  productsTableColumns: productsTableColumnsSlice,
  productsTableForChangeByStoreColumns: productsTableForChangeByStoreColumnsSlice,
  cardShiftTableColumns: cardShiftTableColumnsSlice,
  importsTableColumns: importsTableColumnsSlice,
  expiredImportsTableColumns: expiredImportsTableColumnsSlice,
  inventoryTableColumns: inventoryTableColumnsSlice,
  writeOffTableColumns: writeOffTableColumnsSlice,
  autoOrderTableColumns: autoOrderTableColumnsSlice,
  storeSummaryTableColumns: storeSummaryTableColumnsSlice,
  revaluationTableColumns: revaluationTableColumnsSlice,
  bonusProductTableColumns: bonusProductTableColumnsSlice,
  discountCardTableColumns: discountCardTableColumnsSlice,
  bannedProductTableColumns: bannedProductTableColumnsSlice,
  minMaxTableColumns: minMaxTableColumnsSlice,
  autoOrderTableDetailColumns: autoOrderDetailSlice,
  changePriceTableDetailColumns: changePriceDetailSlice,
  importDetailsColumns: importDetailsTableColumnsSlice,
  inventoryDetailsColumns: inventoryDetailsTableColumnsSlice,
  importWithCheckingColumns: importWithCheckingTableColumnsSlice,
  inventoryWithCheckingColumns: inventoryWithCheckingTableColumnsSlice,
  writeOffWithCheckingColumns: writeOffWithCheckingTableColumnsSlice,
  returnToWarehouseGetWithCheckingColumns: returnToWarehouseGetWithCheckingTableColumnsSlice,
  returnToWarehouseRecheckWithCheckingColumns: returnToWarehouseRecheckWithCheckingTableColumnsSlice,
  transferRecheckWithCheckingColumns: transferRecheckWithCheckingTableColumnsSlice,
  returnToWarehouseSentWithCheckingColumns: returnToWarehouseSentWithCheckingTableColumnsSlice,
  returnToWarehouseTableColumns: returnToWarehouseTableColumnsSlice,
  transferGetWithCheckingColumns: taransferGetWithCheckingTableColumnsSlice,
  transferSentWithCheckingColumns: transferSentWithCheckingTableColumnsSlice,
  transferTableColumns: transferTableColumnsSlice,

  salesTableColumns: salesTableColumnsSlice,
  cashBoxShiftsTableColumns: cashBoxShiftsTableColumnsSlice,
  cashBoxShiftHistoryTableColumns: cashBoxShiftHistoryTableColumnsSlice,
  vendorsTableColumns: vendorsTableColumnsSlice,
  sellerBonusTableColumns: sellerBonusTableColumnsSlice,
  cashboxTableColumns: cashboxTableColumnsSlice,
  paymentAssetsTableColumns: paymentAssetsTableColumnsSlice,
  clientTableColumns: clientTableColumnsSlice,
  topReportsTableColumns: topReportTableColumnsSlice,
  productReportTableColumns: productReportTableColumnsSlice,
  productQuantityByDateReportTableColumns: productQuantityByDateReportTableColumnsSlice,
  storeReportTableColumns: storeReportTableColumnsSlice,
  companiesTableColumns: companiesTableColumnsSlice,
  user: userSlice,
  productPriceListTableColumnsForProduct: productPriceListTableColumnsForProductSlice,
  storesListTableColumnsForProduct: storesListTableColumnsForProductSlice,
  storeTableColumns: storeTableColumnsSlice,
  rolesTableColumns: rolesTableColumnsSlice,
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
export default store
