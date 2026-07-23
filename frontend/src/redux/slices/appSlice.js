import { createSlice } from '@reduxjs/toolkit'

/**
 * Global application state slice.
 * Placeholder for shared UI state; complaint-specific state will be added later.
 */
const initialState = {
  isLoading: false,
  error: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setLoading, setError, clearError } = appSlice.actions
export default appSlice.reducer
