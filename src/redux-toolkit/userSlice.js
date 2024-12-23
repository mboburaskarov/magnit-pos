import { createSlice } from '@reduxjs/toolkit'

const userData = createSlice({
  name: 'userData',
  initialState: {
    first_name: 'Unknown',
    last_name: 'Unknown',
    type: 'SUPER_ADMIN',
    phone: '',
    id: 'undefined',
    role_actions: [],
    store: [],
  },
  reducers: {
    setUserData(state, action) {
      state.first_name = action.payload.first_name
      state.last_name = action.payload.last_name
      state.photo = action.payload.photo
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
