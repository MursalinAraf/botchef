module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          render json: {
            message: 'Logged in successfully.',
            user: user_response(resource)
          }, status: :ok
        end

        def respond_to_on_destroy(*_args)
          if request.headers['Authorization'].present?
            render json: {
              message: 'Logged out successfully.'
            }, status: :ok
          else
            render json: {
              message: 'No active session found.'
            }, status: :unauthorized
          end
        end

        def user_response(user)
          {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
          }
        end
      end
    end
  end
end