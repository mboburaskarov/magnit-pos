import { createSlice } from '@reduxjs/toolkit'

const userData = createSlice({
  name: 'userData',
  initialState: {
    fullName: 'Buchet User',
    type: 'SUPER_ADMIN',
    phone: '',
    id: 'undefined',
    role_actions: [],
    store: [],
  },
  reducers: {
    setUserData(state, action) {
      state.fullName = `${action.payload.first_name} ${action.payload.last_name}`
      state.type = 'SUPER_ADMIN'
      state.phone = action.payload.phone
      state.id = action.payload.id
      state.store = action.payload.store
      state.role_actions = action.payload.role_actions
    },
  },
})

export const { setUserData } = userData.actions
export const userSlice = userData.reducer
