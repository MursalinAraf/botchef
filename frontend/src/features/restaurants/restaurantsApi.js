import { baseApi } from 'app/baseApi'
import { API_ROUTES } from 'app/apiRoutes'

export const restaurantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query({
      query: () => API_ROUTES.restaurants.index,
      providesTags: ['Restaurant'],
    }),

    createRestaurant: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.restaurants.index,
        method: 'POST',
        body: { restaurant: data },
      }),
      invalidatesTags: ['Restaurant'],
    }),

    updateRestaurant: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ROUTES.restaurants.show(id),
        method: 'PATCH',
        body: { restaurant: data },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Restaurant', { type: 'Restaurant', id }],
    }),

    deleteRestaurant: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.restaurants.show(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Restaurant'],
    }),

    getBotConfig: builder.query({
      query: (restaurantId) => API_ROUTES.restaurants.botConfig(restaurantId),
      providesTags: (_result, _error, restaurantId) => [{ type: 'BotConfig', id: restaurantId }],
    }),

    upsertBotConfig: builder.mutation({
      query: ({ restaurantId, ...data }) => ({
        url: API_ROUTES.restaurants.upsertBotConfig(restaurantId),
        method: 'PUT',
        body: { bot_config: data },
      }),
      invalidatesTags: (_result, _error, { restaurantId }) => [
        { type: 'BotConfig', id: restaurantId },
        { type: 'Restaurant', id: restaurantId },
      ],
    }),
  }),
})

export const {
  useGetRestaurantsQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
  useGetBotConfigQuery,
  useUpsertBotConfigMutation,
} = restaurantsApi
