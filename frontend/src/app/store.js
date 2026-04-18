import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'
import authReducer from '@/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    // RTK Query auto-generates a reducer keyed by the api's reducerPath
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})
