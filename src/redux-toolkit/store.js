import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { returnToWarehouseRecheckWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseRecheckWithCheckingTableColumns'
import { returnToWarehouseSentWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseSentWithCheckingTableColumns'
import { returnToWarehouseGetWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseGetWithCheckingTableColumns'
import { transferRecheckWithCheckingTableColumnsSlice } from './tableSlices/transferRecheckWithCheckingTableColumns'
import { productQuantityByDateReportTableColumnsSlice } from './tableSlices/productQuantityByDateReportTableColumns'
import { productPriceListTableColumnsForProductSlice } from './tableSlices/productPriceListTableColumnsForProduct'
import { transferSentWithCheckingTableColumnsSlice } from './tableSlices/transferSentWithCheckingTableColumns'
import { productsTableForChangeByStoreColumnsSlice } from './tableSlices/productsTableForChangeByStoreColumns'
import { taransferGetWithCheckingTableColumnsSlice } from './tableSlices/transferGetWithCheckingTableColumns'
import { inventoryWithCheckingTableColumnsSlice } from './tableSlices/inventoryWithCheckingTableColumns'
import { writeOffWithCheckingTableColumnsSlice } from './tableSlices/writeOffWithCheckingTableColumns'
import { storesListTableColumnsForProductSlice } from './tableSlices/storesListTableColumnsForProduct'
import { cashBoxShiftHistoryTableColumnsSlice } from './tableSlices/cashBoxShiftHistoryTableColumns'
import { importWithCheckingTableColumnsSlice } from './tableSlices/importWithCheckingTableColumns'
import { returnToWarehouseTableColumnsSlice } from './tableSlices/returnToWarehouseTableColumns'
import { inventoryDetailsTableColumnsSlice } from './tableSlices/inventoryDetailTableColumns'
import { expiredImportsTableColumnsSlice } from './tableSlices/expiredImportsTableColumns'
import { productReportTableColumnsSlice } from './tableSlices/productReportTableColumns'
import { paymentAssetsTableColumnsSlice } from './tableSlices/paymentAssetsTableColumns'
import { cashBoxShiftsTableColumnsSlice } from './tableSlices/cashBoxShiftsTableColumns'
import { bannedProductTableColumnsSlice } from './tableSlices/bannedProductTableColumns'
import { importDetailsTableColumnsSlice } from './tableSlices/importDetailTableColumns'
import { storeSummaryTableColumnsSlice } from './tableSlices/storeSummaryTableColumns'
import { discountCardTableColumnsSlice } from './tableSlices/discountCardTableColumns'
import { bonusProductTableColumnsSlice } from './tableSlices/bonusProductTableColumns'
import { storeReportTableColumnsSlice } from './tableSlices/storeReportTableColumns'
import { sellerBonusTableColumnsSlice } from './tableSlices/sellerBonusTableColumns'
import { revaluationTableColumnsSlice } from './tableSlices/changePriceTableColumns'
import { changePriceDetailSlice } from './tableSlices/changePriceDetailTableColumns'
import { topReportTableColumnsSlice } from './tableSlices/topReportsTableColumns'
import { inventoryTableColumnsSlice } from './tableSlices/inventoryTableColumns'
import { employeesTableColumnsSlice } from './tableSlices/employeesTableColumns'
import { companiesTableColumnsSlice } from './tableSlices/companiesTableColumns'
import { cardShiftTableColumnsSlice } from './tableSlices/cardShiftTableColumns'
import { autoOrderTableColumnsSlice } from './tableSlices/autoOrderTableColumns'
import { autoOrderDetailSlice } from './tableSlices/autoOrderDetailTableColumns'
import { writeOffTableColumnsSlice } from './tableSlices/writeOffTableColumns'
import { transferTableColumnsSlice } from './tableSlices/transferTableColumns'
import { productsTableColumnsSlice } from './tableSlices/productsTableColumns'
import { importsTableColumnsSlice } from './tableSlices/importsTableColumns'
import { cashboxTableColumnsSlice } from './tableSlices/cashboxTableColumns'
import { minMaxTableColumnsSlice } from './tableSlices/minMaxTableColumns'
import { clientTableColumnsSlice } from './tableSlices/clientTableColumns'
import { branchTableColumnsSlice } from './tableSlices/branchTableColumns'
import { salesTableColumnsSlice } from './tableSlices/salesTableColumns'
import { rolesTableColumnsSlice } from './tableSlices/rolesTableColumns'
import { orderTableColumnsSlice } from './tableSlices/orderTableColumns'
import { sidebarSettingsSlice } from './sidebarSettingsSlice'
import { userSlice } from './userSlice'

// Define your migration function here
const migrations = {
  // Example migration
  405: (state) => {
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
  version: 405, // Current version of the persisted state
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
  employeesTableColumns: employeesTableColumnsSlice,
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
  branchTableColumns: branchTableColumnsSlice,
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
