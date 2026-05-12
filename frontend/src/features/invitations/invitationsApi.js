import { baseApi } from 'app/baseApi'
import { API_ROUTES } from 'app/apiRoutes'

export const invitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvitation: builder.mutation({
      query: (email) => ({
        url: API_ROUTES.invitations.create,
        method: 'POST',
        body: { invitation: { email } },
      }),
    }),

    getInvitation: builder.query({
      query: (token) => API_ROUTES.invitations.show(token),
      providesTags: (_result, _error, token) => [{ type: 'Invitation', id: token }],
    }),

    acceptInvitation: builder.mutation({
      query: ({ token, ...userData }) => ({
        url: API_ROUTES.invitations.accept(token),
        method: 'POST',
        body: { user: userData },
      }),
    }),
  }),
})

export const {
  useSendInvitationMutation,
  useGetInvitationQuery,
  useAcceptInvitationMutation,
} = invitationsApi
