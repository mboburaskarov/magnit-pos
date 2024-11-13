import { createSlice } from '@reduxjs/toolkit'

const userData = createSlice({
  name: 'userData',
  initialState: {
    fullName: 'Buchet User',
    type: 'NO ROLE',
    phone: '',
    id: 'undefined',
    role_actions: [],
  },
  reducers: {
    setUserData(state, action) {
      state.fullName = action.payload.fullName
      state.type = action.payload.type
      state.phone = action.payload.phone
      state.id = action.payload._id
      state.role_actions = action.payload.role_actions
    },
  },
})

export const { setUserData } = userData.actions
export const userSlice = userData.reducer
