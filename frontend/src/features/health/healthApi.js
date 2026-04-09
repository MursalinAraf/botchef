import { baseApi } from '@/app/baseApi'

export const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => '/health',
    }),
  }),
})

export const { useGetHealthQuery } = healthApi
