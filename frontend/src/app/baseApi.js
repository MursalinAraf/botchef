import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      // In PR #2 we will read the JWT from state and attach it here:
      // const token = (state) => state.auth.token
      // if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  // Feature API slices will inject their endpoints here
  endpoints: () => ({}),
})
