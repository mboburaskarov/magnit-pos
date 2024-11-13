import { createSlice } from '@reduxjs/toolkit'

const sidebarSettings = createSlice({
  name: 'sidebarSettings',
  initialState: {
    isOpen: true,
  },
  reducers: {
    sidebarToggle(state, action) {
      state.isOpen = action.payload
    },
  },
})

export const { sidebarToggle } = sidebarSettings.actions
export const sidebarSettingsSlice = sidebarSettings.reducer
