import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { sidebarSettingsSlice } from './sidebarSettingsSlice'
import { clientTableColumnsSlice } from './tableSlices/clientTableColumns'
import { importDetailsTableColumnsSlice } from './tableSlices/importDetailTableColumns'
import { importsTableColumnsSlice } from './tableSlices/importsTableColumns'
import { orderTableColumnsSlice } from './tableSlices/orderTableColumns'
import { productsTableColumnsSlice } from './tableSlices/productsTableColumns'
import { rolesTableColumnsSlice } from './tableSlices/rolesTableColumns'
import { salesTableColumnsSlice } from './tableSlices/salesTableColumns'
import { storeTableColumnsSlice } from './tableSlices/storeTableColumns'
import { storesListTableColumnsForProductSlice } from './tableSlices/storesListTableColumnsForProduct'
import { vendorsTableColumnsSlice } from './tableSlices/vendorsTableColumns'
import { userSlice } from './userSlice'
import { importWithCheckingTableColumnsSlice } from './tableSlices/importWithCheckingTableColumns'
import { cardShiftTableColumnsSlice } from './tableSlices/cardShiftTableColumns'
import { cashboxTableColumnsSlice } from './tableSlices/cashboxTableColumns'

// Define your migration function here
const migrations = {
  // Example migration
  87: (state) => {
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
  version: 87, // Current version of the persisted state
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
  importDetailsColumns: importDetailsTableColumnsSlice,
  importWithCheckingColumns: importWithCheckingTableColumnsSlice,
  salesTableColumns: salesTableColumnsSlice,
  vendorsTableColumns: vendorsTableColumnsSlice,
  cashboxTableColumns: cashboxTableColumnsSlice,
  clientTableColumns: clientTableColumnsSlice,
  user: userSlice,
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
