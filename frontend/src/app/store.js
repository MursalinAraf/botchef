import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'

export const store = configureStore({
  reducer: {
    // RTK Query auto-generates a reducer keyed by the api's reducerPath
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})
