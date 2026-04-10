module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        protected

        def sign_in(resource_or_scope, *args)
          # Override to prevent Devise from calling sign_in after signup
          # which requires session in API-only mode
        end

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            token = Warden::JWTAuth::UserEncoder.new.call(
              resource,
              resource.class,
              nil
            ).first

            response.headers['Authorization'] = "Bearer #{token}"

            render json: {
              message: 'Signed up successfully.',
              user: user_response(resource)
            }, status: :created
          else
            render json: {
              message: 'Signup failed.',
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def sign_up_params
          params.require(:user).permit(
            :first_name,
            :last_name,
            :email,
            :password,
            :password_confirmation
          )
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