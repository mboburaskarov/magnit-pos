import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { sidebarSettingsSlice } from './sidebarSettingsSlice'
import { autoOrderDetailSlice } from './tableSlices/autoOrderDetailTableColumns'
import { autoOrderTableColumnsSlice } from './tableSlices/autoOrderTableColumns'
import { bonusProductTableColumnsSlice } from './tableSlices/bonusProductTableColumns'
import { cardShiftTableColumnsSlice } from './tableSlices/cardShiftTableColumns'
import { cashBoxShiftHistoryTableColumnsSlice } from './tableSlices/cashBoxShiftHistoryTableColumns'
import { cashBoxShiftsTableColumnsSlice } from './tableSlices/cashBoxShiftsTableColumns'
import { cashboxTableColumnsSlice } from './tableSlices/cashboxTableColumns'
import { clientTableColumnsSlice } from './tableSlices/clientTableColumns'
import { importDetailsTableColumnsSlice } from './tableSlices/importDetailTableColumns'
import { importWithCheckingTableColumnsSlice } from './tableSlices/importWithCheckingTableColumns'
import { importsTableColumnsSlice } from './tableSlices/importsTableColumns'
import { inventoryDetailsTableColumnsSlice } from './tableSlices/inventoryDetailTableColumns'
import { inventoryTableColumnsSlice } from './tableSlices/inventoryTableColumns'
import { inventoryWithCheckingTableColumnsSlice } from './tableSlices/inventoryWithCheckingTableColumns'
import { orderTableColumnsSlice } from './tableSlices/orderTableColumns'
import { productPriceListTableColumnsForProductSlice } from './tableSlices/productPriceListTableColumnsForProduct'
import { productReportTableColumnsSlice } from './tableSlices/productReportTableColumns'
import { productsTableColumnsSlice } from './tableSlices/productsTableColumns'
import { returnToWarehouseGetWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseGetWithCheckingTableColumns'
import { returnToWarehouseSentWithCheckingTableColumnsSlice } from './tableSlices/returnToWarehouseSentWithCheckingTableColumns'
import { returnToWarehouseTableColumnsSlice } from './tableSlices/returnToWarehouseTableColumns'
import { rolesTableColumnsSlice } from './tableSlices/rolesTableColumns'
import { salesTableColumnsSlice } from './tableSlices/salesTableColumns'
import { sellerBonusTableColumnsSlice } from './tableSlices/sellerBonusTableColumns'
import { storeReportTableColumnsSlice } from './tableSlices/storeReportTableColumns'
import { storeTableColumnsSlice } from './tableSlices/storeTableColumns'
import { storesListTableColumnsForProductSlice } from './tableSlices/storesListTableColumnsForProduct'
import { taransferGetWithCheckingTableColumnsSlice } from './tableSlices/transferGetWithCheckingTableColumns'
import { transferSentWithCheckingTableColumnsSlice } from './tableSlices/transferSentWithCheckingTableColumns'
import { transferTableColumnsSlice } from './tableSlices/transferTableColumns'
import { vendorsTableColumnsSlice } from './tableSlices/vendorsTableColumns'
import { writeOffTableColumnsSlice } from './tableSlices/writeOffTableColumns'
import { writeOffWithCheckingTableColumnsSlice } from './tableSlices/writeOffWithCheckingTableColumns'
import { userSlice } from './userSlice'

// Define your migration function here
const migrations = {
  // Example migration
  252: (state) => {
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
  version: 252, // Current version of the persisted state
  migrate: (state) => {
    // Apply migrations based on state version
    return migrations[state._persist.version](state)
  },
}

const reducer = combineReducers({
  sidebarSettings: sidebarSettingsSlice,
  orderTableColumns: orderTableColumnsSlice,
  productsTableColumns: productsTableColumnsSlice,
  cardShiftTableColumns: cardShiftTableColumnsSlice,
  importsTableColumns: importsTableColumnsSlice,
  inventoryTableColumns: inventoryTableColumnsSlice,
  writeOffTableColumns: writeOffTableColumnsSlice,
  autoOrderTableColumns: autoOrderTableColumnsSlice,
  bonusProductTableColumns: bonusProductTableColumnsSlice,
  autoOrderTableDetailColumns: autoOrderDetailSlice,
  importDetailsColumns: importDetailsTableColumnsSlice,
  inventoryDetailsColumns: inventoryDetailsTableColumnsSlice,
  importWithCheckingColumns: importWithCheckingTableColumnsSlice,
  inventoryWithCheckingColumns: inventoryWithCheckingTableColumnsSlice,
  writeOffWithCheckingColumns: writeOffWithCheckingTableColumnsSlice,
  returnToWarehouseGetWithCheckingColumns: returnToWarehouseGetWithCheckingTableColumnsSlice,
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
  clientTableColumns: clientTableColumnsSlice,
  productReportTableColumns: productReportTableColumnsSlice,
  storeReportTableColumns: storeReportTableColumnsSlice,
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
