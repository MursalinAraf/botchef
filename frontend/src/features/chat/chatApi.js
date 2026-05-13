import { baseApi } from 'app/baseApi'
import { API_ROUTES } from 'app/apiRoutes'

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ restaurantId, messages }) => ({
        url: API_ROUTES.chat.create(restaurantId),
        method: 'POST',
        body: { messages },
      }),
    }),
  }),
})

export const { useSendMessageMutation } = chatApi
