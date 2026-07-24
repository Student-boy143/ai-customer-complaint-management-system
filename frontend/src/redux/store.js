import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import complaintsReducer from './slices/complaintsSlice'

/**
 * Redux store configuration.
 * Add feature slices here as the application grows.
 */
export const store = configureStore({
  reducer: {
    app: appReducer,
    complaints: complaintsReducer,
  },
  devTools: import.meta.env.DEV,
})
