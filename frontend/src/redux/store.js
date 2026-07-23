import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'

/**
 * Redux store configuration.
 * Add feature slices here as the application grows.
 */
export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  devTools: import.meta.env.DEV,
})
