import { baseApi } from "@/app/baseApi";
import { API_ROUTES } from "../../app/apiRoutes";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: API_ROUTES.auth.signup,
        method: "POST",
        body: {
          user: credentials,
        },
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: API_ROUTES.auth.login,
        method: "POST",
        body: {
          user: credentials,
        },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  authApi;
