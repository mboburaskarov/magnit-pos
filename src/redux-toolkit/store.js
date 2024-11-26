import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { sidebarSettingsSlice } from './sidebarSettingsSlice'
import { userSlice } from './userSlice'
import { orderTableColumnsSlice } from './tableSlices/orderTableColumns'
import { productsTableColumnsSlice } from './tableSlices/productsTableColumns'
import { shopTableColumnsSlice } from './tableSlices/shopTableColumns'
import { notificationsTableColumnsSlice } from './tableSlices/notificationsTableColumns'
import { notificationCustomTableColumnsSlice } from './tableSlices/notificationsCustomTableColumns'
import { rolesTableColumnsSlice } from './tableSlices/rolesTableColumns'
import { clientTableColumnsSlice } from './tableSlices/clientTableColumns'
import { usersTableColumnsSlice } from './tableSlices/userTableColumns'
import { transactionsTableColumnsSlice } from './tableSlices/transactionsTableColumns'
import { couriersColumns } from './tableSlices/couriers'
import { qrSaleTableColumnsSlice } from './tableSlices/qrSaleTableColumns'

// Define your migration function here
const migrations = {
  // Example migration
  9: (state) => {
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
  version: 9, // Current version of the persisted state
  migrate: (state) => {
    // Apply migrations based on state version
    return migrations[state._persist.version](state)
  },
}

const reducer = combineReducers({
  sidebarSettings: sidebarSettingsSlice,
  orderTableColumns: orderTableColumnsSlice,
  transactionsTableColumns: transactionsTableColumnsSlice,
  qrSaleTableColumns: qrSaleTableColumnsSlice,
  shopTableColumns: shopTableColumnsSlice,
  productsTableColumns: productsTableColumnsSlice,
  clientTableColumns: clientTableColumnsSlice,
  user: userSlice,
  notificationsTableColumns: notificationsTableColumnsSlice,
  notificationCustomCreate: notificationCustomTableColumnsSlice,
  rolesTableColumns: rolesTableColumnsSlice,
  usersTableColumns: usersTableColumnsSlice,
  courierstableColumns: couriersColumns,
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
